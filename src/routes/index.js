import { Router } from 'express';
import HTTPStatus from 'http-status';

import clientRoute from './client.router';
import seedingRoute from './seeding';



import APIError from '../services/error';
// Middleware 
import logErrorService from '../services/log';

const routes = new Router();

routes.use('/client', clientRoute);
routes.use('/seed', seedingRoute);

routes.all('*', (req, res, next) => {
    next(new APIError('Not Found!', HTTPStatus.NOT_FOUND, true));
});
routes.use(logErrorService);


export default routes;