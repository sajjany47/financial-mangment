import { headerWithToken, Instance } from "../../../shared/constant";

export const PrimeMenuCreate = async (payload) => {
  const response = await Instance.post(
    "/access/prime-menu/create",
    payload,
    headerWithToken()
  );
  return response.data;
};

export const PrimeMenuUpdate = async (payload) => {
  const response = await Instance.post(
    "/access/prime-menu/update",
    payload,
    headerWithToken()
  );
  return response.data;
};

export const ChildMenuCreate = async (payload) => {
  const response = await Instance.post(
    "/access/child-menu/create",
    payload,
    headerWithToken()
  );
  return response.data;
};

export const ChildMenuUpdate = async (payload) => {
  const response = await Instance.post(
    "/access/child-menu/update",
    payload,
    headerWithToken()
  );
  return response.data;
};

export const MenuList = async () => {
  const response = await Instance.get(
    `/access/prime-menu/list`,

    headerWithToken()
  );
  return response.data;
};

export const ChildMenuList = async () => {
  const response = await Instance.get(
    `/access/child-menu/list`,

    headerWithToken()
  );
  return response.data;
};

export const PositionCreate = async (payload) => {
  const response = await Instance.post(
    "/access/position/create",
    payload,
    headerWithToken()
  );
  return response.data;
};

export const PositionUpdate = async (payload) => {
  const response = await Instance.post(
    "/access/position/update",
    payload,
    headerWithToken()
  );
  return response.data;
};

export const PositionList = async () => {
  const response = await Instance.get(
    `/access/position/list`,

    headerWithToken()
  );
  return response.data;
};
