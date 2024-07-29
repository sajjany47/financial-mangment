import axios from "axios";
import {
  apiPath,
  headerWithOutToken,
  headerWithToken,
} from "../shared/constant";

export const RefreshToken = async (payload) => {
  try {
    const response = await axios.post(
      `${apiPath}/user/refresh-token`,
      payload,
      headerWithToken
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const userLogin = async (payload) => {
  try {
    const response = await axios.post(
      `${apiPath}/user/login`,
      payload,
      headerWithOutToken
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const userPasswordReset = async (payload) => {
  try {
    const response = await axios.post(
      `${apiPath}/user/update-password`,
      payload,
      headerWithToken
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
