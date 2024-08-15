/* eslint-disable no-prototype-builtins */
import { headerWithToken, Instance } from "../../../shared/constant";

export const createBranch = async (payload) => {
  const response = await Instance.post(
    "/branch/create",
    payload,
    headerWithToken()
  );
  return response.data;
};

export const updateBranch = async (payload) => {
  const response = await Instance.post(
    "/branch/update",
    payload,
    headerWithToken()
  );
  return response.data;
};

export const branchList = async (payload) => {
  const url =
    payload.hasOwnProperty("country") &&
    payload.hasOwnProperty("state") &&
    payload.hasOwnProperty("city")
      ? `/branch/?country=${payload.country}&state=${payload.state}&city=${payload.city}`
      : payload.hasOwnProperty("country") && payload.hasOwnProperty("state")
      ? `/branch/?country=${payload.country}&state=${payload.state}`
      : payload.hasOwnProperty("country")
      ? `/branch/?country=${payload.country}`
      : "/branch/";

  const response = await Instance.get(url, headerWithToken());
  return response.data;
};

export const branchDatatable = async (payload) => {
  const response = await Instance.get(
    "/branch/datatable",
    payload,
    headerWithToken()
  );
  return response.data;
};
