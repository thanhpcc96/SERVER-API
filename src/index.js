/* eslint-disable no-console */
/**
 * Server setup
 */
import express from 'express'; /* eslint-disable */
import http from 'http';
import chalk from 'chalk';
import os from 'os';
import path from 'path';
import Agendash from 'agendash';
//import Agenda from 'agenda';

import './config/database'; // config database
import middlewareConfig from './config/middleware';
import constants from './config/constants';
import ApiRoutes from './routes';
import agenda from './jobLoader';






import io from './io';

const app = express();

//const agenda = new Agenda({ db: { address: constants.MONGO_URL } });



//thiet lap middleware cho ung dung
middlewareConfig(app);



app.use("/jobs", Agendash(agenda));
//thiey lap static path
app.use('/public',express.static(path.join(__dirname, "public")));

// thiet lap router cho ung dung
app.use('/api/v1', ApiRoutes);

/**
 * Nếu env là development thì cluster đa nhân cpu
 */


const server = http.createServer(app);
io.attach(server);


// if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === "test") {
//     const cpuLenght = os.cpus().length;
//     if (cluster.isMaster) {
//         app.use();
//         for (let i = 0; i < cpuLenght; i++) {
//             const worker = cluster.fork();
//         }
//         console.log('============================================');
//         console.log('========== Dang trong master     ===========');
//         console.log('============================================');
//     } else {
//         // thực hiện background job trong cac fork từ cpu ra
//         console.log('============================================');
//         console.log('========== Dang trong worker     ===========');
//         console.log('============================================');
//     }
// }
// kiem tra neu co 1 instance roi thi khong chay
if (!module.parent) {
    server.listen(constants.PORT,"0.0.0.0", err => {
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
