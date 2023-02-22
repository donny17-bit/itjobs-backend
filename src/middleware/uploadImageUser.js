const { compute_beta } = require("googleapis");
const { file } = require("googleapis/build/src/apis/file");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { format } = require("../config/mysql");
const helperWrapper = require("../helpers/wrapper");

// JIKA MENYIMPAN DATA DI CLOUDINARY
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "itJobs/profiles",
  },
});
// fungsi filefilter
const fileFilter = (request, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("only jpg,png,jpeg format allowed"));
  }
};
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1 },
  fileFilter,
}).single("image");

const handlingUpload = (request, response, next) => {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
    }
    if (error) {
      // An unknown error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
    }
    return next();
  });
};

module.exports = handlingUpload;

// const storage2 = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "Tickitz/user",
//   },
// });
// UNTUK PENGECEKAN LIMIT DAT EKSTENSI BISA DITAMBAHKAN DI MIDDLEWARE

// JIKA MENYIMPAN DATA DI DALAM PROJECT BACKEND
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "public/uploads/movie");
//   },
//   filename(req, file, cb) {
//     // console.log(file);
//     // file = {
//     //   fieldname: 'image',
//     //   originalname: 'LogoFazztrack.png',
//     //   encoding: '7bit',
//     //   mimetype: 'image/png'
//     // }
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });
