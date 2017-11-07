import { Router } from "express";
import HTTPStatus from "http-status";

import clientRoute from "./client.router";
import userAcount from "./user.router/user.acount.router";

import managerUser from "./user.router/manager.user.router";
import managerClient from "./user.router/manager.client.router";
import managerCoach from './user.router/manager.coach.router';
import managerTicket from './user.router/manager.ticket.router';

import seedingRoute from "./seeding";

import APIError from "../services/error";
// Middleware
import logErrorService from "../services/log";

const routes = new Router();

routes.use("/client", clientRoute);

routes.use("/user", userAcount);
/**
 * quan ly fake
 */
routes.use("/seed", seedingRoute);
/**
 * quan ly nhan vien
 */
routes.use("/manager/user", managerUser);
/**
 * Quan ly khach hang
 */
routes.use("/manager/client", managerClient);
/**
 * Quan ly xe
 */
routes.use("/manager/coach", managerCoach);
/**
 * Quan ly ve xe
 */
routes.use('/manager/ticket', managerTicket);

routes.all("*", (req, res, next) => {
  next(new APIError("Not Found!", HTTPStatus.NOT_FOUND, true));
});
routes.use(logErrorService);

export default routes;
