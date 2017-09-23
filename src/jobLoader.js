import Agenda from 'agenda';
import constants from './config/constants';
import sendmail from './tasks/index';

const agenda = new Agenda();
agenda.database({
    db: {
        address: constants.MONGO_URL,
        collection: 'agendaJob'
    }
});
const listJobs = process.env.JOBS_TYPE ? process.env.JOBS_TYPE.split(',') : [];

listJobs.forEach(type > {
    import  from './tasks';
})
sendmail(an)

export default agenda;