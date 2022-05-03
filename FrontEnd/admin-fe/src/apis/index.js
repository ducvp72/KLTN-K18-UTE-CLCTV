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
  searchUsers(token, query, page, limit, sortBy) {
    return axiosApi(
      `sort/getUserAdmin?${
        query === "" ? "key=" : `key=${query}`
      }&page=${page}&limit=${limit}&sortBy=${`createdAt:${sortBy}`}`,
      `GET`,
      null,
      null,
      token
    );
  },
  banUser(token, userId) {
    console.log(userId);
    return axiosApi(`admin/ban-user-forAdmin`, `POST`, userId, null, token);
  },
};
