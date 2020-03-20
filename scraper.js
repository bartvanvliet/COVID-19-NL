const CronJob = require('cron').CronJob,
    axios = require('axios'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path'),
    csv = require('csvtojson'),
    moment = require('moment'),
    git = require('simple-git/promise')();

const job = new CronJob('0 */2 * * *', loadAndSave, null, true, 'Europe/Amsterdam');

const baseFolder = 'Municipalities';

async function loadAndSave() {
    const result = await axios.get('https://www.rivm.nl/coronavirus-kaart-van-nederland-per-gemeente');
    const $ = cheerio.load(result.data);

    const data = $('#csvData');

    if ( data.length === 0 ) {
        console.error('Problem finding csvData');
    }

    if ( data[ 0 ].children.length === 0 ) {
        console.error('Problem finding contents of csvData');
    }

    const lines = data[ 0 ].children[ 0 ].data.trim().split('\n');
    const headers = lines[ 0 ]
        .split('Aantal per 100.000 inwoners')
        .join('GemiddeldOverBev')
        .split(';');
    lines.splice(0, 1);
    if ( lines[ 0 ].startsWith('-1;') ) {
        lines.splice(0, 1);
    }

    const json = await csv({ headers, delimiter: [ ';' ] }).fromString(lines.join('\n'));
    const d = moment();
    const today = d.format('DD-MM-YYYY');
    const time = d.format('HH:mm:ss');
    const folder = type => `${baseFolder}/${type}`;
    const dateFolder = type => `${folder(type)}/${today}`;
    const locationFolder = type => `${dateFolder(type)}/${time}.${type}`;
    const locationLatest = type => `${folder(type)}/${today}-latest.${type}`;
    const typeLatest = type => `${baseFolder}/latest.${type}`;
    const dateFolderCheck = type => {
        if ( !fs.existsSync(dateFolder(type)) ) {
            fs.mkdirSync(dateFolder(type));
        }
    };

    dateFolderCheck('csv');
    const writeCSV = (location) => fs.writeFileSync(path.join(__dirname, location), headers.join(';') + '\n' + lines.join('\n'), 'utf-8');
    writeCSV(locationFolder('csv'));
    writeCSV(locationLatest('csv'));
    writeCSV(typeLatest('csv'));

    dateFolderCheck('json');
    const writeJSON = (location) => fs.writeFileSync(path.join(__dirname, location), JSON.stringify(json, null, 2), 'utf-8');
    writeJSON(locationFolder('json'));
    writeJSON(locationLatest('json'));
    writeJSON(typeLatest('json'));
    console.log('Next trigger', job.nextDate());

    const isRepo = await git.checkIsRepo();

    if ( isRepo ) {
        await git.pull();
        await git.add('./*');
        await git.commit(`📈 Update at ${today} at ${time} by scraper`);
        await git.push(['-u', 'origin', 'master']);
    } else {
        console.error('Not a git repo. Nothing to commit.')
    }
}

job.start();

console.log('First trigger', job.nextDate());
