import axios from "axios";
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from "./Config";
import {
  city,
  countryList,
  state,
} from "../pages/Admin/AddUser/AddUserService";

export const apiPath = import.meta.env.VITE_API_BASE_URL;
export const env_path = import.meta.env.VITE_MODE;

export const Instance = axios.create({
  baseURL: apiPath,
});
// const token = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
// console.log(token);

export const getAccessToken = () => {
  return sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const getRefreshToken = () => {
  return sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
};

export const headerWithToken = () => {
  const token = getAccessToken();

  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};
export const headerWithOutToken = () => {
  return {
    headers: {
      "Content-Type": "application/json",
    },
  };
};
export const headerWithFormData = () => {
  const token = getAccessToken();
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
};

export const capitalizeFirstLetter = (str) => {
  if (!str) return str; // Return empty string if input is empty or null
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const fetchCountryStateCityData = async (data) => {
  try {
    const countryData = await countryList();
    const response = {};
    if (countryList) {
      const filterCountry = countryData.data.find(
        (item) => item.id === Number(data.country)
      );

      if (filterCountry) {
        const item = await state(filterCountry.iso2);

        response.state = item.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));

        const filterState = item.data.find(
          (stateItem) => stateItem.id === Number(data.state)
        );

        if (filterState) {
          const elm = await city(filterCountry.iso2, filterState.iso2);

          response.city = elm.data.map((item) => ({
            label: item.name,
            value: item.id,
          }));
        }
      }

      return response;
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
