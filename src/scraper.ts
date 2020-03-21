require('dotenv').config();

import { triggerMunicipalityUpdate } from './municipality/task';
import { update } from './update';
import { CronJob } from 'cron';

// Initialize git instance in root folder
const git = require('simple-git/promise')();

async function municipalityJobTrigger() {
    const { today, time } = await triggerMunicipalityUpdate();

    if ( process.env.ENV === 'prod' ) {
        await update(git, today, time);
    }

    console.log('Next trigger', municipalityJob.nextDate());
}

const municipalityJob = new CronJob('0 */2 * * *', () => municipalityJobTrigger(), null, true, 'Europe/Amsterdam');
municipalityJob.start();

// Everyday at around 14:00 RIVM updates the data however. This can take some time so we trigger it around 14:30 again.
const municipalityJob2 = new CronJob('30 14 * * *', () => municipalityJobTrigger(), null, true, 'Europe/Amsterdam');
municipalityJob2.start();

console.log('First trigger', municipalityJob.nextDate());

if ( process.env.ENV === 'dev' || process.env.FORCE_TRIGGER === 'true' ) {
    municipalityJob.fireOnTick();
}
