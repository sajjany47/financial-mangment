import { headerWithToken, Instance } from "../../../shared/constant";

export const financeDatatable = async (payload) => {
  const response = await Instance.post(
    `/finance/datatable`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const getInvestorDetails = async (payload) => {
  const response = await Instance.get(`/finance/${payload}`, headerWithToken());
  return response.data;
};

export const financeUpdate = async (payload) => {
  const response = await Instance.post(
    `/finance/update`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const financeCreate = async (payload) => {
  const response = await Instance.post(
    `/finance/create`,
    payload,
    headerWithToken()
  );
  return response.data;
};
