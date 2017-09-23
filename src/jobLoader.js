import Agenda from 'agenda';
import constants from './config/constants';
import sendmail from './tasks/send.mail.task';

const agenda = new Agenda({ db: { address: 'mongodb://127.0.0.1/DOAN-Thanh-dev' } });
// agenda.database({
//     db: {
//         address: 'mongodb://127.0.0.1/DOAN-Thanh-dev', //constants.MONGO_URL,
//         collection: 'agendaJob'
//     }
// });
sendmail(agenda);


export default agenda;