import express from 'express';
import fs from 'fs';
import _ from 'lodash';

global.rootPath = __dirname;
const walkSync = (dir, filelist) => {
    const files = fs.readdirSync(dir);
    filelist = filelist || []; // eslint-disable-line no-param-reassign
    files.forEach((file) => {
        if (typeof dir === 'string' && fs.statSync(`${dir}/${file}`).isDirectory()) {
            filelist = walkSync(`${dir}/${file}`, filelist); // eslint-disable-line no-param-reassign
        } else if (file === 'router.js') {
            dir = dir.split('/'); // eslint-disable-line no-param-reassign
            const module = _.takeRight(dir, 2);
            filelist.push({
                file,
                module,
            });
        }
    });

    return filelist;
};
const listModule = walkSync(`${__dirname}/modules`);
module.exports = (swagger) => {
    const router = express.Router();
    swagger.swaggerize(router);
    listModule.forEach((modules) => {
    router.use(`/${_.last(modules.module)}/`, require(`./${_.join(modules.module, '/')}/${modules.file}`)); // eslint-disable-line
    });
    router.use((requestExpress, responseExpress) => {
        const err = {
            statusCode: 404,
            currentRoute: requestExpress.originalUrl,
            error: 'Route not found.',
        };
        responseExpress.status(err.statusCode).send(err);
    });

    return router;
};
