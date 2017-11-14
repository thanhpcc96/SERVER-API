import moment from 'moment';

import ChuyenxeModel from '../models/chuyenxe.model';
import LotrinhModel from '../models/lotrinh.model';
import UseModel from '../models/user.model';

function chunkArray(myArray, chunk_size) {
  let index = 0;
  const arrayLength = myArray.length;
  const tempArray = [];


  for (index = 0; index < arrayLength; index += arrayLength/ chunk_size) {
    const myChunk = myArray.slice(index, index + chunk_size);
    tempArray.push(myChunk);
  }
  return tempArray;
}

// const configTuyen = require('../config/admin.config/config.trips.json');
export async function createChuyenXeSeed() {
  try {
    const listLoTrinh = await LotrinhModel.find({});

    const listChuyenXe = [];
    if (!listLoTrinh) return;
    console.log('================kq lotrinh===============');
    console.log(listLoTrinh.length);
    console.log('===============================');
    listLoTrinh.forEach(lotrinh => {
      // if (4 * lotrinh.thoigianvanchuyen !== lotrinh.xetronglotrinh.length) {
      //   console.log('err ne')
      //   return new Error('Xe tham gia trong chuyen khong du de phan cong');
      // }

      console.log('===================sao ko hien============');
      console.log(listLoTrinh);
      console.log('===============================');
      for (let i = 6; i <= 17; i++) {
        for (let j = 0; j < 7; j++) {
          const chuyenDi1 = {
            tenchuyen: `${lotrinh.routeOfTrip.from}-${lotrinh.routeOfTrip
              .to}:${i}:00 `,
            timeStart: moment()
              .add(j, 'day')
              .set({ hour: i, minute: 0, second: 0 }),
            timeEnd: moment()
              .add(j, 'day')
              .set({
                hour: i + lotrinh.thoigianvanchuyen,
                minute: 0,
                second: 0,
              }),
            routeOfTrip: lotrinh._id,
            thanhtrakiemtra: [],
            laixevaphuxe: [],
            ticketsInChuyen: [],
            choNgoi: 45,
            tinhtrang: [],
            loai: 'DI',
          };
          const chuyenDi2 = {
            tenchuyen: `${lotrinh.routeOfTrip.from}-${lotrinh.routeOfTrip
              .to}:${i}:30 `,
            timeStart: moment()
              .add(j, 'day')
              .set({ hour: i, minute: 30, second: 0 }),
            timeEnd: moment()
              .add(j, 'day')
              .set({
                hour: i + lotrinh.thoigianvanchuyen,
                minute: 30,
                second: 0,
              }),
            routeOfTrip: lotrinh._id,
            thanhtrakiemtra: [],
            laixevaphuxe: [],
            ticketsInChuyen: [],
            choNgoi: 45,
            tinhtrang: [],
            loai: 'DI',
          };
          const chuyenVe1 = {
            tenchuyen: `${lotrinh.routeOfTrip.to}-${lotrinh.routeOfTrip
              .from}:${i}:00 `,
            timeStart: moment()
              .add(j, 'day')
              .set({ hour: i, minute: 0 }),
            timeEnd: moment()
              .add(j, 'day')
              .set({
                hour: i + lotrinh.thoigianvanchuyen,
                minute: 0,
                second: 0,
              }),
            routeOfTrip: lotrinh._id,
            thanhtrakiemtra: [],
            laixevaphuxe: [],
            ticketsInChuyen: [],
            choNgoi: 45,
            tinhtrang: [],
            loai: 'DI',
          };
          const chuyenVe2 = {
            tenchuyen: `${lotrinh.routeOfTrip.to}-${lotrinh.routeOfTrip
              .from}:${i}:30 `,
            timeStart: moment()
              .add(j, 'day')
              .set({ hour: i, minute: 30 }),
            timeEnd: moment()
              .add(j, 'day')
              .set({
                hour: i + lotrinh.thoigianvanchuyen,
                minute: 30,
                second: 0,
              }),
            routeOfTrip: lotrinh._id,
            thanhtrakiemtra: [],
            laixevaphuxe: [],
            ticketsInChuyen: [],
            choNgoi: 45,
            tinhtrang: [],
            loai: 'DI',
          };
          listChuyenXe.push(chuyenDi1);
          listChuyenXe.push(chuyenDi2);
          listChuyenXe.push(chuyenVe1);
          listChuyenXe.push(chuyenVe2);
        }
      }
    });
    console.log('============Lis chuyen xe===================');
    console.log(listChuyenXe.length);
    console.log('===============================');
    return await ChuyenxeModel.insertMany(listChuyenXe);
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
    let listong = [];
    if (!listLoTrinh) return;
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
    // console.log('=============listLoTrinh size==================');
    // console.log(listLoTrinh);
    // console.log('===============================');
    listLoTrinh.forEach(lotrinh => {
      // if (4 * lotrinh.thoigianvanchuyen !== lotrinh.xetronglotrinh.length) {
      //   console.log('err ne')
      //   return new Error('Xe tham gia trong chuyen khong du de phan cong');
      // }
      console.log('============Lo trinh===================');
      console.log(lotrinh);
      console.log('===============================');
      const thoigiandichuyen = lotrinh.thoigianvanchuyen;
      /* xe trong 1 tuyen dk chia doi o 2 dau di va ve */
      // const xePhanchiatheoNhom = chunkArray(lotrinh.xetronglotrinh, 2);
      // console.log('================xetronglotrinh===============');
      // console.log(xePhanchiatheoNhom.length);
      // console.log('===============================');
      // const phancongphuxeTuyen = chunkArray(danhsachphancongphuxe[index], 2);
      // const phanconglaixeTuyen = chunkArray(danhsachphanconglaixe[index], 2);
      const listdi = [];
      const listve = [];
      for (let i = 6; i <= 17; i++) {
        const chuyenDi1 = {
          tenchuyen: `${lotrinh.routeOfTrip.from}-${lotrinh.routeOfTrip
            .to}:${i}:00 `,
          timeStart: moment()
            // .add(j, 'day')
            .set({ hour: i, minute: 0, second: 0 }),
          timeEnd: moment()
            // .add(j, 'day')
            .set({ hour: i + lotrinh.thoigianvanchuyen, minute: 0, second: 0 }),
          routeOfTrip: lotrinh._id,
          thanhtrakiemtra: [],
          laixevaphuxe: [],
          ticketsInChuyen: [],
          choNgoi: 45,
          tinhtrang: [],
          loai: 'DI',
        };
        const chuyenDi2 = {
          tenchuyen: `${lotrinh.routeOfTrip.from}-${lotrinh.routeOfTrip
            .to}:${i}:30 `,
          timeStart: moment()
            // .add(j, 'day')
            .set({ hour: i, minute: 30, second: 0 }),
          timeEnd: moment()
            // .add(j, 'day')
            .set({
              hour: i + lotrinh.thoigianvanchuyen,
              minute: 30,
              second: 0,
            }),
          routeOfTrip: lotrinh._id,
          thanhtrakiemtra: [],
          ticketsInChuyen: [],
          choNgoi: 45,
          tinhtrang: [],
          loai: 'DI',
        };
        const chuyenVe1 = {
          tenchuyen: `${lotrinh.routeOfTrip.to}-${lotrinh.routeOfTrip
            .from}:${i}:00 `,
          timeStart: moment()
            // .add(j, 'day')
            .set({ hour: i, minute: 0 }),
          timeEnd: moment()
            // .add(j, 'day')
            .set({ hour: i + lotrinh.thoigianvanchuyen, minute: 0, second: 0 }),
          routeOfTrip: lotrinh._id,
          thanhtrakiemtra: [],
          ticketsInChuyen: [],
          choNgoi: 45,
          tinhtrang: [],
          loai: 'DI',
        };
        const chuyenVe2 = {
          tenchuyen: `${lotrinh.routeOfTrip.to}-${lotrinh.routeOfTrip
            .from}:${i}:30 `,
          timeStart: moment()
            // .add(j, 'day')
            .set({ hour: i, minute: 30 }),
          timeEnd: moment()
            // .add(j, 'day')
            .set({
              hour: i + lotrinh.thoigianvanchuyen,
              minute: 30,
              second: 0,
            }),
          routeOfTrip: lotrinh._id,
          thanhtrakiemtra: [],
          ticketsInChuyen: [],
          choNgoi: 45,
          tinhtrang: [],
          loai: 'DI',
        };
        listdi.push(chuyenDi1);
        listdi.push(chuyenDi2);
        listve.push(chuyenVe1);
        listve.push(chuyenVe2);

      }
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
      console.log('===============================');
      console.log(listdi.length);
      console.log('===============================');
      console.log('===============================');
      console.log(listve.length);
      console.log('===============================');
      listong= listdi.concat(listve);
      // index++;
    });
    console.log('============Lis chuyen xe===================');
    console.log(listong.length);
    console.log('===============================');

    return await ChuyenxeModel.insertMany(listong);
  } catch (err) {
    return err;
  }
}


