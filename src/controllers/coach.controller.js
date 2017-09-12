import CoachModel from '../models/coach.model';
export async function _getAllCoach(req, res, next) {
    try {
        return res.status(200).json({ err: false, result: await CoachModel.find({}) })
    } catch (err) {
        return res.status(503).json({ err: true, message: "Loi ko the ket noi " + err })
    }
}
export async function _postAddNewCoach(req, res, next) {
    try {
        let coach = await CoachModel.findOne({ numberplate: req.body.numberplate });
        if (coach) {
            return res.status(401).json({ err: true, message: "Biển số xe này đã tồn tại trong hệ thống!" })
        }
        const coachFromReq = {
            numberplate: req.body.numberplate,
            seat: req.body.seat,
            name: req.body.name,
            productiontime: req.body.productiontime,
            kind: req.body.kind,
            photo: req.body.photo,
        }
        return res.status(200).json({ err: false, result: await CoachModel.create(coachFromReq) });

    } catch (err) {
        return res.status(503).json({ err: true, message: "Loi ko the ket noi " + err });
    }
}
export async function _putUpdateInfoCoach(req, res, next) {
    try {
        const coach = await CoachModel.findById(req.body.id);
        if (!coach) {
            return res.status(404).json({ err: true, message: 'Phuong tien khong ton tai tren he thong' });
        }
        coach.numberplate = coach.numberplate || req.body.numberplate;
        coach.seat = coach.seat || req.body.seat;
        coach.name = coach.name || req.body.name;
        coach.productiontime = coach.productiontime || req.body.productiontime;
        coach.kind = coach.kind || req.body.kind;
        coach.photo = coach.photo || req.body.photo;
        return res.status(200).json({ err: false, result: await coach.save() });
    } catch (err) {
        return res.status(503).json({ err: true, message: 'Loi he thong ' + err });
    }
}
export async function _deleteCoach(req, res, next) {
    try {
        const tinhtrang = await CoachModel.findByIdAndRemove(req.body.id);
        return res.status(200).json({ err: false, message: 'Xoa thanh cong' });
    } catch (err) {
        return res.status(503).json({ err: true, message: 'Loi khong he thong ' + err });
    }
}
