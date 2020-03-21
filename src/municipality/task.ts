import { currentDate, dateFolderCheck, todayFile, timeFile, typeLatest } from '../util/folder-generators';
import { write, writeJson } from '../util/writers';
import { get } from './scraper';
import { parse } from './parser';

export async function triggerMunicipalityUpdate() {
    const data = await get();
    const { time, today } = currentDate();
    const {
        json,
        fullCsv,
        fullCsvInternational
    } = await parse(data);

    dateFolderCheck('csv', today);
    write(timeFile('csv', today, time), fullCsv);
    write(todayFile('csv', today), fullCsv);
    write(typeLatest('csv'), fullCsv);

    dateFolderCheck('international-csv', today);
    write(timeFile('international-csv', today, time), fullCsvInternational);
    write(todayFile('international-csv', today), fullCsvInternational);
    write(typeLatest('international-csv', 'international-'), fullCsvInternational);

    dateFolderCheck('json', today);
    writeJson(timeFile('json', today, time), json);
    writeJson(todayFile('json', today), json);
    writeJson(typeLatest('json'), json);

    return {
        today,
        time
    };
}
