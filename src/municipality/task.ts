import { currentDate, dateFolderCheck, folder, todayFile, timeFile, typeLatest } from '../util/folder-generators';
import { get } from './scraper';
import { parse } from './parser';
import * as fs from 'fs';
import * as path from 'path';

const appDir = path.dirname(require.main.filename) + '/../';

function write(
    location: string,
    data: string
) {
    fs.writeFileSync(path.join(appDir, location), data, 'utf-8');
}

function writeJson(
    location: string,
    data: any
) {
    fs.writeFileSync(path.join(appDir, location), JSON.stringify(data, null, 2), 'utf-8');
}

export async function triggerMunicipalityUpdate() {
    const data = await get();
    const { time, today } = currentDate();
    const {
        json,
        fullCsv,
        fullCsvInternational
    } = await parse(data);

    dateFolderCheck('csv', today);
    write(timeFile('csv', today, time), fullCsv);
    write(todayFile('csv', today), fullCsv);
    write(todayFile('csv', today), fullCsv);
    write(typeLatest('csv'), fullCsv);

    dateFolderCheck('international-csv', today);
    write(timeFile('international-csv', today, time), fullCsvInternational);
    write(todayFile('international-csv', today), fullCsvInternational);
    write(todayFile('international-csv', today), fullCsvInternational);
    write(typeLatest('international-csv', 'international-'), fullCsvInternational);

    dateFolderCheck('json', today);
    writeJson(timeFile('json', today, time), json);
    writeJson(todayFile('json', today), json);
    writeJson(todayFile('json', today), json);
    writeJson(typeLatest('json'), json);

    return {
        today,
        time
    };
}
