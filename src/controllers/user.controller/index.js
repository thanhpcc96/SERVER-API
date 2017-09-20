import * as managerClient from './manager/manager.client.controller';
import * as managerUser from './manager/manager.user.controller';
import * as acountController from './user.acount.controller'

const userController={
    managerClient,
    managerUser,
    acountController
}
export default userController;