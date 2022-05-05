const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { roleTypes } = require("../configs/myConfig");

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
adminSchema.plugin(toJSON);
adminSchema.plugin(paginate);

/**
 * @typedef Admin
 */
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
