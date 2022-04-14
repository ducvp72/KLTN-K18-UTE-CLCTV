const httpStatus = require('http-status');
const cloudinary = require('cloudinary').v2;
const { User, Message } = require('../models');
const ApiError = require('../utils/ApiError');

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

const upLoadFile = async (sender, file, typeMessage, groupId) => {
  let fileR;
  console.log(groupId);
  console.log(sender);
  console.log(typeMessage);

  try {
    fileR = await Message.create(
      { groupId, sender, typeMessage, content: file.path },
      { new: true, useFindAndModify: false }
    );
  } catch (error) {}
  return fileR;
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
  } catch (error) {
    console.log(error);
  }
  return changeAvatarUser;
};

module.exports = {
  // changeAvatar,
  upLoadFile,
  uploadImage,
};
