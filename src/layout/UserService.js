import {
  headerWithOutToken,
  headerWithToken,
  Instance,
} from "../shared/constant";

export const RefreshToken = async (payload) => {
  try {
    const response = await Instance.post(
      `/user/refresh-token`,
      payload,
      headerWithToken()
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const userLogin = async (payload) => {
  try {
    const response = await Instance.post(
      `/user/login`,
      payload,
      headerWithOutToken()
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const userPasswordReset = async (payload) => {
  console.log(headerWithToken);
  try {
    const response = await Instance.post(
      `/user/update-password`,
      payload,
      headerWithToken()
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const logout = async () => {
  try {
    console.log(headerWithToken);
    const response = await Instance.get(`/user/logout`, headerWithToken());
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
