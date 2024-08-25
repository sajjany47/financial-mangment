import axios from "axios";
import { apiPath } from "../shared/constant";
import { RefreshToken } from "../layout/UserService";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from "../shared/Config";

// Create a new Axios instance
const axiosInstance = axios.create({
  baseURL: apiPath,
});

// Add an interceptor to handle 403 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error status is 403 and the request has not been retried
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Prevent infinite loop

      try {
        // Call the RefreshToken function to get a new access token
        const result = await RefreshToken();

        const accessToken = result.accessToken;
        const refreshToken = result.refreshToken;

        // Store the new tokens in localStorage
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);

        // Update the Authorization header with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        // Retry the original request with the new token using the axiosInstance
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refreshing the token fails, reject the promise with the refreshError
        return Promise.reject(refreshError);
      }
    }

    // If the error is not 403 or retry fails, reject the promise with the original error
    return Promise.reject(error);
  }
);

export default axiosInstance;
