import Agenda from 'agenda';
import constants from './config/constants';
import sendmail from './tasks/send.mail.task';

const agenda = new Agenda({ db: { address: constants.MONGO_URL } });
sendmail(agenda);
agenda.on('ready', () => {
    agenda.start();
});

export default agenda;