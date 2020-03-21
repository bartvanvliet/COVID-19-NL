import { folder, GeneratorTypes, timeFile } from './folder-generators';
import * as fs from 'fs';
import * as path from 'path';
import { write, writeJson } from './writers';


export function updateFileIndex() {
    updateFileIndexForType('csv');
    updateFileIndexForType('international-csv');
    updateFileIndexForType('json');
}

function updateFileIndexForType(type: GeneratorTypes) {
    const currentFolder = folder(type);
    const files = fs.readdirSync(currentFolder).filter((item) => item.indexOf('-latest') > -1);
    writeJson(path.join(currentFolder, 'files.json'), files);
}
