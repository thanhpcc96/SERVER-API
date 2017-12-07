import TuyenModel from '../models/lotrinh.model';
import PhanCongModel from '../models/phancong.model';
import moment from 'moment';

export async function _seed_phancong() {
  try {
    const kq = await TuyenModel.find().populate({
      path: 'xetronglotrinh',
      populate: [
        {
          path: 'phutrach.laixe',
          model: 'users',
        },
        {
          path: 'phutrach.phuxe',
          model: 'users',
        },
      ],
    });
    const filterTuyen = [];
    kq.forEach(tuyen => {
      if (tuyen.xetronglotrinh.length > 0) {
        filterTuyen.push(tuyen);
      }
    });
    const lichphancong=[];
    filterTuyen.forEach(tuyen => {
      const phancong = [];
      tuyen.xetronglotrinh.forEach(xe => {
        const newXe = {
          bienso: `${xe.name  } ${  xe.numberplate}`,
          laixe: xe.phutrach.laixe.info.fullname,
          phuxe: xe.phutrach.phuxe.info.fullname,
        };
        phancong.push(newXe);
      });
      const pc = {
        ngayphancong: moment().set({ hour: 0, minute: 0, second: 0 }),
        tuyenxe: `${tuyen.routeOfTrip.from  } ${  tuyen.routeOfTrip.to}`,
        phancong,
      };
      lichphancong.push(pc)
    });
    return await PhanCongModel.insertMany(lichphancong);

  } catch (err) {
    return err;
  }
}
