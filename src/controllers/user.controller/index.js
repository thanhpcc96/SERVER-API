import * as managerClient from './manager/manager.client.controller';
import * as managerUser from './manager/manager.user.controller';
import * as managerCoach from './manager/manager.coach.controller';
import * as managerTicket from './manager/manager.ticket.controller';
import * as managerChuyenXe from './manager/manager.chuyenxe.controller';
import * as managerLotrinh from './manager/manager.lotrinh.constroller';
import * as managerLog from './manager/manager.history.controller';
import * as managerPhancong from './manager/manager.phancong.controller'

import * as acountController from './user.acount.controller';

const userController = {
  managerClient,
  managerUser,
  managerCoach,
  managerTicket,
  managerChuyenXe,
  managerLotrinh,
  acountController,
  managerLog,
  managerPhancong
};
export default userController;
