import { headerWithToken, Instance } from "../../../shared/constant";

export const createMenu = async (payload) => {
  const response = await Instance.post(
    "/access-control/menu/create",
    payload,
    headerWithToken()
  );
  return response.data;
};

export const updateMenu = async (payload) => {
  const response = await Instance.post(
    "/access-control/menu/update",
    payload,
    headerWithToken()
  );
  return response.data;
};

export const menuList = async (payload) => {
  const response = await Instance.post(
    `/access-control/menu/list`,
    payload,
    headerWithToken()
  );
  return response.data;
};
