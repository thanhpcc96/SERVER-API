/* eslint-disable no-console */
/**
 * Server setup
 */
import express from 'express'; /* eslint-disable */
import http from 'http';
import chalk from 'chalk';
import os from 'os';
import cluster from 'cluster';
import kue from 'kue';

import './config/database'; // config database
import middlewareConfig from './config/middleware';
import constants from './config/constants';
import ApiRoutes from './routes';





import io from './io';

const app = express();

//thiet lap middleware cho ung dung
middlewareConfig(app);

// thiet lap router cho ung dung
app.use('/api/v1', ApiRoutes);

/**
 * Nếu env là development thì cluster đa nhân cpu
 */


const server = http.createServer(app);
io.attach(server);
const jobs = kue.createQueue();

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === "test") {
    const cpuLenght = os.cpus().length;
    if (cluster.isMaster) {
        app.use(kue.app);
        for (let i = 0; i < cpuLenght; i++) {
            const worker = cluster.fork();
        }
        console.log('============================================');
        console.log('========== Dang trong master     ===========');
        console.log('============================================');
    } else {
        // thực hiện background job trong cac fork từ cpu ra
        console.log('============================================');
        console.log('========== Dang trong worker     ===========');
        console.log('============================================');
    }
}
// kiem tra neu co 1 instance roi thi khong chay
if (!module.parent) {
    server.listen(constants.PORT, err => {
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
