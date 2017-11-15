/*eslint-disable*/
// import multer, { diskStorage } from 'multer';
// /**
//  * Config upload for userImg
//  */
//     const store = diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, 'public/img/') //"dist/upload/"
//         },
//         filename: (req, file, cb) => {
//             cb(null, file.originalname)
//         }
//     });
//     const upload = multer({ storage: store })// toi da upload 1 lan la 2 cai
//     export default upload;

import multer from "multer";
import multerS3 from "multer-s3";
import fs from "fs";
import AWS from "aws-sdk";

import config from './S3_config'

// AWS.config(config);
const s3 = new AWS.S3(config);

// //Delete bucket.
// //Require bucketName via delete
// //check http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property for more info
// exports.deleteBucket = function(req, res) {
//   var item = req.body;
//   var params = { Bucket: item.bucketName };
//   s3.deleteBucket(params, function(err, data) {
//     if (err) {
//       return res.send({ error: err });
//     }
//     res.send({ data });
//   });
// };

// //Delete bucket cors configuration.
// // Requires bucketName via delete
// //check http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucketCors-property for more info
// exports.deleteBucketCors = function(req, res) {
//   var item = req.body;
//   var params = { Bucket: item.bucketName };
//   s3.deleteBucketCors(params, function(err, data) {
//     if (err) {
//       return res.send({ error: err });
//     }
//     res.send({ data });
//   });
// };

// //Retrieves objects from Amazon s3
// //check http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property to configure params properties
// //eg var params = {Bucket: 'bucketname', Key:'keyname'}
// exports.getObjects = function(req, res) {
//   var item = req.body;
//   var params = { Bucket: req.params.bucketName };
//   s3.getObject(params, function(err, data) {
//     if (err) {
//       return res.send({ error: err });
//     }
//     res.send({ data });
//   });
// };

// //Delete qn object
// //check http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property for more info
// exports.deleteObject = function(req, res) {
//   var item = req.body;
//   var params = { Bucket: item.bucketName, Key: item.key };
//   s3.deleteObjects(params, function(err, data) {
//     if (err) {
//       return res.send({ error: err });
//     }
//     res.send({ data });
//   });
// };

// //cloud image uploader using multer-s3
// //Pass the bucket name to the bucketName param to upload the file to the bucket
const upload =  multer({
  storage: multerS3({
    s3,
    bucket: "thanhhaodoantotnghiep",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      console.log(file);
      cb(null, file.originalname); //use Date.now() for unique file keys
    }
  })
});

export default upload;

// const uploadFile = (req, res) => {
//   const item = req.body;
//   const upload = multer({
//     storage: multerS3({
//       s3,
//       bucket: "ten bucket name",
//       metadata: function(req, file, cb) {
//         cb(null, { fieldName: file.fieldname });
//       },
//       key: function(req, file, cb) {
//         cb(null, Date.now().toString());
//       }
//     })
//   });
// };
