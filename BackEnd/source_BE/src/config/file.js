const cloudinary = require('cloudinary').v2;
const CryptoJS = require('crypto-js');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

function checkImageType(file, cb) {
  // define a regex that includes the file types we accept
  const filetypes = /jpeg|jpg|png|gif|mp4|mp3|zip|rar|document|docx|txt|pdf|xlsx|pptx|wav|text/;
  // check the file extention
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // eslint-disable-next-line no-console
  // console.log('File kind', path.extname(file.originalname).toLowerCase());
  // more importantly, check the mimetype
  // console.log('Info', file);
  const mimetype = filetypes.test(file.mimetype);
  // if both are good then continue
  if (mimetype && extname) return cb(null, true);
  // otherwise, return error message
  cb('filetypeNull');
}

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
  fileFilter: function (req, file, cb) {
    // Fe gui wa
    // const ciphertext = CryptoJS.AES.encrypt(
    //   JSON.stringify(file),
    //   '$2a$12$OQ8RAC218lNswEhYDLUKBO3hRzcpcVwyvA.XgKxuufu3.stOdkksu'
    // ).toString();

    // console.log(ciphertext);

    // Be xu li giai ma
    // const bytes = CryptoJS.AES.decrypt(file, '$2a$12$OQ8RAC218lNswEhYDLUKBO3hRzcpcVwyvA.XgKxuufu3.stOdkksu');
    // const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // console.log(decryptedData);

    // eslint-disable-next-line no-use-before-define
    checkImageType(file, cb);
  },
});

const parserAvatar = multer({
  storage,
  // limit the size to 5mb for any files coming in
  limits: { fileSize: 50000000 },
  // filer out invalid filetypes
  // eslint-disable-next-line object-shorthand
  fileFilter: function (req, file, cb) {
    // eslint-disable-next-line no-use-before-define
    checkImageType(file, cb);
  },
});

module.exports = { parser, parserAvatar };
