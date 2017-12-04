import { Router } from 'express';
import HTTPStatus from 'http-status';

import clientRoute from './client.router/client.account.router';
import clientInteractRoute from './client.router/client.interact.router'
import userAcount from './user.router/user.acount.router';

import managerUser from './user.router/manager.user.router';
import managerClient from './user.router/manager.client.router';
import managerCoach from './user.router/manager.coach.router';
import managerTicket from './user.router/manager.ticket.router';
import managerChuyenXe from './user.router/manager.chuyenxe.router';
import managerTuyen from './user.router/manager.lotrinh.router';
import managerLog from './user.router/manager.log.router';

import seedingRoute from './seeding';

import APIError from '../services/error';
// Middleware
import logErrorService from '../services/log';

const routes = new Router();

/**
 * Route danh cho khach hang tuong tac voi tai khoan
 */
routes.use('/client', clientRoute);
/**
 * Tuong tac cua khac hang voi he thong
 */
routes.use('/client/interact/', clientInteractRoute);

routes.use('/user', userAcount);
/**
 * quan ly fake
 */
routes.use('/seed', seedingRoute);
/**
 * quan ly nhan vien
 */
routes.use('/manager/user', managerUser);
/**
 * Quan ly khach hang
 */
routes.use('/manager/client', managerClient);
/**
 * Quan ly xe
 */
routes.use('/manager/coach', managerCoach);
/**
 * Quan ly ve xe
 */
routes.use('/manager/ticket', managerTicket);
/**
 * quan li chuyen xe
 */
routes.use('/manager/chuyenxe', managerChuyenXe);
/**
 * quan li tuyen xe
 */
routes.use('/manager/tuyen', managerTuyen);

/**
 * quan li log
 */
routes.use('/manager/log', managerLog);

routes.all('*', (req, res, next) => {
  next(new APIError('Not Found!', HTTPStatus.NOT_FOUND, true));
});
routes.use(logErrorService);

export default routes;
