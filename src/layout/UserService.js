import {
  headerWithOutToken,
  headerWithToken,
  Instance,
} from "../shared/constant";

export const RefreshToken = async (payload) => {
  const response = await Instance.post(
    `/user/refresh-token`,
    payload,
    headerWithToken()
  );
  return response.data;
};
export const userLogin = async (payload) => {
  const response = await Instance.post(
    `/user/login`,
    payload,
    headerWithOutToken()
  );
  return response.data;
};

export const userPasswordReset = async (payload) => {
  const response = await Instance.post(
    `/user/update-password`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const logout = async () => {
  const response = await Instance.get(`/user/logout`, headerWithToken());
  return response.data;
};
