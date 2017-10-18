import HTTPStatus from "http-status";

import { clientSeed } from "../seeds";

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
