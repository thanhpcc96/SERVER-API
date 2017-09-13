import {Router} from 'express';
import {authLocal} from '../services/auth.client';
import * as ClientController from '../controllers/client.controller';


const route = new Router();

route.post('/register',ClientController._postRegister);

route.post('/login', authLocal, ClientController._postLogin);

route.post('/forgot',ClientController._postResetPassword);

route.post('/reset/:token',ClientController._resetPassword);

export default route;