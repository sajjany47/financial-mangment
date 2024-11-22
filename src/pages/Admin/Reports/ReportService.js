import { headerWithToken, Instance } from "../../../shared/constant";

export const FinanceYearReport = async (payload) => {
  const response = await Instance.post(
    `/report/financial-year`,
    payload,
    headerWithToken()
  );
  return response.data;
};
