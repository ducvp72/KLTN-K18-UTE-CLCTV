const mongoose = require("mongoose");

const {
  toJSON,
  paginate,
  paginateClient,
  paginateUserGroup,
} = require("./plugins");
const { roleTypes, genderTypes } = require("../configs/myConfig");

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
        default:
          "https://res.cloudinary.com/kltn-k18-dl/image/upload/v1645972871/myGallary/defaultAvatar.png.png",
      },
      filename: {
        type: String,
        default: "defaultImage",
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
userSchema.plugin(paginateClient);
userSchema.plugin(paginateUserGroup);

/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
