import 'babel-polyfill';
import http from 'http';
import Koa from 'koa';
import convert from 'koa-convert';
import path from 'path';
import koaStatic from 'koa-static-cache';
import bodyParser from 'koa-bodyparser';
import views from 'koa-views';

import logger from './logger';
import exit from './exit';
import {getConfig} from './util/config';

const app = new Koa(),
    bundleKeys = [
        'hello'
    ];

const staticFiles = {};

app.use(convert(koaStatic(getConfig('staticPath'), {
    prefix: '/static',
    buffer: true,
    gzip: true
}), staticFiles));
app.use(views(path.join(getConfig('tmplRoot'), './views'), {
    map: {
        html: 'swig',
        swig: 'swig'
    }
}));
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
    logger.info(`Start accepting requests at ${getConfig('port')}`);
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

