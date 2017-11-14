import HTTPStatus from 'http-status';

import { clientSeed, deleteAllClient, createChuyenXeSeed, deleteAllChuyen, generateChuyenInDay, userSeed} from '../seeds';


export async function _getClientSeeds(req, res, next) {
  try {
    await clientSeed(req.params.count);
    return res
      .status(HTTPStatus.OK)
      .send(`Seed thành công! Đã tạo ${req.params.count} khách hàng`);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
export async function getUserSeeds(req, res, next) {
  try {
      await userSeed(req.params.role);
      return res
      .status(HTTPStatus.OK)
      .send(`Seed thành công! Đã tạo 32 nhan vien`);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
export async function _deleteAllClient(req, res, next) {
  try {
    await deleteAllClient();
    return res.status(HTTPStatus.OK).send('Da xoa tat ca khach hang');
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function _generateChuyenSeed(req, res, next) {
  try {
    const kq = await createChuyenXeSeed();
    console.log('=================kq=============');
    console.log(kq.length);
    console.log('===============================');
    return res.status(HTTPStatus.OK).send(`tao chuyen xe thanh cong`);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
export async function _deleteAllChuyen(req, res, next) {
  try {
    await deleteAllChuyen();
    return res.status(HTTPStatus.OK).send('Da xoa tat ca chuyen');
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function _generateChuyenInDay(req, res, next) {
  try {
    await generateChuyenInDay();
    return res.status(HTTPStatus.OK).json({res: await generateChuyenInDay()});
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
