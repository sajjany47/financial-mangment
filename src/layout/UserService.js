import {
  getRefreshToken,
  headerWithOutToken,
  headerWithToken,
  Instance,
} from "../shared/constant";

export const RefreshToken = async () => {
  const token = getRefreshToken();
  const response = await Instance.get(`/user/refresh-token`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
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
