import axios from "axios";
import { env } from "./vairable";

const axiosApi = (
  endpoint,
  method = "GET",
  data = null,
  params = null,
  token = null
) => {
  return axios({
    url: `${env.domain}/${endpoint}`,
    method,
    data,
    params: params ? params : null,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
        }
      : null,
  });
};

export default axiosApi;
