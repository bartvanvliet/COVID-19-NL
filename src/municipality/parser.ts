import * as csv from 'csvtojson';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { MunicipalityData } from './municipality-data';
import { calculateAverageOverPopulation } from '../util/math';
import { dateFormat, format } from './folder-generators';

/**
 * Cleans json and parses fields
 *
 * @param items
 */
function clean(items: any[]) {
    const Aantal = (item: any) => parseInt(item.Aantal) || 0;
    const BevAant = (item: any) => parseInt(item.BevAant) || 0;

    return _.sortBy(items.map((item) => ({
        Aantal: Aantal(item),
        BevAant: BevAant(item),
        Gemeente: item.Gemeente,
        Gemnr: parseInt(item.Gemnr) || 0,
        GemiddeldOverBev: calculateAverageOverPopulation(Aantal(item), BevAant(item))
    }) as MunicipalityData), 'Gemeente', 'asc');
}

/**
 * Will parse the provided data string
 * @param data
 * @returns {{headers: string[], lines: string[]}}
 */
export async function parse(data: string) {
    const lines: string[] = data.trim().split('\n');
    const headers = lines[ 0 ]
        // For some reason the parser couldn't handle dots so we had to replace this with something that made more sense.
        .split('Aantal per 100.000 inwoners')
        .join('GemiddeldOverBev')
        .split(';');
    lines.splice(0, 1);

    let comment = lines.slice(0, 1)[ 0 ];
    let commentPart = comment.split(';')[ 1 ];

    const today = moment.tz('Europe/Amsterdam');

    // For whatever reason RIVM posted the wrong comment in their CSV data.
    // Since we can't change the live data we have the put in the correction here.
    if ( today.isSameOrAfter(moment.tz('03-22-2020 14:00:00', format, 'Europe/Amsterdam'), 'day') &&
        today.isSameOrBefore(moment.tz('03-24-2020 14:00:00', format, 'Europe/Amsterdam'), 'day') ) {
        comment = comment.split('55').join('155');
        commentPart = comment.split(';')[ 1 ];
    }

    // Extract correct result
    const commentResult = /[0-9]+/.exec(commentPart);
    if ( commentResult.length > 0 ) {
        lines[ 0 ] = comment.split(';99;').join(`;${commentResult[ 0 ]};`);
    }

    // Should not remove comment?
    // if ( lines[ 0 ].startsWith('-1;') ) {
    //     lines.splice(0, 1);
    // }

    return {
        headers,
        lines,
        comment,
        json: clean(await csv({ headers, delimiter: [ ';' ], noheader: true }).fromString(lines.join('\n'))),
        fullCsv: toCsv(headers, lines),
        fullCsvInternational: toInternationalCsv(headers, lines)
    };
}

/**
 * to csv
 * @returns {string}
 */
function toCsv(
    headers: string[],
    lines: string[]
) {
    return headers.join(';') + '\n' + lines.join('\n');
}

/**
 * to international csv
 * @returns {string}
 */
function toInternationalCsv(
    headers: string[],
    lines: string[]
) {
    return ((headers.join(';') + '\n') + lines.join('\n'))
        // Replace all existing colons with nothing
        .split(',')
        .join('')

        // Replace all semicolons with colons
        .split(';')
        .join(',');
}

