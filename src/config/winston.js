/**
 * Create the winston logger instance
 */
import winston, {Logger, transports} from 'winston';

const logger= new Logger({
    transports:[
        new transports.Console({
            json: true,
            colorize: true
        }) 
    ]
});

 export default logger;