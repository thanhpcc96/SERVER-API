import HTTPstatus from 'http-status';
import ActivityLogModel from '../../../models/activity.log.model';

export async function _getLog(req, res, next) {
  try {
    const listLog = await ActivityLogModel.find().populate('user');
    return res.status(HTTPstatus.OK).json({ err: false, result: listLog });
  } catch (error) {
    error.status = HTTPstatus.BAD_REQUEST;
    next(error);
  }
}
