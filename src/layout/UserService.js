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
    return error;
  }
};

export const userPasswordReset = async (payload) => {
  try {
    const response = await axios.post(
      `${apiPath}/user/login`,
      payload,
      headerWithToken
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
