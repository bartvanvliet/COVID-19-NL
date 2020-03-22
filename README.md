# COVID-19 Scraper for NL

The goal is simple get as many historical data for the COVID-19 virus spread in the Netherlands. Currently only the "very sick" are being tested in the Netherlands.
Not the ones with "minor symptoms".

If you have an idea please [submit an issue!](https://github.com/Kapulara/COVID-19-NL/issues/new)

⚠️ Right now the historical information (before 03-20-2020) come from an independent source. We have no way of actually making sure this data is correct (on municipality level). Please if you have a more reputable source [submit an issue](https://github.com/Kapulara/COVID-19-NL/issues/new). 

⚠️ Everything after 03-20-2020 come from the [RIVD.nl website](https://www.rivm.nl/coronavirus-kaart-van-nederland-per-gemeente) directly.

## Table of Contents
1. [Projects](#projects)
2. [Scraper](#scraper)
    1. [International CSV](#international-csv)
    2. [CSV](#csv)
    3. [JSON](#json)
3. [History](#history)
    1. [Country](#country)
    2. [Municipalities](#municipalities)
4. [API](#api)
5. [GeoJSON](#geojson-formats)
6. [Contributing](#contributing)
7. [Sources](#sources)

## Projects

Projects currently using this API/data:

| Project | Description | URL | Repository |
| ------------- | ------------- | ------------- | ------------- |
| coronamap-nl | Map created for tracking the progress of the corona virus by [codefor.nl](https://www.codefor.nl/) | [URL](https://www.codefor.nl/coronamap-nl/) | [codefornl/coronamap-nl](https://github.com/codefornl/coronamap-nl) | 


## Scraper

This scraper will contact the RIVM website every 2 hours. But also every day at 14:30. 

Currently it outputs in 3 formats.

- international-csv
- csv
- json

### International CSV

The RIVM csv is in has `;` delimiter. We convert this CSV into a "international" format. Which is with the `,` delimiter. You can find the `;` delimimter below.

Examples:
- Latest: [/Municipalities/international-latest.csv](https://github.com/Kapulara/COVID-19-NL/tree/master/Municipalities/international-latest.csv)
- Files: [/Municipalities/international-csv/files.json](https://kapulara.github.io/COVID-19-NL/Municipalities/international-csv/files.json)
- Day 24 history: [/Municipalities/international-csv/03-21-2020](https://github.com/Kapulara/COVID-19-NL/tree/master/Municipalities/international-csv/03-21-2020)
- Day 24 at 08:00: [/Municipalities/international-csv/03-21-2020/08:00:00.csv](https://github.com/Kapulara/COVID-19-NL/tree/master/Municipalities/international-csv/03-21-2020/08%3A00%3A00.csv)
- Day 24 latest: [/Municipalities/international-csv/03-21-2020-latest.csv](https://github.com/Kapulara/COVID-19-NL/tree/master/Municipalities/international-csv/03-21-2020-latest.csv)

### CSV

The RIVM csv is in has `;` delimiter. This delimiter works with most tools but not all. Since in America they use a different delimiter: `,`

Examples:
- Latest: [/Municipalities/latest.csv](https://kapulara.github.io/COVID-19-NL/Municipalities/latest.csv)
- Files: [/Municipalities/csv/files.json](https://kapulara.github.io/COVID-19-NL/Municipalities/csv/files.json)
- Day 1: [/Municipalities/csv/02-27-2020-latest.csv](https://kapulara.github.io/COVID-19-NL/Municipalities/csv/02-27-2020-latest.csv)
- Day 24 history: [/Municipalities/csv/03-21-2020](https://github.com/Kapulara/COVID-19-NL/tree/master/Municipalities/csv/03-21-2020)
- Day 24 at 08:00: [/Municipalities/csv/03-21-2020/08:00:00.csv](https://kapulara.github.io/COVID-19-NL/Municipalities/csv/03-21-2020/08%3A00%3A00.csv)
- Day 24 latest: [/Municipalities/csv/03-21-2020-latest.csv](https://kapulara.github.io/COVID-19-NL/Municipalities/csv/03-21-2020-latest.csv)

### JSON

The RIVM csv converted to a JSON format.

Examples:
- Latest: [/Municipalities/latest.json](https://kapulara.github.io/COVID-19-NL/Municipalities/latest.json)
- Files: [/Municipalities/json/files.json](https://kapulara.github.io/COVID-19-NL/Municipalities/json/files.json)
- Day 1: [/Municipalities/json/02-27-2020-latest.json](https://kapulara.github.io/COVID-19-NL/Municipalities/json/02-27-2020-latest.json)
- Day 24 history: [/Municipalities/json/03-21-2020](https://github.com/Kapulara/COVID-19-NL/tree/master/Municipalities/json/03-21-2020)
- Day 24 at 08:00: [/Municipalities/json/03-21-2020/08:00:00.json](https://kapulara.github.io/COVID-19-NL/Municipalities/json/03-21-2020/08%3A00%3A00.json)
- Day 24 latest: [/Municipalities/json/03-21-2020-latest.json](https://kapulara.github.io/COVID-19-NL/Municipalities/json/03-21-2020-latest.json)

## History

Since we now have historical data for all of the municipalities we generate the progress of COVID-19 in the Netherlands.

### Country

Overview of the history of the COVID-19 numbers in the Netherlands as a whole.
Every day at around 14:30 we generate a new file containing the latest information. You can view it live here:

| Format | Link | Direct URL |
| ------------- | ------------- | ------------- |
| JSON | [View total-nl-latest.json on Github](https://github.com/Kapulara/COVID-19-NL/tree/master/History/nl/total-nl-latest.json) | [API URL](https://kapulara.github.io/COVID-19-NL/History/nl/total-nl-latest.json) | 
| CSV | [View total-nl-latest.csv on Github](https://github.com/Kapulara/COVID-19-NL/tree/master/History/nl/total-nl-latest.csv) | [API URL](https://kapulara.github.io/COVID-19-NL/History/nl/total-nl-latest.csv) |

### Municipalities

Overview of the history per municipality in the netherlands.
Every day at around 14:30 we generate a new file containing the latest information. You can view it live here:

| Format | Link | Direct URL |
| ------------- | ------------- | ------------- |
| JSON | [View municipality-history-latest.json on Github](https://github.com/Kapulara/COVID-19-NL/tree/master/History/municipalities/municipality-history-latest.json) | [API URL](https://kapulara.github.io/COVID-19-NL/History/municipalities/municipality-history-latest.json) | 
| CSV | [View municipality-history-latest.csv on Github](https://github.com/Kapulara/COVID-19-NL/tree/master/History/municipalities/municipality-history-latest.csv) | [API URL](https://kapulara.github.io/COVID-19-NL/History/municipalities/municipality-history-latest.csv) |

#### In depth municipality data
As you can see over [here](https://github.com/Kapulara/COVID-19-NL/tree/master/History/municipalities) we have lots of folders with a number. This number represents the municipality code.

Files in folder:

| File | Description |
| ------------- | ------------- |
| {municipalityCode}/info.json | Information about the municipality | 
| {municipalityCode}/{municipalitySlug}.csv | CSV file containing history for the municipality |
| {municipalityCode}/{municipalitySlug}.json | JSON file containing history for the municipality |

But how do you know what files or currently generated? We generate a files.json "index" file containing all of the municipalities with their respective information and location of the file.

Check it out here: [/History/municipalities/files.json](https://github.com/Kapulara/COVID-19-NL/blob/master/History/municipalities/files.json)

Example contents:
```json
[
    {
        "municipality": "Appingedam",
        "population": 11721,
        "municipalityNr": 3,
        "csv": "3/appingedam.csv",
        "csvLines": 26,
        "json": "3/appingedam.json",
        "jsonLength": 25
    }
]
```

Example usage:
```sh
# Info about all of the available files
curl https://kapulara.github.io/COVID-19-NL/History/municipalities/files.json

# Information about the municipality
curl https://kapulara.github.io/COVID-19-NL/History/municipalities/3/info.json

# If we would like to get the JSON data
curl https://kapulara.github.io/COVID-19-NL/History/municipalities/3/appingedam.json

# If we would like to get the CSV data
curl https://kapulara.github.io/COVID-19-NL/History/municipalities/3/appingedam.csv
```

## API

Currently everything is hosted on Github Pages.

The base url is: `https://kapulara.github.io/COVID-19-NL/`

Now if you would like to get the latest municipality information you just add [/Municipalities/latest.json](https://kapulara.github.io/COVID-19-NL/Municipalities/latest.json) to that url.

All RAW url's in this document currently make use of that endpoint.

## GeoJSON formats

Keep in mind all of these are in format [EPSG::28992](https://epsg.io/28992) tried converting it with [https://github.com/perliedman/reproject](https://github.com/perliedman/reproject) but no luck. The GeoJSON ended up in Norway.

- All NL municipalities [/geo/municipalities-nl-2019.geojson](https://kapulara.github.io/COVID-19-NL/geo/municipalities-nl-2019.geojson)
- All GGD Regions [/geo/ggd-regions-2019.geojson](https://kapulara.github.io/COVID-19-NL/geo/ggd-regions-2019.geojson)
- NL [/geo/nl-2019.geojson](https://kapulara.github.io/COVID-19-NL/geo/nl-2019.geojson)

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
