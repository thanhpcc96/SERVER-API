import ChuyenxeModel from '../models/chuyenxe.model';
import LotrinhModel from '../models/lotrinh.model'


export function createChuyenXeSeed(){
  const listChuyen=[];
}
export function initiaLotrinh(count){
  const listLotrinh=[];
  const lotrinhHP_HN={
    routeOfTrip:{
      from:'Hai Phong',
      to:'Ha Noi',
      lotrinh: ['Cau Rao', 'Niem Nghia', 'tp Hai Duong', 'My Hao','Nhu Quynh','Van Lam','Gia Lam']
    },
    thoigianvanchuyen:3,
    vitriChotKT:['tp Hai Duong', 'tt My Hao', 'quan Goi', 'ben xe Gia Lam'],
    gpxFileName: 'tasks/gpx-data/HN_HP.gpx',
    xetronglotrinh:[
      ""
    ]
  }
}
