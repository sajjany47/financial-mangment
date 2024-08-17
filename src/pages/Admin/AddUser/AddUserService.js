import {
  headerWithFormData,
  headerWithToken,
  Instance,
} from "../../../shared/constant";

export const userCreate = async (payload) => {
  const response = await Instance.post(
    `/user/admin-signup`,
    payload,
    headerWithFormData()
  );
  return response.data;
};

export const userUpdate = async (payload) => {
  const response = await Instance.post(
    `/user/update`,
    payload,
    headerWithFormData()
  );
  return response.data;
};

export const userEducationDetailsUpdate = async (payload) => {
  const response = await Instance.post(
    `/user/update-education`,
    payload,
    headerWithFormData()
  );
  return response.data;
};

export const getDetails = async (payload) => {
  const response = await Instance.get(
    `/user/:${payload}`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const userEducationUpdate = async (payload) => {
  const response = await Instance.post(
    `/user/update-education`,
    payload,
    headerWithFormData()
  );
  return response.data;
};

export const userDocumentUpdate = async (payload) => {
  const response = await Instance.post(
    `/user/update-document`,
    payload,
    headerWithFormData()
  );
  return response.data;
};

export const userAccountUpdate = async (payload) => {
  const response = await Instance.post(
    `/user/update-account`,
    payload,
    headerWithFormData()
  );
  return response.data;
};

export const userBasicUpdate = async (payload) => {
  const response = await Instance.post(
    `/user/update-basic`,
    payload,
    headerWithFormData()
  );
  return response.data;
};

export const countryList = async () => {
  const response = await Instance.get(`/user/country`, headerWithToken());
  return response.data;
};

export const state = async (payload) => {
  const response = await Instance.post(
    `/user/state`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const city = async (payload) => {
  const response = await Instance.post(
    `/user/city`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const findIFSC = async (payload) => {
  const response = await Instance.post(
    `/user/ifsc`,
    payload,
    headerWithToken()
  );
  return response.data;
};
