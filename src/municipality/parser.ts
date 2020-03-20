import * as csv from 'csvtojson';

/**
 * Will parse the provided data string
 * @param data
 * @returns {{headers: string[], lines: string[]}}
 */
export async function parse(data: string) {
    const lines = data.trim().split('\n');
    const headers = lines[ 0 ]
        // For some reason the parser couldn't handle dots so we had to replace this with something that made more sense.
        .split('Aantal per 100.000 inwoners')
        .join('GemiddeldOverBev')
        .split(';');
    lines.splice(0, 1);

    const comment = lines.slice(0, 1);

    // Should not remove comment?
    // if ( lines[ 0 ].startsWith('-1;') ) {
    //     lines.splice(0, 1);
    // }

    return {
        headers,
        lines,
        comment,
        json: await csv({ headers, delimiter: [ ';' ] }).fromString(lines.join('\n')),
        fullCsv: toCsv(headers, lines),
        fullCsvInternational: toInternationalCsv(headers, lines)
    };
}

/**
 * to csv
 * @returns {string}
 */
function toCsv(headers: string[], lines: string[]) {
    return headers.join(';') + '\n' + lines.join('\n');
}

/**
 * to international csv
 * @returns {string}
 */
function toInternationalCsv(headers: string[], lines: string[]) {
    return ((headers.join(';') + '\n') + lines.join('\n'))
        // Replace all existing colons with nothing
        .split(',')
        .join('')

        // Replace all semicolons with colons
        .split(';')
        .join(',');
}

