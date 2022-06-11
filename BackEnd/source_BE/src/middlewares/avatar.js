const multer = require('multer');
const httpStatus = require('http-status');
const { parserAvatar } = require('../config/file');
// var FormData = require('form-data');

const uploadAvatar = (req, res, next) => {
  const uploadSV = parserAvatar.single('user-avatar');

  uploadSV(req, res, function (err) {
    // if (!req.body.con) return res.status(400).send('text is null');
    if (err instanceof multer.MulterError) {
      return res.status(httpStatus.BAD_REQUEST).send('File too large');
    }
    if (err) {
      // check if our filetype error occurred
      if (err === 'filetypeNull') return res.status(httpStatus.BAD_REQUEST).send('File is invalid');
      // An unknown error occurred when uploading.

      return res.sendStatus(err);
    }
    if (!req.file) return res.status(httpStatus.BAD_REQUEST).send('File not null');

    // all good, proceed
    next();
  });
};

module.exports = {
  uploadAvatar,
};
