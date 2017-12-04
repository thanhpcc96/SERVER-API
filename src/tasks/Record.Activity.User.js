import RecordActivityModel from '../models/activity.log.model';

export default function savelog(agenda) {
  agenda.define('savelog', { priority: 20 }, (job, done) => {
    console.log('Job- Chuc nang gui email dk khoi tao');
    const record = job.attrs.data; // nhanj vao optionMail

    RecordActivityModel.create(record, (err, result) => {
      if (err) {
        return done(err);
      }
      done();
    });
  });
}
