import { Router } from "express";
import { _getClientSeeds,_deleteAllClient } from "../controllers";

const routes= new Router();

routes.get('/client/count?',_getClientSeeds);
routes.get('/client/delete_all',_deleteAllClient);

export default routes;
