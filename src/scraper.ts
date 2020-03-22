require('dotenv').config();

import { triggerHistoryUpdate } from './history/task';
import { triggerMunicipalityUpdate } from './municipality/task';
import { commitUpdate } from './util/commit-update';
import { CronJob } from 'cron';
import { updateFileIndex } from './util/update-file-index';

// Initialize git instance in root folder
const git = require('simple-git/promise')();

async function municipalityJobTrigger(rivmUpdate: boolean = false) {
    const { today, time } = await triggerMunicipalityUpdate();

    updateFileIndex();

    if ( rivmUpdate ) {
        await triggerHistoryUpdate();
    }

    if ( process.env.ENV === 'prod' ) {
        await commitUpdate(git, today, time);
    }

    console.log('Next trigger', municipalityJob.nextDate().toString());
}

const municipalityJob = new CronJob('0 */2 * * *', () => municipalityJobTrigger(), null, true, 'Europe/Amsterdam');
municipalityJob.start();

// Everyday at around 14:00 RIVM updates the data however. This can take some time so we trigger it around 14:30 again.
const municipalityJob2 = new CronJob('30 14 * * *', () => municipalityJobTrigger(true), null, true, 'Europe/Amsterdam');
municipalityJob2.start();

console.log('First trigger', municipalityJob.nextDate().toString());

if ( process.env.ENV === 'dev' || process.env.FORCE_TRIGGER === 'true' ) {
    municipalityJob2.fireOnTick();
    // triggerHistoryUpdate();
}
