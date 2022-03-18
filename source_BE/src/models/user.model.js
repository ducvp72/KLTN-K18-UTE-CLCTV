const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roleTypes, genderTypes } = require('../config/myConfig');

const userSchema = new mongoose.Schema(
  {
    fullname: { required: true, type: String },
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
        default: 'https://res.cloudinary.com/kltn-k18-dl/image/upload/v1645972871/myGallary/defaultAvatar.png.png',
      },
      filename: {
        type: String,
        default: 'defaultImage',
      },
    },
    email: { required: true, type: String },
    phone: { required: false, type: String },
    password: { required: true, type: String },
  },
  { timestamps: true }
);
// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

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
