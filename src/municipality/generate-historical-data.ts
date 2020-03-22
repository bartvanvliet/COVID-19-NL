import * as csv from 'csvtojson';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import * as path from 'path';
import { MunicipalityData } from './municipality-data';
import {
    dateFolderCheck,
    dateFormat,
    format,
    formatDate,
    timeFile,
    todayFile
} from './folder-generators';
import { calculateAverageOverPopulation } from '../util/math';
import { appDir, write, writeJson } from '../util/writers';

interface IDataItem {
    date: moment.Moment;
    municipalities: MunicipalityData[]
}

interface IDataMap {
    [ date: string ]: IDataItem
}

const data: IDataMap = {};

function header(delimiter: string) {
    return [
        'Gemnr',
        'Gemeente',
        'Aantal',
        'BevAant',
        'GemiddeldOverBev'
    ].join(delimiter);
}

function toCSV(
    date: moment.Moment,
    municipalities: MunicipalityData[],
    delimiter: string
) {
    return `${header(delimiter)}\n` + municipalities.map((municipality) => [
        municipality.Gemnr,
        municipality.Gemeente,
        municipality.Aantal,
        municipality.BevAant,
        municipality.GemiddeldOverBev
    ].join(delimiter)).join('\n');
}

function sort(data: IDataItem) {
    data.municipalities = _.sortBy(data.municipalities, 'Gemeente', 'asc');
    return data;
}

async function parse() {
    const lines = fs.readFileSync(path.join(appDir, 'historical-data.csv'), 'utf-8')
        .split('\n');

    // Remove headers
    const headers = lines[ 0 ].split(',');
    lines.splice(0, 1);

    const json = await csv({ headers, noheader: true }).fromString(lines.join('\n'));

    function cleanKey(key: string) {
        return key.split('COVID ').join('');
    }

    json.map((item) => {
        const dateKeys: { key: string, date: moment.Moment, originalKey: string }[] = Object.keys(item)
            .filter((key) => key.indexOf('COVID ') > -1)
            .map((key) => ({
                originalKey: key,
                key: cleanKey(key),
                day: cleanKey(key).split('-')[ 0 ],
                month: cleanKey(key).split('-')[ 1 ]
            }))
            .map(({ key, originalKey, day, month }) => ({
                key,
                date: moment.tz(`${month}-${day}-2020`, dateFormat, 'Europe/Amsterdam'),
                originalKey
            }));

        dateKeys.map(({ key, originalKey, date }) => {
            if ( _.isNil(data[ key ]) ) {
                data[ key ] = {
                    date,
                    municipalities: []
                };
            }

            const Aantal = parseInt(item[ originalKey ]) || 0;
            const BevAant = parseInt(item[ 'Inwonertal' ]);
            data[ key ].municipalities.push({
                Aantal,
                BevAant,
                Gemeente: item[ 'Gemeentenaam' ],
                Gemnr: parseInt(item[ 'GemeentecodeGM' ]
                    .split('GM')
                    .join('')),
                GemiddeldOverBev: calculateAverageOverPopulation(Aantal, BevAant)
            });
        });
    });

    Object.keys(data)
        .forEach((key) => {
            const { date, municipalities } = sort(data[ key ]);
            const parsedDate = moment(date).tz('Europe/Amsterdam');
            const { today: day, time } = formatDate(parsedDate);

            // If the date is after the first scrape we don't want to save this data.
            if ( parsedDate.isAfter(moment('03-20-2020 20:00:00', format)) ) {
                return;
            }

            const fullCsv: string = toCSV(date, municipalities, ';');

            dateFolderCheck('csv', day);
            write(timeFile('csv', day, '14:00:00'), fullCsv);
            write(todayFile('csv', day), fullCsv);

            const fullCsvInternational: string = toCSV(date, municipalities, ',');

            dateFolderCheck('international-csv', day);
            write(timeFile('international-csv', day, '14:00:00'), fullCsvInternational);
            write(todayFile('international-csv', day), fullCsvInternational);

            dateFolderCheck('json', day);
            writeJson(timeFile('json', day, '14:00:00'), municipalities);
            writeJson(todayFile('json', day), municipalities);
        });
}

parse();
