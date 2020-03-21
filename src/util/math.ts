

export function calculateAverageOverPopulation(amount: number, population: number) {
    return (+parseFloat(`${amount / (population / 100000)}`)
        .toFixed(1)) || 0;
}
