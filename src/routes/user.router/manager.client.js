import { Router } from 'express'; /* eslint-disable */
import { authJwt } from '../../services/auth.user';
import controller from '../../controllers/index'
const route = new Router();

/**
 * get list client
 */
route.get("/client/list", authJwt, controller.usercontroller.managerClient._getAllClient);

/**
 * Delete list hoac tung client 1
 */
route.delete("/client", authJwt, controller.usercontroller.managerClient._deleteClient);

/**
 * Get nhung danh sach ticket cua 1 khach hang!
 */
route.get("/client/ticket", authJwt, controller.usercontroller.managerClient._getAllTicketOfClient);


/**
 * PUT nap tien cho khach hang
 */
route.put("/client/rechair", authJwt, controller.usercontroller.managerClient._putRechairCoin );


export default route;




