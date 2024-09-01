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

export const userEducationUpdate = async (payload) => {
  const response = await Instance.post(
    `/user/update`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const userEducationDetailsUpdate = async (payload) => {
  const response = await Instance.post(
    `/user/education-update`,
    payload,
    headerWithFormData()
  );
  return response.data;
};

export const getDetails = async (payload) => {
  const response = await Instance.get(
    `/user/${payload}`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const employeeDataTable = async (payload) => {
  const response = await Instance.post(
    `/user/datatable`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const countryList = async () => {
  const response = await Instance.get(`/user/country`, headerWithToken());
  return response.data;
};

export const state = async (payload) => {
  const response = await Instance.get(
    `user/state/${payload}`,
    headerWithToken()
  );
  return response.data;
};

export const city = async (state, country) => {
  const response = await Instance.get(
    `user/city?country=${country}&state=${state}`,
    headerWithToken()
  );
  return response.data;
};

export const findIFSC = async (payload) => {
  const response = await Instance.get(
    `user/ifsc/${payload}`,
    headerWithToken()
  );
  return response.data;
};
