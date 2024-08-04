import { headerWithToken, Instance } from "../../../shared/constant";

export const userCreate = async (payload) => {
  try {
    const response = await Instance.post(
      `/user/admin-signup`,
      payload,
      headerWithToken()
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
      headerWithToken()
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
      headerWithToken()
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
      headerWithToken()
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
      headerWithToken()
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
