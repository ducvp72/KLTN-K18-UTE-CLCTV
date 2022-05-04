const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roleTypes } = require('../config/myConfig');

const adminSchema = new mongoose.Schema(
  {
    fullname: { required: true, type: String },
    role: {
      type: String,
      enum: [roleTypes.SUPERADMIN, roleTypes.ADMIN],
      default: roleTypes.ADMIN,
    },
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
    gmail: { required: true, type: String },
    password: { required: true, type: String },
  },
  { timestamps: true }
);
// add plugin that converts mongoose to json
adminSchema.plugin(toJSON);
adminSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
adminSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
/**
 * Check if phone is taken
 * @param {string} phone - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
adminSchema.statics.isPhoneTaken = async function (phone, excludeUserId) {
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
adminSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

adminSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef Admin
 */
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
