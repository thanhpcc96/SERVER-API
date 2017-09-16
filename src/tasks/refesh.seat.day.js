/*
** tu dong refesh lai so cho ngoi, chuyen theo ngay
*/
import shedule from 'node-schedule';
import kue from 'kue';
import Agenda from 'agenda';
import constants from '../config/constants';

const agenda= new Agenda();
agenda.database(constants.MONGO_URL);
agenda.define('refesh')

export