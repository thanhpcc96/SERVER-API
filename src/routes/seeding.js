import { Router } from "express";
import { _getClientSeeds } from "../controllers";

const routes= new Router();

routes.get('/client/count?',_getClientSeeds); 

export default routes;
