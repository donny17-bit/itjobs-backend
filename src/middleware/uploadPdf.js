const multer = require("multer");
const helperWrapper = require("../helpers/wrapper");

// Jika ingin menyimpan data di dalam project backend
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/pdf");
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({ storage }).single("file");

const handlingUpload = (request, response, next) => {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return helperWrapper.response(response, 401, error.messege, null);
    }
    if (error) {
      // An unknown error occurred when uploading.
      return helperWrapper.response(response, 401, error.messege, null);
    }
    return next();
  });
};

module.exports = handlingUpload;
