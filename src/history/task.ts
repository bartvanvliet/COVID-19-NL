import { Parser } from 'json2csv';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { MunicipalityData } from '../municipality/municipality-data';
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

function toFlatJson(
    municipality: MunicipalityHistoryCache,
    dateOptions: string[]
) {
    //Gemeentecode,Gemeentenaam,Inwonertal,COVID 27-02,COVID 28-02, ....
    let flatData: any = {
        Gemeentecode: municipality.gemnr,
        Gemeentenaam: municipality.gemeente,
        Inwonertal: municipality.bevAant
    };

    dateOptions.map((date) => ({
        item: _.find(municipality.data, { date }),
        date
    }))
        .forEach(({ date, item }) => {
            if ( !_.isNil(item) ) {
                flatData[ date ] = item.aantal;
                // flatData[ 'Gemiddeld over bevolking ' + date ] = item.gemiddeldOverBev;
                // flatData[ 'Stijging ' + date ] = item.stijging.aantal;
            } else {
                flatData[ date ] = 0;
                // flatData[ 'Gemiddeld over bevolking ' + date ] = 0;
                // flatData[ 'Stijging ' + date ] = 0;
            }
        });

    return flatData;
}

function fromMunicipalityJsonToCsv(flatMunicipalities: any[]) {
    const fields = Object.keys(flatMunicipalities[ 0 ])
        .filter((key) => key.indexOf('Gemiddeld') === -1 && key.indexOf('Stijging') === -1);
    const parser = new Parser({
        fields
    });

    return parser.parse(flatMunicipalities);
}

function toCountry(
    municipalitiesArray: MunicipalityHistoryCache[],
    dateOptions: string[]
) {
    //; 'Date,Totaal,Stijging,StijgingOverInwonertal,Inwonertal'
    // const population = municipalitiesArray.reduce((
    //     prev,
    //     item
    // ) => prev + item.bevAant, 0);
    let data: {
        [ date: string ]: {
            municipality: {
                gemnr: number,
                gemeente: string,
                bevAant: number
            },
            item: MunicipalityHistoryData
        }[]
    } = {};
    municipalitiesArray.forEach((municipality: MunicipalityHistoryCache) => {
        dateOptions
            .map((date) => ({
                date,
                municipality: {
                    gemnr: municipality.gemnr,
                    gemeente: municipality.gemeente,
                    bevAant: municipality.bevAant
                },
                item: _.find(municipality.data, { date }) || {
                    aantal: 0,
                    gemiddeldOverBev: 0,
                    date,
                    stijging: {
                        aantal: 0,
                        gemiddeldOverBev: 0,
                        date: '?'
                    }
                } as MunicipalityHistoryData
            }))
            .forEach(({ date, municipality, item }) => {
                if ( _.isNil(data[ date ]) ) {
                    data[ date ] = [];
                }

                data[ date ].push({
                    municipality,
                    item
                });
            });
    });

    const dates = Object.keys(data);
    const finalData = [];
    for (let Date of dates) {
        const dayData = data[ Date ];

        const Aantal = dayData.reduce((
            prev,
            { item }
        ) => prev + item.aantal, 0);
        const Bevolking = dayData.reduce((
            prev,
            { municipality }
        ) => prev + municipality.bevAant, 0);

        finalData.push({
            Date,
            Aantal,
            Bevolking
        });
    }

    return finalData;
}

function fromCountryJsonToCsv(countryData: any[]) {
    const fields = Object.keys(countryData[ 0 ])
        .filter((key) => key.indexOf('Gemiddeld') === -1 && key.indexOf('Stijging') === -1);
    const parser = new Parser({
        fields
    });

    return parser.parse(countryData);
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
    const flatMunicipalities = [];
    const municipalityKeys = Object.keys(municipalities);
    let municipalitiesArray: MunicipalityHistoryCache[] = [];

    const dateOptions: string[] = _.uniq(_.flatten(Object.keys(municipalities)
        .map((municipalityKey) => municipalities[ municipalityKey as any ].data)
        .map((data) => data.map((dataItem): string => dataItem.date))))
        .sort() as string[];

    for (let index = 0; index < municipalityKeys.length; index++) {
        const municipalityKey = municipalityKeys[ index ];
        const municipality = municipalities[ municipalityKey as any ];

        const key = slugify(municipality.gemeente, { strict: true, lower: true });

        flatMunicipalities.push(toFlatJson(municipality, dateOptions));

        const folder = path.join(appDir, `History/municipalities/${municipality.gemnr}`);
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
        write(`History/municipalities/${municipality.gemnr}/${key}.csv`, csv);
        writeJson(`History/municipalities/${municipality.gemnr}/${key}.json`, json);
        writeJson(`History/municipalities/${municipality.gemnr}/info.json`, file);
    }

    municipalitiesArray = Object.keys(municipalities)
        .map((municipalityKey) => municipalities[ municipalityKey as any ]);

    writeJson(`History/municipalities/files.json`, overviewFiles.map((fileItem) => ({
        ...fileItem,
        csv: `${fileItem.municipalityNr}/${fileItem.csv}`,
        json: `${fileItem.municipalityNr}/${fileItem.json}`
    })));
    writeJson(`History/municipalities/municipality-history-latest.json`, flatMunicipalities);
    write(`History/municipalities/municipality-history-latest.csv`, fromMunicipalityJsonToCsv(flatMunicipalities));

    const country = toCountry(municipalitiesArray, dateOptions);

    writeJson(`History/nl/total-nl-latest.json`, country);
    write(`History/nl/total-nl-latest.csv`, fromCountryJsonToCsv(country));

    console.log('Ended history update.');
}
