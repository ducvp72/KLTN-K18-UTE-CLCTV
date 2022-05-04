const socketioJwt = require("socketio-jwt");
const { JWT_SECRET } = require("../configs/config");

const AuthMiddlesware = () => {
  // return socketioJwt.authorize({
  //   secret: JWT_SECRET,
  //   handshake: true,
  // });
  try {
    const verify = socketioJwt.authorize({
      secret: JWT_SECRET,
      handshake: true,
    });
    return verify;
  } catch (err) {
    return new Error("not authoried");
  }
};

module.exports = AuthMiddlesware;
