import axios from "axios";
import {
  apiPath,
  headerWithOutToken,
  headerWithToken,
} from "../shared/constant";

export const userLogin = async (payload) => {
  try {
    const response = await axios.post(
      `${apiPath}/user/login`,
      payload,
      headerWithOutToken
    );
    return response.data;
  } catch (error) {
    const err = error.response.data;
    throw err;
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
    const err = error.response.data;
    throw err;
  }
};
