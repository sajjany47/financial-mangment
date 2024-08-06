import { headerWithFormData, Instance } from "../../../shared/constant";

export const userCreate = async (payload) => {
  try {
    const response = await Instance.post(
      `/user/admin-signup`,
      payload,
      headerWithFormData()
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const userEducationUpdate = async (payload) => {
  try {
    const response = await Instance.post(
      `/user/update-education`,
      payload,
      headerWithFormData()
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const userDocumentUpdate = async (payload) => {
  try {
    const response = await Instance.post(
      `/user/update-document`,
      payload,
      headerWithFormData()
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const userAccountUpdate = async (payload) => {
  try {
    const response = await Instance.post(
      `/user/update-account`,
      payload,
      headerWithFormData()
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const userBasicUpdate = async (payload) => {
  try {
    const response = await Instance.post(
      `/user/update-basic`,
      payload,
      headerWithFormData()
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
