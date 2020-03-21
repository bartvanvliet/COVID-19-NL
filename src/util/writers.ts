import * as fs from "fs";
import * as path from "path";

export const appDir = path.dirname(require.main.filename) + '/../';

export function write(
    location: string,
    data: string
) {
    fs.writeFileSync(path.join(appDir, location), data, 'utf-8');
}

export function writeJson(
    location: string,
    data: any
) {
    fs.writeFileSync(path.join(appDir, location), JSON.stringify(data, null, 2), 'utf-8');
}
