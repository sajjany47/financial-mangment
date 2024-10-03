import {
  headerWithFormData,
  headerWithToken,
  Instance,
} from "../../../shared/constant";

export const getLoanDetails = async (payload) => {
  const response = await Instance.get(`/loan/${payload}`, headerWithToken());
  return response.data;
};

export const applicationCreate = async (payload) => {
  const response = await Instance.post(
    `/loan/application-create`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const applicationUpdate = async (payload) => {
  const response = await Instance.post(
    `/loan/application-update`,
    payload,
    headerWithToken()
  );
  return response.data;
};
export const applicationDetails = async (id) => {
  const response = await Instance.get(`/loan/${id}`, headerWithToken());
  return response.data;
};
export const applicationStatusChange = async (payload) => {
  const response = await Instance.post(
    `/loan/status-change`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const applicationUpdateWithImage = async (payload) => {
  const response = await Instance.post(
    `/loan/application-document`,
    payload,
    headerWithFormData()
  );
  return response.data;
};

export const documentUpdateWithImage = async (payload) => {
  const response = await Instance.post(
    `/loan/document-update`,
    payload,
    headerWithFormData()
  );
  return response.data;
};

export const applicationList = async (payload) => {
  const response = await Instance.post(
    `/loan/datatable`,
    payload,
    headerWithToken()
  );
  return response.data;
};
