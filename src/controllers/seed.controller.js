import HTTPStatus from "http-status";

import { clientSeed,deleteAllClient } from "../seeds";

export async function _getClientSeeds(req, res, next) {
    try {
        await clientSeed(req.params.count);
        return res.status(HTTPStatus.OK)
        .send(`Seed thành công! Đã tạo ${req.params.count} khách hàng`);
    } catch (err) {
        err.status= HTTPStatus.BAD_REQUEST;
        return next(err)

    }
}
export async function _deleteAllClient(req,res, next){
  try {
      await deleteAllClient();
      return res.status(HTTPStatus.OK).send('Da xoa tat ca khach hang');
  } catch (err) {
    err.status=HTTPStatus.BAD_REQUEST;
    return next(err)
  }
}
