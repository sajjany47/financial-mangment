import { headerWithToken, Instance } from "../../../shared/constant";

export const documentTypeCreate = async (payload) => {
  const response = await Instance.post(
    `/document/document-type/create`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const documentTypeUpdate = async (payload) => {
  const response = await Instance.post(
    `/document/document-type/update`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const documentTypeList = async () => {
  const response = await Instance.get(
    `/document/document-type/list`,

    headerWithToken()
  );
  return response.data;
};

export const documentCreate = async (payload) => {
  const response = await Instance.post(
    `/document/create`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const documentUpdate = async (payload) => {
  const response = await Instance.post(
    `/document/update`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const documentList = async () => {
  const response = await Instance.get(
    `/document/list`,

    headerWithToken()
  );
  return response.data;
};

export const loanTypeCreate = async (payload) => {
  const response = await Instance.post(
    `/document/loan-type/create`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const loanTypeUpdate = async (payload) => {
  const response = await Instance.post(
    `/document/loan-type/update`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const loanTypeList = async () => {
  const response = await Instance.get(
    `/document/loan-type/list`,

    headerWithToken()
  );
  return response.data;
};

export const loanTypeGetList = async (payload) => {
  const response = await Instance.post(
    `/document/loan-type/dropdown-list`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const documentGetList = async (payload) => {
  const response = await Instance.post(
    `/document/dropdown-list`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const documentTypeGetList = async (payload) => {
  const response = await Instance.get(
    `/document/document-type/dropdown-list`,
    payload,
    headerWithToken()
  );
  return response.data;
};
