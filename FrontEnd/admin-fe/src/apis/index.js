import axiosApi from "../config/axiosApi";

export const adminApi = {
  login(user) {
    return axiosApi(`admin/login`, `POST`, user);
  },
  logout(refreshToken) {
    return axiosApi(`admin/logout`, `POST`, { refreshToken });
  },
  changePassword(user, token) {
    return axiosApi(`admin/change-password`, `PUT`, user, null, token);
  },
  resetPassword(email) {
    return axiosApi(`admin/reset-default-password`, `PUT`, email);
  },
};
