require('dotenv').config();

import { triggerHistoryUpdate } from './history/task';
import { triggerMunicipalityUpdate } from './municipality/task';
import { commitUpdate } from './util/commit-update';
import { CronJob } from 'cron';
import { updateFileIndex } from './util/update-file-index';

// Initialize git instance in root folder
const git = require('simple-git/promise')();

async function municipalityJobTrigger() {
    const { today, time } = await triggerMunicipalityUpdate();

    updateFileIndex();
    await triggerHistoryUpdate();

    // If we are on the server we commit the changes and push them to github
    if ( process.env.ENV === 'prod' ) {
        await commitUpdate(git, today, time);
    }

    console.log('Next trigger', municipalityJob.nextDate().toString());
}

// Everyday at around 14:00 RIVM updates the data.
// This can take some time so we trigger it around 15:00.
// We trigger around 4 times a day:
// 1 => Tue Mar 24 2020 05:00:00 GMT+0100
// 2 => Tue Mar 24 2020 10:00:00 GMT+0100
// 3 => Tue Mar 24 2020 15:00:00 GMT+0100 => RIVM should has updated their data
// 4 => Tue Mar 24 2020 20:00:00 GMT+0100
const municipalityJob = new CronJob('0 5/5 * * *', () => municipalityJobTrigger(), null, true, 'Europe/Amsterdam');
municipalityJob.start();

console.log('Next triggers:');
console.log((municipalityJob.nextDates(10) as any[]).map((
    date,
    i
) => `${i + 1} => ${date.toString()}`).join('\n'));

if ( process.env.ENV === 'dev' || process.env.FORCE_TRIGGER === 'true' ) {
    municipalityJob.fireOnTick();
    triggerHistoryUpdate();
}
