import { headerWithToken, Instance } from "../../../shared/constant";

export const emiDetails = async (payload) => {
  const response = await Instance.post(
    `/loan/emi-details`,
    payload,
    headerWithToken()
  );
  return response.data;
};
