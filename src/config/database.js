/* eslint-disable no-console */

/*
* config database
*/
import mongoose from 'mongoose';
import constants from './constants';

// xoa canh bao ket noi voi Promise
mongoose.Promise= global.Promise;

// neu debug thi chay mongodb ve che do debug
mongoose.set('debug',process.env.MONGOOSE_DEBUG);

// ket noi toi database voi url provider
try {
    mongoose.connect(constants.MONGO_URL,{
        useMongoClient: true
    });
} catch (err) {
    mongoose.createConnection(constants.MONGO_URL,{
        useMongoClient: true
    });
}
mongoose.connection
    .once('open',()=>console.log('MongoDB dang chay.....'))
    .on('error', err=>{
        throw err;
    })