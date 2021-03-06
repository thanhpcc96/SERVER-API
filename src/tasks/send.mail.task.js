import { tranporter } from '../config/mailer';
/**
 * Ham goi toi job gui mail
 * @param {Object} agenda - instance cua job
 */
export default function sendmail(agenda) {
    agenda.define("sendmail", { priority: 20 }, (job, done) => {
        console.log("Job- Chuc nang gui email dk khoi tao");
        const mailOption = job.attrs.data; // nhanj vao optionMail
        tranporter.sendMail(mailOption, (err, info) => {
            if (err) {
                return done(err)
            }
            done();
        });
    });
}
