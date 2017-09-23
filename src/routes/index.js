import { Router } from 'express';
import HTTPStatus from 'http-status';



import APIError from '../services/error';
// Middleware 
import logErrorService from '../services/log';

const routes = new Router();

routes.all('*', (req, res, next) => {
    next(new APIError('Not Found!', HTTPStatus.NOT_FOUND, true));
});
routes.use(logErrorService)
export default routes;