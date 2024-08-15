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

export const branchList = async () => {
  const response = await Instance.get("/branch/list", headerWithToken());
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
