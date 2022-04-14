const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'myGallary',
    format: async (req, file) => {
      const mem = file.originalname.split('.').pop();
      return mem;
    }, // supports promises as well
    resource_type: 'auto',
  },
});

const parser = multer({
  storage,
  // limit the size to 5mb for any files coming in
  limits: { fileSize: 50000000 },
  // filer out invalid filetypes
  // eslint-disable-next-line object-shorthand
  // fileFilter: function (req, file, cb) {
  //   // eslint-disable-next-line no-use-before-define
  //   // checkImageType(file, cb);
  // },
});

function checkImageType(file, cb) {
  // define a regex that includes the file types we accept
  const filetypes = /jpeg|jpg|png|gif|mp4/;
  //check the file extention
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // more importantly, check the mimetype
  const mimetype = filetypes.test(file.mimetype);
  // if both are good then continue
  if (mimetype && extname) return cb(null, true);
  // otherwise, return error message
  cb('filetype');
}

module.exports = { parser };
