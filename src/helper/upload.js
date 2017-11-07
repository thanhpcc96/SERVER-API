/*eslint-disable*/
import multer, { diskStorage } from 'multer';
/**
 * Config upload for userImg
 */
    const store = diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/img/') //"dist/upload/"
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    });
    const upload = multer({ storage: store })// toi da upload 1 lan la 2 cai
    export default upload;
