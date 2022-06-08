const httpStatus = require('http-status');
const cloudinary = require('cloudinary').v2;
const { User, Message, Group } = require('../models');
const ApiError = require('../utils/ApiError');
const { fileTypes } = require('../config/fileTypes');
const CryptoJS = require('crypto-js');
// const uploadImage = async (file, user) => {
// const newImage = new Image({
//   path: file.path,
//   name: file.originalname,
//   filename: file.filename,
//   imageTypes: file.mimetype,
//   size: file.size,
//   user: user.id,
// });
// const imgN = await newImage.save();
// const userp = await User.findById(user.id).populate('avatar', ['filename']);

//   try {
//     await User.findByIdAndUpdate(
//       user.id,
//       {
//         avatar: file.path,
//       },
//       { new: true, useFindAndModify: false }
//     );
//       cloudinary.uploader.destroy(userp.avatar.filename);

//   } catch (error) {
//     console.log(error);
//   }
// };

const encrypt = async (file, groupId) => {
  const ciphertext = CryptoJS.AES.encrypt(file, groupId).toString();
  return ciphertext;
};

const decrypt = async (fileEn, groupId) => {
  const bytes = CryptoJS.AES.decrypt(fileEn, groupId);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);

  return originalText;
};

const upLoadFile = async (sender, file, typeMessage, groupId) => {
  const en = await encrypt(file.path, groupId);
  console.log('EN', en);
  const de = await decrypt(en, groupId);
  console.log('De', de);

  let m;
  let res;
  console.log(groupId);
  // console.log(sender);
  // console.log(typeMessage);

  if (typeMessage === fileTypes.IMAGE) {
    console.log('IMG', typeMessage);
    try {
      m = new Message({ groupId, sender, typeMessage, image: en });
    } catch (error) {
      console.log(error);
    }
  }

  if (typeMessage === fileTypes.VIDEO) {
    console.log('VIDEO', typeMessage);
    try {
      m = new Message({ groupId, sender, typeMessage, video: en });
    } catch (error) {
      console.log(error);
    }
  }

  if (typeMessage === fileTypes.READ || fileTypes.DOWNLOAD) {
    console.log('FILE', typeMessage);
    try {
      m = new Message({ groupId, sender, typeMessage, file: en });
    } catch (error) {
      console.log(error);
    }
  }

  await Group.findByIdAndUpdate(groupId, {
    last: m._id,
  });

  await m.save().then((item) => {
    item
      .populate({
        path: 'sender',
        select: 'fullname avatar',
      })
      .execPopulate();
    res = item;
  });

  console.log('File response', res);

  return res;
};

const uploadImage = async (file, user) => {
  let changeAvatarUser;
  try {
    changeAvatarUser = await User.findByIdAndUpdate(
      user.id,
      {
        avatar: {
          path: file.path,
          filename: file.filename,
        },
      },
      { new: true, useFindAndModify: false }
    );
    cloudinary.uploader.destroy(user.avatar.filename, function (result) {
      console.log(result);
    });

    console.log(changeAvatarUser);
  } catch (error) {
    console.log(error);
  }
  return changeAvatarUser;
};

module.exports = {
  // changeAvatar,
  upLoadFile,
  uploadImage,
  encrypt,
  decrypt,
};
