import { headerWithToken, Instance } from "../../../shared/constant";

export const getLoanDetails = async (payload) => {
  const response = await Instance.get(`/loan/${payload}`, headerWithToken());
  return response.data;
};

export const applicationCreate = async (payload) => {
  const response = await Instance.post(
    `/loan/create`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const applicationUpdate = async (payload) => {
  const response = await Instance.post(
    `/loan/update`,
    payload,
    headerWithToken()
  );
  return response.data;
};
