import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { MunicipalityData } from '../municipality-data';
import { dateFolder, dateFormat, folder, format } from '../municipality/folder-generators';
import * as path from 'path';
import * as fs from 'fs';
import { round } from '../util/math';
import { appDir, write, writeJson } from '../util/writers';
import slugify from 'slugify';

const jsonFolder = path.join(appDir, folder('json'));
const files = require(path.join(jsonFolder, 'files.json'));

function previousItem(data: MunicipalityHistoryData[]): MunicipalityHistoryData {
    if ( data.length === 0 ) {
        return null;
    }

    return data[ data.length - 1 ];
}

export interface MunicipalityHistoryData {
    aantal: number;
    gemiddeldOverBev: number;
    moment: moment.Moment;
    date: string;
    stijging?: MunicipalityHistoryData;
}

export interface MunicipalityHistoryCache {
    gemnr: number;
    gemeente: string;
    bevAant: number;
    data: MunicipalityHistoryData[];
}

function toCSV(municipality: MunicipalityHistoryCache) {
    const headers = 'Date,Amount,AvgOverPop,Rise,RiseInAvgOverPopulation,RiseRelativeToDate\n';
    const lines = municipality.data.map(({ date, aantal, gemiddeldOverBev, stijging }) => [
        date,
        aantal,
        gemiddeldOverBev,
        stijging.aantal,
        stijging.gemiddeldOverBev,
        stijging.date
    ].join(',')).join('\n');

    return headers + lines;
}

function toJSON(municipality: MunicipalityHistoryCache) {
    return municipality.data.map(({ date, aantal, gemiddeldOverBev, stijging }) => ({
        Date: date,
        Amount: aantal,
        AvgOverPop: gemiddeldOverBev,
        Rise: stijging.aantal,
        RiseInAvgOverPopulation: stijging.gemiddeldOverBev,
        RiseRelativeToDate: stijging.date
    }));
}

export async function triggerHistoryUpdate() {
    console.log('Triggering history update.');
    let municipalities: { [ gemnr: number ]: MunicipalityHistoryCache } = {};
    for (let file of files) {
        const jsonFile: MunicipalityData[] = require(path.join(jsonFolder, file)) as MunicipalityData[];
        const currentMoment = moment(file.split('-latest.json').join(''), format).tz('Europe/Amsterdam');

        for (let index = 0; index < jsonFile.length; index++) {
            const dataItem: MunicipalityData = jsonFile[ index ];

            if ( _.isNil(municipalities[ dataItem.Gemnr ]) ) {
                municipalities[ dataItem.Gemnr ] = {
                    bevAant: dataItem.BevAant,
                    gemeente: dataItem.Gemeente,
                    gemnr: dataItem.Gemnr,
                    data: []
                };
            }

            const date = currentMoment.format(dateFormat);
            let item = previousItem(municipalities[ dataItem.Gemnr ].data);

            municipalities[ dataItem.Gemnr ].data.push({
                moment: currentMoment,
                date,
                aantal: dataItem.Aantal,
                gemiddeldOverBev: dataItem.GemiddeldOverBev,
                stijging: _.isNil(item) ? {
                    aantal: 0,
                    gemiddeldOverBev: 0,
                    moment: currentMoment.clone().subtract(1, 'days'),
                    date: currentMoment.clone().subtract(1, 'days').format(dateFormat)
                } : {
                    aantal: dataItem.Aantal - item.aantal,
                    gemiddeldOverBev: round(dataItem.GemiddeldOverBev - item.gemiddeldOverBev),
                    moment: item.moment,
                    date: item.moment.format(dateFormat)
                }
            });
        }

        // writeJson('History/history.json', municipalities);
    }

    const overviewFiles = [];
    const municipalityKeys = Object.keys(municipalities);

    for (let index = 0; index < municipalityKeys.length; index++) {
        const municipalityKey = municipalityKeys[ index ];
        const municipality = municipalities[ municipalityKey as any ];

        const key = slugify(municipality.gemeente, { strict: true, lower: true });


        const folder = path.join(appDir, `History/${municipality.gemnr}`);
        if ( !fs.existsSync(folder) ) {
            fs.mkdirSync(folder);
        }

        const csv = toCSV(municipality);
        const json = toJSON(municipality);
        let file = {
            municipality: municipality.gemeente,
            population: municipality.bevAant,
            municipalityNr: municipality.gemnr,
            csv: `${key}.csv`,
            csvLines: csv.split('\n').length,
            json: `${key}.json`,
            jsonLength: json.length
        };
        overviewFiles.push(file);
        write(`History/${municipality.gemnr}/${key}.csv`, csv);
        writeJson(`History/${municipality.gemnr}/${key}.json`, json);
        writeJson(`History/${municipality.gemnr}/info.json`, file);
    }

    writeJson(`History/files.json`, overviewFiles.map((fileItem) => ({
        ...fileItem,
        csv: `${fileItem.municipalityNr}/${fileItem.csv}`,
        json: `${fileItem.municipalityNr}/${fileItem.json}`
    })));
    console.log('Ended history update.');
}
