const moment = require("moment");
const formatMessage = (username, text) => {
  return {
    username,
    text,
    time: moment().format("hh:mm a"),
  };
};

module.exports = formatMessage;
