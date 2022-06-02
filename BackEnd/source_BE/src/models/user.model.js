const mongoose = require('mongoose');
const QRCode = require('qrcode');
const bcrypt = require('bcryptjs');
const { toJSON, paginate, paginateClient, paginateUserGroup, paginateAdmin } = require('./plugins');
const { roleTypes, genderTypes } = require('../config/myConfig');

const userSchema = new mongoose.Schema(
  {
    fullname: { required: true, type: String },
    username: { required: true, type: String },
    birth: { required: true, type: String },
    gender: {
      required: true,
      type: String,
      enum: [genderTypes.FEMALE, genderTypes.MALE, genderTypes.OTHER],
    },
    role: {
      type: String,
      enum: [roleTypes.USER],
      default: roleTypes.USER,
    },
    isActivated: { required: true, type: Boolean, default: false },
    isBanned: { required: true, type: Boolean, default: false },
    avatar: {
      path: {
        type: String,
        default: 'https://res.cloudinary.com/kltn-k18-dl/image/upload/v1654164139/myGallary/personal_nh91kw.png',
      },
      filename: {
        type: String,
        default: 'defaultImage',
      },
    },
    email: { required: true, type: String },
    password: { required: true, type: String },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.plugin(paginateClient);
userSchema.plugin(paginateAdmin);
userSchema.plugin(paginateUserGroup);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isusernameTaken = async function (username, excludeUserId) {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if phone is taken
 * @param {string} phone - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPhoneTaken = async function (phone, excludeUserId) {
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.virtual('tempQR').get(async function () {
  let qr;
  const objUser = {
    id: this._id,
    fullname: this.fullname,
    username: this.username,
    birth: this.birth,
    gender: this.gender,
    isActivated: this.isActivated,
    isBanned: this.isBanned,
    email: this.email,
    createdAt: this.createdAt,
    role: this.role,
    avatar: this.avatar.path,
  };

  await QRCode.toDataURL(JSON.stringify(objUser))
    .then((res) => {
      // console.log(res);
      qr = res;
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
  return qr;
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
