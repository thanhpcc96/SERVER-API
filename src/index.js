/* eslint-disable no-console */
/**
 * Server setup
 */
import express from 'express'; /* eslint-disable */
import chalk from 'chalk';

import './config/database'; // config database
import middlewareConfig from './config/middleware';
import constants from './config/constants';
import ApiRoutes from './routes';

const app = express();

//thiet lap middleware cho ung dung
middlewareConfig(app);

// thiet lap router cho ung dung
app.use('/api/v1', ApiRoutes);

// kiem tra neu co 1 instance roi thi khong chay
if (!module.parent) {
    app.listen(constants.PORT, err => {
        if (err) {
            console.log(chalk.red("Khong the khoi chay ung dung!"));
        } else {
            console.log(chalk.green.bold(
                `
                He thong dang chay 🍺
                App chay tren cong : ${constants.PORT} 🍕
                Env: ${process.env.NODE_ENV} 🦄
                `,
            ),
            );
        }
    })
}

export default app;
