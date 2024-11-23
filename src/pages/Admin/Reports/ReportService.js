import { headerWithToken, Instance } from "../../../shared/constant";

export const FinanceYearReport = async (payload) => {
  const response = await Instance.post(
    `/report/financial-year/invest`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const FinanceYearLoanReport = async (payload) => {
  const response = await Instance.post(
    `/report/financial-year/loan`,
    payload,
    headerWithToken()
  );
  return response.data;
};
