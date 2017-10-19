import { Router } from "express";
import HTTPStatus from "http-status";

import clientRoute from "./client.router";
import managerUser from "./user.router/manager.user.router";
import userAcount from "./user.router/user.acount.router";
import managerClient from "./user.router/manager.client.router";
import seedingRoute from "./seeding";

import APIError from "../services/error";
// Middleware
import logErrorService from "../services/log";

const routes = new Router();

routes.use("/client", clientRoute);
routes.use("/user", userAcount);
routes.use("/seed", seedingRoute);
routes.use("/manager/user", managerUser);
routes.use("/manager/client", managerClient);

routes.all("*", (req, res, next) => {
  next(new APIError("Not Found!", HTTPStatus.NOT_FOUND, true));
});
routes.use(logErrorService);

export default routes;
