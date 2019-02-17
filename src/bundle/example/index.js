import Router from 'koa-router';

import * as exampleController from './controller/exampleController';

let router = new Router();
router
    .get('/api/echo', exampleController.echo);

export let start = app => {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
