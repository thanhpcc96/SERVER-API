import LotrinhModel from "../models/lotrinh.model";

export async function tinhtoanToanchuyen() {
  try {
    const listLotrinh = await LotrinhModel.find().populate("xetronglotrinh");
    listLotrinh.forEach( async tuyen => {
        
    });
  } catch (err) {
    return `${err} +" He thong tinh toan loi!`;
  }
}
