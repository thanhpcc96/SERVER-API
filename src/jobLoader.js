import Agenda from 'agenda';
import constants from './config/constants';
import sendmail from './tasks/send.mail.task';
import refeshSeat from './tasks/refesh.seat.day';

const agenda = new Agenda({ db: { address: constants.MONGO_URL } });
sendmail(agenda);
refeshSeat(agenda);
const job = agenda.create('refeshseat', {});
job.repeatEvery('12 : 00 am');
job.save((err) => {
    console.log('Job successfully saved');
});
//agenda.schedule('next day at 0', 'refeshseat');
agenda.on('ready', () => {
    agenda.start();
});

export default agenda;