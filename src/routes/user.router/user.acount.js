import { Router } from 'express';
import {authJwt, authLocal} from '../../services/auth.user';
import controllers from '../../controllers'

const route= new Router();

/**
 * Post vao login
 */
route.post("/login", authLocal,controllers.usercontroller.acountController._postLogin);
/**
 * Get lay thong tin info day du cua user
 */
route.get('/profile', authJwt, controllers.usercontroller.acountController._getUserInfo);
 /** 
 * Post cap nhat thong tin ca nhan
 */
route.post("/profile", authJwt,controllers.usercontroller.acountController._postUpdateInfo);