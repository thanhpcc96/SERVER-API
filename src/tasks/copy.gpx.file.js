import fs from 'fs';
import moment from 'moment';

import chuyenxeModel from '../models/chuyenxe.model';
import lotrinhModel from '../models/lotrinh.model';

export default function copyGPXfile(agenda) {
    agenda.define('copyfile', (job, done) => {
        const now = moment();
        chuyenxeModel.find({
            timeStart: { $gt: now.set({ hour: 0, minute: 5 }), $lt: now.set({ hour: 20, minute: 30 }) }
        })
        .populate('routeOfTrip')
        .exec((err,result)=>{
            if(err){ return }
            if(re)
        })

    });
}