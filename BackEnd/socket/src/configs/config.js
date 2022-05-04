const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 7000;

const mongoose = {
  url: process.env.MONGODB_URL,
  options: {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  PORT,
  mongoose,
  JWT_SECRET,
};
