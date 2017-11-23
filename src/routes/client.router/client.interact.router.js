import { Router } from "express";
import validate from "express-validation";

import { authLocal, authJwt } from "../../services/auth.client";
import { acountClientController } from "../../controllers";


const route= new Router();
// get list ve con kha dung cua chuyen xe
route.get("/tickets",)
