import {Router} from 'express';
import {authLocal} from '../services/auth.client';
import ClientController from '../controllers/client.controller';


const route = new Router();

route.post('/register',ClientController._postRegister);

route.post('/login', authLocal, ClientController._postLogin);

route.post('/forgot',ClientController._postResetPassword); //_resetPassword

route.get("/all", ClientController._getAll);

//route.post('/reset/:token',ClientController._resetPassword);

export default route;