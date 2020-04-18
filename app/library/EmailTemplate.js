import fs from 'fs';

export function readHTMLFile(path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
        if (err) {
            callback(err);

            throw err;
        }

        callback(null, html);
    });
}

