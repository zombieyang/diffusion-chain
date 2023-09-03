import { readFileSync, writeFileSync } from 'fs';
import { mkdirpSync } from 'mkdirp';
import { dirname, join } from 'path'

export function readBase64(path: string) {
    mkdirpSync(dirname(join(process.cwd(), path)));
    return readFileSync(join(process.cwd(), path)).toString('base64');
}
export function writeBase64(path: string, image: string) {
    mkdirpSync(dirname(join(process.cwd(), path)));
    writeFileSync(join(process.cwd(), path), Buffer.from(image, 'base64'));
}
