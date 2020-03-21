import * as fs from 'fs';
import * as moment from 'moment-timezone';

const baseFolder = process.env.BASE_FOLDER || 'Municipalities';

export const dateFormat = 'MM-DD-YYYY';
export const timeFormat = 'HH:mm:ss';
export const format = `${dateFormat} ${timeFormat}`;

export type GeneratorTypes = 'csv' | 'json' | 'international-csv';

/**
 * File extensions
 */
const fileExtensions: { [key in GeneratorTypes]: string } = {
    'international-csv': 'csv',
    csv: 'csv',
    json: 'json'
};

/**
 * Folders
 */
const folders: { [key in GeneratorTypes]: string } = {
    'international-csv': 'international-csv',
    csv: 'csv',
    json: 'json'
};

/**
 * Formats date in the right format
 * @param date
 */
export function formatDate(date: moment.Moment) {
    const today = date.format(dateFormat);
    const time = date.format(timeFormat);

    return {
        today,
        time
    };
}

/**
 * Generates current date strings
 */
export function currentDate() {
    const date = moment.tz('Europe/Amsterdam');

    return {
        date,
        ...formatDate(date)
    };
}

/**
 * e.g /Municipalities/csv
 * @param type
 */
export const folder = (type: GeneratorTypes) => `${baseFolder}/${folders[ type ]}`;

/**
 * e.g /Municipalities/csv/20-03-2020
 * @param type
 * @param today
 */
export const dateFolder = (
    type: GeneratorTypes,
    today: string
) => `${folder(type)}/${today}`;

/**
 * e.g /Municipalities/csv/20-03-2020/20:00:00.csv
 * @param type
 * @param today
 * @param time
 */
export const timeFile = (
    type: GeneratorTypes,
    today: string,
    time: string
) => `${dateFolder(type, today)}/${time}.${fileExtensions[ type ]}`;

/**
 * e.g /Municipalities/csv/20-03-2020-latest.csv
 * @param type
 * @param today
 */
export const todayFile = (
    type: GeneratorTypes,
    today: string
) => `${folder(type)}/${today}-latest.${fileExtensions[ type ]}`;

/**
 * e.g /Municipalities/latest.csv
 * @param type
 * @param prefix
 */
export const typeLatest = (
    type: GeneratorTypes,
    prefix: string = ''
) => `${baseFolder}/${prefix}latest.${fileExtensions[ type ]}`;

/**
 * Checks folder if exists and if not, creates it
 * @param type
 * @param today
 */
export const dateFolderCheck = (
    type: GeneratorTypes,
    today: string
) => {
    if ( !fs.existsSync(dateFolder(type, today)) ) {
        fs.mkdirSync(dateFolder(type, today));
    }
};
