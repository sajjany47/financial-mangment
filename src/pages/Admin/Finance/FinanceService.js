import { headerWithToken, Instance } from "../../../shared/constant";

export const InvestorDatatable = async (payload) => {
  const response = await Instance.post(
    `/finance/investor/datatable`,
    payload,
    headerWithToken()
  );
  return response.data;
};
export const PayoutDatatable = async (payload) => {
  const response = await Instance.post(
    `/finance/payout/datatable`,
    payload,
    headerWithToken()
  );
  return response.data;
};
export const ReedemDatatable = async (payload) => {
  const response = await Instance.post(
    `/finance/reedem/datatable`,
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
