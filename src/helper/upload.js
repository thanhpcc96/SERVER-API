/*eslint-disable*/
import multer, { diskStorage } from 'multer';
/**
 * Config upload for userImg
 */
export const _uploadMiddleware = () => {
    const store = diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/img/') //"dist/upload/"
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    });
    const upload = multer({ storage: store }).array('userPhoto', 2); // toi da upload 1 lan la 2 cai
    return upload.any();
}
