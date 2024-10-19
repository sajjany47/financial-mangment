import { Instance, headerWithToken } from "../../../shared/constant";

export const datatable = async (payload) => {
  const response = await Instance.post(
    `/loan/manage/list`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const RemarkAndAgentUpdate = async (payload) => {
  const response = await Instance.post(
    `/loan/manage/remark-agent-update`,
    payload,
    headerWithToken()
  );
  return response.data;
};
export const BranchAgentList = async (branchId) => {
  const response = await Instance.get(
    `/loan/manage/branch-agent/${branchId}`,
    headerWithToken()
  );
  return response.data;
};

export const AgentRemarkDetails = async (loanId) => {
  const response = await Instance.get(
    `/loan/manage/remark/${loanId}`,
    headerWithToken()
  );
  return response.data;
};

export const PaymentDetails = async (loanId) => {
  const response = await Instance.get(
    `/loan/manage/payment/${loanId}`,
    headerWithToken()
  );
  return response.data;
};
export const LoanPay = async (payload) => {
  const response = await Instance.post(
    `/loan/manage/pay`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const PaidDetails = async (loanId) => {
  const response = await Instance.get(
    `/loan/manage/paid-list/${loanId}`,
    headerWithToken()
  );
  return response.data;
};
