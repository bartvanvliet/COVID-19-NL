import * as _ from 'lodash';


export function calculateAverageOverPopulation(
    amount: number,
    population: number
) {
    if ( !_.isNumber(amount) || amount === 0 || !_.isNumber(population) || population === 0 ) {
        return 0;
    }

    return (+parseFloat(`${amount / (population / 100000)}`)
        .toFixed(1)) || 0;
}

export function round(number: number) {
    return (+parseFloat(`${number}`)
        .toFixed(1)) || 0;
}
