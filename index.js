const path = require('path');
const process = require('process');
const request = require('request-promise');
const DataURI = require('datauri');
const fs = require('fs-extra');

const dataURI = new DataURI();

(async function () {
    const filename = process.argv[2];
    if (filename) {
        const data = await fs.readFile(path.resolve(filename), 'utf-8');
        const regexp = /url\("?((?=http|\/\/).+?)"?\)/ig
        let c;
        let r = data;
        while(c = regexp.exec(data)) {
            const body = await request.get(c[1], { gzip: true, encoding: null });
            const encoded = dataURI.format(c[1], body);
            r = r.replace(c[1], encoded.content);
        }
        await fs.writeFile('out.css', r);
    }
})();
