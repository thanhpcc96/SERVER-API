import moment from 'moment';

import ChuyenxeModel from '../models/chuyenxe.model';
import LotrinhModel from '../models/lotrinh.model';
import UseModel from '../models/user.model';
// const configTuyen = require('../config/admin.config/config.trips.json');
export async function createChuyenXeSeed() {
  try {
    const listLoTrinh = await LotrinhModel.find({});

    const listChuyenXeCuoiCung = [];
    if (!listLoTrinh) return;
    console.log('================kq lotrinh===============');
    console.log(listLoTrinh.length);
    console.log('===============================');
    for(let n= 0; n< listLoTrinh.length; n++) {
      // if (4 * lotrinh.thoigianvanchuyen !== lotrinh.xetronglotrinh.length) {
      //   console.log('err ne')
      //   return new Error('Xe tham gia trong chuyen khong du de phan cong');
      // }

      console.log('===================sao ko hien============');
      console.log(listLoTrinh);
      console.log('===============================');
      for (let j = 0; j < 7; j++) {
        let chuyendi=[];
        let chuyenve =[];
        for (let i = 6; i <= 17; i++) {
          const chuyenDi1 = {
            tenchuyen: `${listLoTrinh[n].routeOfTrip.from}-${listLoTrinh[n].routeOfTrip
              .to}:${i}:00 `,
            timeStart: moment()
              .add(j, 'day')
              .set({ hour: i, minute: 0, second: 0 }),
            timeEnd: moment()
              .add(j, 'day')
              .set({
                hour: i + listLoTrinh[n].thoigianvanchuyen,
                minute: 0,
                second: 0,
              }),
            routeOfTrip: listLoTrinh[n]._id,
            // thanhtrakiemtra: [],
            // laixevaphuxe: [],
            ticketsInChuyen: [],
            choNgoi: 45,
            tinhtrang: [],
            loai: 'DI',
          };
          const chuyenDi2 = {
            tenchuyen: `${listLoTrinh[n].routeOfTrip.from}-${listLoTrinh[n].routeOfTrip
              .to}:${i}:30 `,
            timeStart: moment()
              .add(j, 'day')
              .set({ hour: i, minute: 30, second: 0 }),
            timeEnd: moment()
              .add(j, 'day')
              .set({
                hour: i + listLoTrinh[n].thoigianvanchuyen,
                minute: 30,
                second: 0,
              }),
            routeOfTrip: listLoTrinh[n]._id,
            // thanhtrakiemtra: [],
            // laixevaphuxe: [],
            ticketsInChuyen: [],
            choNgoi: 45,
            tinhtrang: [],
            loai: 'DI',
          };
          const chuyenVe1 = {
            tenchuyen: `${listLoTrinh[n].routeOfTrip.to}-${listLoTrinh[n].routeOfTrip
              .from}:${i}:00 `,
            timeStart: moment()
              .add(j, 'day')
              .set({ hour: i, minute: 0 }),
            timeEnd: moment()
              .add(j, 'day')
              .set({
                hour: i + listLoTrinh[n].thoigianvanchuyen,
                minute: 0,
                second: 0,
              }),
            routeOfTrip: listLoTrinh[n]._id,
            // thanhtrakiemtra: [],
            // laixevaphuxe: [],
            ticketsInChuyen: [],
            choNgoi: 45,
            tinhtrang: [],
            loai: 'DI',
          };
          const chuyenVe2 = {
            tenchuyen: `${listLoTrinh[n].routeOfTrip.to}-${listLoTrinh[n].routeOfTrip
              .from}:${i}:30 `,
            timeStart: moment()
              .add(j, 'day')
              .set({ hour: i, minute: 30 }),
            timeEnd: moment()
              .add(j, 'day')
              .set({
                hour: i + listLoTrinh[n].thoigianvanchuyen,
                minute: 30,
                second: 0,
              }),
            routeOfTrip: listLoTrinh[n]._id,
            // thanhtrakiemtra: [],
            // laixevaphuxe: [],
            ticketsInChuyen: [],
            choNgoi: 45,
            tinhtrang: [],
            loai: 'DI',
          };
          chuyendi.push(...[chuyenDi1,chuyenDi2])
          chuyenve.push(...[chuyenVe1,chuyenVe2]);
        }
        if(j%2 === 0){
          for (let i = 0; i < listLoTrinh[n].xetronglotrinh.length / 2; i++) {
            for (let m = i; j < chuyendi.length; j++) {
              chuyendi[m].coach = listLoTrinh[n].xetronglotrinh[i];
              chuyendi[m + 16].coach = listLoTrinh[n].xetronglotrinh[i];
            }
            for (let f = i + 8; f <= 15; f++) {
              chuyenve[f].coach = listLoTrinh[n].xetronglotrinh[i];
            }
          }
          for (
            let i = listLoTrinh[n].xetronglotrinh.length / 2;
            i < listLoTrinh[n].xetronglotrinh.length;
            i++
          ) {
            for (let m = i - 8; j < chuyenve.length; j++) {
              chuyenve[m].coach = listLoTrinh[n].xetronglotrinh[i];
              chuyenve[m + 16].coach = listLoTrinh[n].xetronglotrinh[i];
            }
            for (let f = i + 8; f <= 15; f++) {
              chuyendi[f].coach = listLoTrinh[n].xetronglotrinh[i];
            }
          }
        }else{
          for (let i = 0; i < listLoTrinh[n].xetronglotrinh.length / 2; i++) {
            for (let m = i; j < chuyenve.length; j++) {
              chuyenve[m].coach = listLoTrinh[n].xetronglotrinh[i];
              chuyenve[m + 16].coach = listLoTrinh[n].xetronglotrinh[i];
            }
            for (let f = i + 8; f <= 15; f++) {
              chuyendi[f].coach = listLoTrinh[n].xetronglotrinh[i];
            }
          }
          for (
            let i = listLoTrinh[n].xetronglotrinh.length / 2;
            i < listLoTrinh[n].xetronglotrinh.length;
            i++
          ) {
            for (let m = i - 8; j < chuyenve.length; j++) {
              chuyendi[m].coach = listLoTrinh[n].xetronglotrinh[i];
              chuyendi[m + 16].coach = listLoTrinh[n].xetronglotrinh[i];
            }
            for (let f = i + 8; f <= 15; f++) {
              chuyenve[f].coach = listLoTrinh[n].xetronglotrinh[i];
            }
          }
        }
        listChuyenXeCuoiCung.push(...chuyendi,...chuyenve)
        chuyendi=[];
        chuyenve=[];
      }
    };

    return await ChuyenxeModel.insertMany(listChuyenXeCuoiCung);
  } catch (err) {
    return `${err} +" He thong tinh toan loi!`;
  }
}
export async function deleteAllChuyen() {
  try {
    return await ChuyenxeModel.remove();
  } catch (err) {
    return err;
  }
}
export async function generateChuyenInDay() {
  try {
    const listLoTrinh = await LotrinhModel.find({});
    const listong = [];
    if (!listLoTrinh) return;

    for (let n = 0; n < listLoTrinh.length; n++) {
      const listdi = [];
      const listve = [];
      for (let i = 6; i <= 17; i++) {
        const chuyenDi1 = {
          tenchuyen: `${listLoTrinh[n].routeOfTrip.from}-${listLoTrinh[n]
            .routeOfTrip.to}:${i}:00 `,
          timeStart: moment()
            // .add(j, 'day')
            .set({ hour: i, minute: 0, second: 0 }),
          timeEnd: moment()
            // .add(j, 'day')
            .set({
              hour: i + listLoTrinh[n].thoigianvanchuyen,
              minute: 0,
              second: 0,
            }),
          routeOfTrip: listLoTrinh[n]._id,
          // thanhtrakiemtra: [],
          // laixevaphuxe: [],
          ticketsInChuyen: [],
          choNgoi: 45,
          tinhtrang: [],
          loai: 'DI',
        };
        const chuyenDi2 = {
          tenchuyen: `${listLoTrinh[n].routeOfTrip.from}-${listLoTrinh[n]
            .routeOfTrip.to}:${i}:30 `,
          timeStart: moment()
            // .add(j, 'day')
            .set({ hour: i, minute: 30, second: 0 }),
          timeEnd: moment()
            // .add(j, 'day')
            .set({
              hour: i + listLoTrinh[n].thoigianvanchuyen,
              minute: 30,
              second: 0,
            }),
          routeOfTrip: listLoTrinh[n]._id,
          // thanhtrakiemtra: [],
          // ticketsInChuyen: [],
          choNgoi: 45,
          tinhtrang: [],
          loai: 'DI',
        };
        const chuyenVe1 = {
          tenchuyen: `${listLoTrinh[n].routeOfTrip.to}-${listLoTrinh[n]
            .routeOfTrip.from}:${i}:00 `,
          timeStart: moment()
            // .add(j, 'day')
            .set({ hour: i, minute: 0 }),
          timeEnd: moment()
            // .add(j, 'day')
            .set({
              hour: i + listLoTrinh[n].thoigianvanchuyen,
              minute: 0,
              second: 0,
            }),
          routeOfTrip: listLoTrinh[n]._id,
          // thanhtrakiemtra: [],
          ticketsInChuyen: [],
          choNgoi: 45,
          tinhtrang: [],
          loai: 'DI',
        };
        const chuyenVe2 = {
          tenchuyen: `${listLoTrinh[n].routeOfTrip.to}-${listLoTrinh[n]
            .routeOfTrip.from}:${i}:30 `,
          timeStart: moment()
            // .add(j, 'day')
            .set({ hour: i, minute: 30 }),
          timeEnd: moment()
            // .add(j, 'day')
            .set({
              hour: i + listLoTrinh[n].thoigianvanchuyen,
              minute: 30,
              second: 0,
            }),
          routeOfTrip: listLoTrinh[n]._id,
          // thanhtrakiemtra: [],
          ticketsInChuyen: [],
          choNgoi: 45,
          tinhtrang: [],
          loai: 'DI',
        };
        listdi.push(...[chuyenDi1, chuyenDi2]);
        listve.push(...[chuyenVe1, chuyenVe2]);
      }
      // phan cong chuyen di
      for (let i = 0; i < listLoTrinh[n].xetronglotrinh.length / 2; i++) {
        for (let j = i; j < listdi.length; j++) {
          listdi[j].coach = listLoTrinh[n].xetronglotrinh[i];
          listdi[j + 16].coach = listLoTrinh[n].xetronglotrinh[i];
        }
        for (let f = i + 8; f < 15; f++) {
          listve[f].coach = listLoTrinh[n].xetronglotrinh[i];
        }
      }
      for (
        let i = listLoTrinh[n].xetronglotrinh.length / 2;
        i < listLoTrinh[n].xetronglotrinh.length;
        i++
      ) {
        for (let j = i - 8; j < listve.length; j++) {
          listve[j].coach = listLoTrinh[n].xetronglotrinh[i];
          listve[j + 15].coach = listLoTrinh[n].xetronglotrinh[i];
        }
        for (let f = i + 8; f < 15; f++) {
          listdi[f].coach = listLoTrinh[n].xetronglotrinh[i];
        }

      }
     for(let z=0; z < listdi.length; z++){

     }
      listong.push(...listdi, ...listve);
    }
    return await ChuyenxeModel.insertMany(listong);
  } catch (err) {
    return err;
  }
}

// const danhsachnhanvienlaixe = await UseModel.find({ role: 2 }); // lai xe
// const danhsachnhanvienphuxe = await UseModel.find({ role: 3 }); // phuxe

// const danhsachphancongphuxe = chunkArray(
//   danhsachnhanvienphuxe,
//   listLoTrinh.length,
// );
// const danhsachphanconglaixe = chunkArray(
//   danhsachnhanvienlaixe,
//   listLoTrinh.length,
// );

// let index = 0;
// console.log('=====************========danhsachphancongphuxe size=======*****************==========');
// console.log(danhsachnhanvienlaixe);
// console.log('===============*******************************************================');

// /* nhung chuyen xe 1...8 va 16...24 lap lai xe  DI*/
// for (let a = 0; a < xePhanchiatheoNhom[0].length; a++) {
//   for (let b = 0; b < listdi.length; b++) {
//     if (listdi[b].coach && listdi[b].laixe && listdi[b].phuxe) {
//       break;
//     } else {
//       listdi[b].coach = xePhanchiatheoNhom[0][a];
//       listdi[b].laixe = phanconglaixeTuyen[0][a];
//       listdi[b].phuxe = phancongphuxeTuyen[0][a];
//     }
//     for (let c = 0; listdi.length; c++) {
//       if (c === b + thoigiandichuyen * 2 && !listdi[c].coach) {
//         listdi[c].coach = xePhanchiatheoNhom[0][a];
//         listdi[c].laixe = phanconglaixeTuyen[0][a];
//         listdi[c].phuxe = phancongphuxeTuyen[0][a];
//       }
//     }
//   }
// }
// /* nhung chuyen xe 1...8 va 16...24 lap lai xe  Ve*/
// for (let a = 0; a < xePhanchiatheoNhom[1].length; a++) {
//   for (let b = 0; b < listve.length; b++) {
//     if (listve[b].coach && listve[b].laixe && listve[b].phuxe) {
//       break;
//     } else {
//       listve[b].coach = xePhanchiatheoNhom[1][a];
//       listve[b].laixe = phanconglaixeTuyen[1][a];
//       listve[b].phuxe = phancongphuxeTuyen[1][a];
//     }
//     for (let c = 0; listve.length; c++) {
//       if (c === b + thoigiandichuyen * 2 && !listve[c].coach) {
//         listve[c].coach = xePhanchiatheoNhom[1][a];
//         listve[c].laixe = phanconglaixeTuyen[1][a];
//         listve[c].phuxe = phancongphuxeTuyen[1][a];
//       }
//     }
//   }
// }
// /* chuyenxe di tu vi tri 9 ->15 xe la xe cua chuyen ve */
// for (let a = 0; a < xePhanchiatheoNhom[1].length; a++) {
//   for (
//     let b = xePhanchiatheoNhom[1].length;
//     b < xePhanchiatheoNhom[1].length * 2;
//     b++
//   ) {
//     if (!listdi[b].coach) {
//       listdi[b].coach = xePhanchiatheoNhom[1][a];
//       listdi[b].phuxe = danhsachnhanvienphuxe[1][a];
//       listdi[b].laixe = danhsachnhanvienlaixe[1][a];
//     }
//   }
// }
// /* chuyenxe VE tu vi tri 9 ->15 xe la xe cua chuyen Ve */
// for (let a = 0; a < xePhanchiatheoNhom[0].length; a++) {
//   for (
//     let b = xePhanchiatheoNhom[0].length;
//     b < xePhanchiatheoNhom[0].length * 2;
//     b++
//   ) {
//     if (!listve[b].coach) {
//       listve[b].coach = xePhanchiatheoNhom[0][a];
//       listve[b].phuxe = danhsachnhanvienphuxe[0][a];
//       listve[b].laixe = danhsachnhanvienlaixe[0][a];
//     }
//   }
// }
