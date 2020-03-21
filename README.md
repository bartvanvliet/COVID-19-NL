# COVID-19 Scraper for NL

## Table of Contents
1. [Scraper](#scraper)
    1. [International CSV](#international-csv)
    2. [CSV](#csv)
    3. [JSON](#json)
2. [GeoJSON](#geojson-formats)
3. [Contributing](#contributing)
4. [Sources](#sources)

## Scraper

The goal is simple get as many historical data for the COVID-19 virus spread in the Netherlands. Currently only the "very sick" are being tested in the Netherlands.

Not the ones with "minor symptoms".

However. This scraper will contact the RIVM website every 2 hours. But also every day at 14:30. 

Currently it outputs in 3 formats.

- international-csv
- csv
- json

### International CSV

The RIVM csv is in has `;` delimiter. We convert this CSV into a "international" format. Which is with the `,` delimiter. You can find the `;` delimimter below.

Examples:
- Latest: [/Municipalities/international-latest.csv](https://github.com/Kapulara/COVID-19-NL/tree/master/Municipalities/international-latest.csv)
- Day 1: [/Municipalities/international-csv/02-27-2020-latest.csv](https://github.com/Kapulara/COVID-19-NL/tree/master/Municipalities/international-csv/02-27-2020-latest.csv)
- Day 24 history: [/Municipalities/international-csv/03-21-2020](https://github.com/Kapulara/COVID-19-NL/tree/master/Municipalities/international-csv/03-21-2020)
- Day 24 at 08:00: [/Municipalities/international-csv/03-21-2020/08:00:00.csv](https://github.com/Kapulara/COVID-19-NL/tree/master/Municipalities/international-csv/03-21-2020/08%3A00%3A00.csv)
- Day 24 latest: [/Municipalities/international-csv/03-21-2020-latest.csv](https://github.com/Kapulara/COVID-19-NL/tree/master/Municipalities/international-csv/03-21-2020-latest.csv)

### CSV

The RIVM csv is in has `;` delimiter. This delimiter works with most tools but not all. Since in America they use a different delimiter: `,`

Examples:
- Latest: [/Municipalities/latest.csv](https://raw.githubusercontent.com/Kapulara/COVID-19-NL/master/Municipalities/latest.csv)
- Day 1: [/Municipalities/csv/02-27-2020-latest.csv](https://raw.githubusercontent.com/Kapulara/COVID-19-NL/master/Municipalities/csv/02-27-2020-latest.csv)
- Day 24 history: [/Municipalities/csv/03-21-2020](https://github.com/Kapulara/COVID-19-NL/tree/master/Municipalities/csv/03-21-2020)
- Day 24 at 08:00: [/Municipalities/csv/03-21-2020/08:00:00.csv](https://raw.githubusercontent.com/Kapulara/COVID-19-NL/master/Municipalities/csv/03-21-2020/08%3A00%3A00.csv)
- Day 24 latest: [/Municipalities/csv/03-21-2020-latest.csv](https://raw.githubusercontent.com/Kapulara/COVID-19-NL/master/Municipalities/csv/03-21-2020-latest.csv)

### JSON

The RIVM csv converted to a JSON format.

Examples:
- Latest: [/Municipalities/latest.json](https://raw.githubusercontent.com/Kapulara/COVID-19-NL/master/Municipalities/latest.json)
- Day 1: [/Municipalities/json/02-27-2020-latest.json](https://raw.githubusercontent.com/Kapulara/COVID-19-NL/master/Municipalities/json/02-27-2020-latest.json)
- Day 24 history: [/Municipalities/json/03-21-2020](https://github.com/Kapulara/COVID-19-NL/tree/master/Municipalities/json/03-21-2020)
- Day 24 at 08:00: [/Municipalities/json/03-21-2020/08:00:00.json](https://raw.githubusercontent.com/Kapulara/COVID-19-NL/master/Municipalities/json/03-21-2020/08%3A00%3A00.json)
- Day 24 latest: [/Municipalities/json/03-21-2020-latest.json](https://raw.githubusercontent.com/Kapulara/COVID-19-NL/master/Municipalities/json/03-21-2020-latest.json)

## GeoJSON formats

Keep in mind all of these are in format [EPSG::28992](https://epsg.io/28992) tried converting it with [https://github.com/perliedman/reproject](https://github.com/perliedman/reproject) but no luck. The GeoJSON ended up in Norway.

- All NL municipalities [/geo/municipalities-nl-2019.geojson](https://raw.githubusercontent.com/Kapulara/COVID-19-NL/master/geo/municipalities-nl-2019.geojson)
- All GGD Regions [/geo/ggd-regions-2019.geojson](https://raw.githubusercontent.com/Kapulara/COVID-19-NL/master/geo/ggd-regions-2019.geojson)
- NL [/geo/nl-2019.geojson](https://raw.githubusercontent.com/Kapulara/COVID-19-NL/master/geo/nl-2019.geojson)

## Contributing

I'm currently using [Typescript](https://www.typescriptlang.org/), [yarn](https://classic.yarnpkg.com/en/docs/install/) and [Node.js with NVM](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone https://github.com/Kapulara/COVID-19-NL.git
cd COVID-19-NL/
yarn
cp example-dev.env .env
yarn build:watch
```

After that open the folder with your favorite editor. 

To start scraper `yarn start` or if you would like to regenerate the historical data `yarn start:historical`

## Sources

- [Coronavirus Map for Netherlands per Municipality](https://www.rivm.nl/coronavirus-kaart-van-nederland-per-gemeente)
- [Historical Data Coronavirus Municipality](https://docs.google.com/spreadsheets/d/1S71E2j9bX46Rj6UssbKZo9UQR3O1jZrluWy3uCzz0NE/edit#gid=783842164)
