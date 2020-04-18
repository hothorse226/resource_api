/**
 * Created by TiepND2 on 6/25/2017.
 */
import express from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import ip from 'ip';
import helmet from 'helmet';
import swagger from 'swagger-spec-express';
import bootstrap from '../app/bootstrap';
import packageJson from '../package.json';

function setHeader(res) {
    res.header('Access-Control-Allow-Origin', '*')
        .header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        .header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-access-token, token')
        .header('Content-Type', 'application/json');
}

export default function expressServer() {
    const app = express();
    app.use(helmet());
    app.use(helmet.noCache());
    app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

    // parse application/json
    app.use(bodyParser.json({ limit: '10mb' }));

    app.use(express.static('public'));

    // swager
    swagger.reset();
    swagger.initialise(app, {
        title: packageJson.name,
        version: packageJson.version,
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
    });

    // Add headers
    app.use((req, res, next) => {
        setHeader(res);
        next();
    });
    app.options('/*', (req, res) => {
        setHeader(res);
        res.sendStatus(200);
    });
    app.get('/swagger.json', (err, res) => {
        res.status(200).json(swagger.json());
    }).describe({
        responses: {
            200: {
                description: 'Returns the swagger.json document',
            },
        },
    });
    // global query
    swagger.common.parameters.addQuery({
        name: 'sort',
        description: 'The sort order of records e.g. sort=field1,-field2',
        required: false,
        type: 'string',
    });
    swagger.common.parameters.addQuery({
        name: 'paged',
        description: 'Current page',
        required: false,
        type: 'string',
    });
    swagger.common.parameters.addQuery({
        name: 'post_per_page',
        description: 'Post per page',
        required: false,
        type: 'string',
    });
    swagger.common.parameters.addHeader({
        name: 'token',
        description: 'Token of user',
        required: true,
        type: 'string',
    });
    app.use('/', bootstrap(swagger)); // eslint-disable-line global-require
    swagger.compile();
    const ipSv = ip.address();
    const { EXPRESS_IP } = process.env;
    const server = app.listen(process.env.PORT || 8000, EXPRESS_IP || ipSv, async () => {
        let paths = '\n';
        Object.keys(swagger.json().paths).forEach((key) => {
            paths = `${paths}            ${key}\n`;
        });
        console.log(`
          ${chalk.bold('Access URLs:')}
          Localhost: ${chalk.magenta(`http://${server.address().address}:${server.address().port}`)}
          LAN: ${chalk.magenta(`http://${ipSv}:${server.address().port}`)}
          ROUTES: ${chalk.blue(paths)}
          ${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}`);
    });

    return server;
}
