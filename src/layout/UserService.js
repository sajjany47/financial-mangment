import axios from "axios";
import { apiPath, headerWithOutToken } from "../shared/constant";

export const userLogin = async (payload) => {
  try {
    const response = await axios.post(
      `${apiPath}/user/login`,
      payload,
      headerWithOutToken
    );
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
};
