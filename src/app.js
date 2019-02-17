import 'babel-polyfill';
import http from 'http';
import path from 'path';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import logger from './logger';
import exit from './exit';
import {getConfig} from './util/config';

const app = new Koa(),
    bundleKeys = [
        'example'
    ];

app.use(bodyParser());

// app context
app.context.appRoot = __dirname;

// load router
bundleKeys.forEach((key) => {
    let bundle = require('./' + path.join('bundle', key));
    bundle.start(app);
});

const server = http.createServer(app.callback());

try {
    server.listen(getConfig('port'));
    logger.info('Start accepting requests at 3000');
} catch (err) {
    logger.error(err);
    exit(app, server);
}

process.on('SIGTERM', () => {
    exit(app, server);
});
process.on('SIGINT', () => {
    exit(app, server);
});

