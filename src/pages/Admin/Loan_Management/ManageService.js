import { Instance, headerWithToken } from "../../../shared/constant";

export const datatable = async (payload) => {
  const response = await Instance.post(
    `/loan/manage/list`,
    payload,
    headerWithToken()
  );
  return response.data;
};
