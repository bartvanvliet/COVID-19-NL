import * as cheerio from 'cheerio';
import axios from 'axios';

export async function get() {
    const result = await axios.get('https://www.rivm.nl/coronavirus-kaart-van-nederland-per-gemeente');
    const $ = cheerio.load(result.data);

    const data = $('#csvData');

    if ( data.length === 0 ) {
        console.error('Problem finding csvData');
    }

    if ( data[ 0 ].children.length === 0 ) {
        console.error('Problem finding contents of csvData');
    }

    return data[ 0 ].children[ 0 ].data;
}
