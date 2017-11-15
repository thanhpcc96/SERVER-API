import Agenda from 'agenda';

import constants from './config/constants';
import sendmail from './tasks/send.mail.task';
import refeshSeat from './tasks/refesh.seat.day';
import coppyFakeGPX from './tasks/copy.gpx.file';

const agenda = new Agenda({ db: { address: constants.MONGO_URL } });
sendmail(agenda);
// refeshSeat(agenda);
//coppyFakeGPX(agenda);
// const job = agenda.create('refeshseat', {});

// job.save((err) => {
//     console.log('Job successfully saved');
// });

agenda.on('ready', () => {
    agenda.start();
    // agenda.schedule('12 : 00 am', 'refeshseat');
   // agenda.schedule('05 : 00 am', 'copyfile');
});


export default agenda;
