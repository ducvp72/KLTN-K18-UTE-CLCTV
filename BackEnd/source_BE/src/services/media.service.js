const CryptoJS = require('crypto-js');
const cloudinary = require('cloudinary').v2;
const { User, Message, Group } = require('../models');
const { fileTypes } = require('../config/fileTypes');
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
  // console.log('EN', en);
  // const de = await decrypt(en, groupId);
  // console.log('De', de);

  let m;
  let res;

  // // console.log(sender);
  // console.log(typeMessage);

  if (typeMessage === fileTypes.IMAGE) {
    // console.log('IMG', typeMessage);
    try {
      m = new Message({ groupId, sender, typeMessage, image: en, typeId: -1 });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  if (typeMessage === fileTypes.VIDEO) {
    // console.log('VIDEO', typeMessage);
    try {
      m = new Message({ groupId, sender, typeMessage, video: en, typeId: -1 });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  //File excel/ pdf.,....
  if (typeMessage === fileTypes.READ || typeMessage === fileTypes.DOWNLOAD) {
    // console.log('FILE', typeMessage);
    try {
      m = new Message({ groupId, sender, typeMessage, file: en, typeId: -1 });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  if (typeMessage === fileTypes.AUDIO) {
    // console.log('FILE', typeMessage);
    try {
      m = new Message({ groupId, sender, typeMessage, voice: en, typeId: -1 });
    } catch (error) {
      // eslint-disable-next-line no-console
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

  // console.log('File response', res);

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
      // eslint-disable-next-line no-console
      console.log(result);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
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
