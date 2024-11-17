import axios from "axios";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  PayoutKey,
  REFRESH_TOKEN_STORAGE_KEY,
} from "./Config";

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
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
export const FormatString = (str) => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
export const SlashString = (str) => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
export const FormatType = (str) => {
  // Replace underscores with spaces and capitalize each word
  return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

export const cleanObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
};

export const PayoutFrequencyConditional = (data, duration) => {
  const a = data.filter((item) => {
    if (Number(duration) % 12 === 0) {
      return (
        item.value === PayoutKey.MONTHLY ||
        item.value === PayoutKey.AT_MATURITY ||
        item.value === PayoutKey.QUARTERLY ||
        item.value === PayoutKey.SEMI_ANNUALLY ||
        item.value === PayoutKey.ANNUALLY
      );
    } else if (Number(duration) % 6 === 0) {
      return (
        item.value === PayoutKey.MONTHLY ||
        item.value === PayoutKey.AT_MATURITY ||
        item.value === PayoutKey.QUARTERLY ||
        item.value === PayoutKey.SEMI_ANNUALLY
      );
    } else if (Number(duration) % 3 === 0) {
      return (
        item.value === PayoutKey.MONTHLY ||
        item.value === PayoutKey.AT_MATURITY ||
        item.value === PayoutKey.QUARTERLY
      );
    } else if (Number(duration) % 1 === 0) {
      return (
        item.value === PayoutKey.MONTHLY || item.value === PayoutKey.AT_MATURITY
      );
    }
  });
  return a;
};

export const TransformData = (data) => {
  const entries = Object.entries(data).map(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      // Handle nested objects
      return [key, value.name || JSON.stringify(value)];
    }
    return [key, value];
  });

  // Flatten key-value pairs into single array
  const flattened = entries.flat();

  // Group into sub-arrays of two key-value pairs
  const chunked = [];
  for (let i = 0; i < flattened.length; i += 4) {
    chunked.push(flattened.slice(i, i + 4));
  }

  return chunked;
};
