import moment from "moment";

import LotrinhModel from "../models/lotrinh.model";
import chuyenxeModel from "../models/chuyenxe.model";

const configTuyen = require("../config/admin.config/config.trips.json");

/** tao chuyen xe va so ghe vao 12h chu nhat hang tuan */
const taoChuyenXe = async () => {
  try {
    const listLoTrinh = await LotrinhModel.find({});
    if (!listLoTrinh) return;
    listLoTrinh.forEach(async lotrinh => {
      if (
        2 * (lotrinh.thoigianvanchuyen + configTuyen.timetostart) !==
        lotrinh.xetronglotrinh.length / 2
      ) {
        return new Error(
          "Chuyen xe tham gia trong chuyen khong du de phan cong"
        );
      }
      const listChuyenXe = [];
      for (let i = configTuyen.timetostart; i < configTuyen.timetoend; i++) {
        for (let j = 1; j <= 7; j++) {
          const chuyenDi1 = {
            sochuyen: `${lotrinh.routeOfTrip.from}-${lotrinh.routeOfTrip
              .to}:${i}:00 `,
            timeStart: moment()
              .add(j, "day")
              .set({ hour: i, minute: 0 }),
            timeEnd: moment()
              .add(j, "day")
              .set({ hour: i + lotrinh.thoigianvanchuyen, minute: 0 }),
            routeOfTrip: lotrinh._id,
            thanhtrakiemtra: [],
            laixevaphuxe: [],
            coach: "",
            ticketsInChuyen: [],
            choNgoi: configTuyen.chongoi,
            tinhtrang: [],
            loai: "DI"
          };
          const chuyenDi2 = {
            sochuyen: `${lotrinh.routeOfTrip.from}-${lotrinh.routeOfTrip
              .to}:${i}:30 `,
            timeStart: moment()
              .add(j, "day")
              .set({ hour: i, minute: 30 }),
            timeEnd: moment()
              .add(j, "day")
              .set({ hour: i + lotrinh.thoigianvanchuyen, minute: 30 }),
            routeOfTrip: lotrinh._id,
            thanhtrakiemtra: [],
            laixevaphuxe: [],
            coach: "",
            ticketsInChuyen: [],
            choNgoi: configTuyen.chongoi,
            tinhtrang: [],
            loai: "DI"
          };
          const chuyenVe1 = {
            sochuyen: `${lotrinh.routeOfTrip.to}-${lotrinh.routeOfTrip
              .from}:${i + lotrinh.thoigianvanchuyen}:00 `,
            timeStart: moment()
              .add(j, "day")
              .set({ hour: i + lotrinh.thoigianvanchuyen, minute: 0 }),
            timeEnd: moment()
              .add(j, "day")
              .set({ hour: i + 2 * lotrinh.thoigianvanchuyen, minute: 0 }),
            routeOfTrip: lotrinh._id,
            thanhtrakiemtra: [],
            laixevaphuxe: [],
            coach: "",
            ticketsInChuyen: [],
            choNgoi: configTuyen.chongoi,
            tinhtrang: [],
            loai: "VE"
          };
          const chuyenVe2 = {
            sochuyen: `${lotrinh.routeOfTrip.to}-${lotrinh.routeOfTrip
              .from}:${i + lotrinh.thoigianvanchuyen}:30 `,
            timeStart: moment()
              .add(j, "day")
              .set({ hour: i + lotrinh.thoigianvanchuyen, minute: 30 }),
            timeEnd: moment()
              .add(j, "day")
              .set({ hour: i + 2 * lotrinh.thoigianvanchuyen, minute: 30 }),
            routeOfTrip: lotrinh._id,
            thanhtrakiemtra: [],
            laixevaphuxe: [],
            coach: "",
            ticketsInChuyen: [],
            choNgoi: configTuyen.chongoi,
            tinhtrang: [],
            loai: "VE"
          };
          listChuyenXe.push(...[chuyenDi1, chuyenDi2, chuyenVe1, chuyenVe2]);
        }
      }
      for (let a = 0; a < listChuyenXe.length; a++) {
        if (listChuyenXe[a].timeStart.get("hour") === 17) {
          listChuyenXe.remove(a);
        }
      }
      await chuyenxeModel.insertMany(listChuyenXe);
    });
  } catch (err) {
    return `${err} +" He thong tinh toan loi!`;
  }
};

export async function tinhtoanToanchuyen() {
  try {
    const listLotrinh = await LotrinhModel.find().populate("xetronglotrinh");
    listLotrinh.forEach(async tuyen => {});
  } catch (err) {
    return `${err} +" He thong tinh toan loi!`;
  }
}
