require('dotenv').config();

import { triggerMunicipalityUpdate } from './municipality/task';
import { update } from './update';
import { CronJob } from 'cron';

// Initialize git instance in root folder
const git = require('simple-git/promise')();

const municipalityJob = new CronJob('0 */2 * * *', async () => {
    const { today, time } = await triggerMunicipalityUpdate();

    if ( process.env.ENV === 'prod' ) {
        await update(git, today, time);
    }

    console.log('Next trigger', municipalityJob.nextDate());
}, null, true, 'Europe/Amsterdam');

municipalityJob.start();

console.log('First trigger', municipalityJob.nextDate());

if(process.env.ENV === 'dev') {
    municipalityJob.fireOnTick()
}
