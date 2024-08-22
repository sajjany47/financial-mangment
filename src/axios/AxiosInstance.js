import axios from "axios";
import { apiPath } from "../shared/constant";
import { RefreshToken } from "../layout/UserService";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from "../shared/Config";

const axiosInstance = axios.create({
  baseURL: apiPath,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const result = await RefreshToken();

        const accessToken = result.accessToken;
        const refreshToken = result.refreshToken;
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
        axios.defaults.headers.common["Authorization"] = `Bear ${accessToken}`;

        const originalRequest = error.config;
        originalRequest.headers["Authorization"] = `Bear ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
