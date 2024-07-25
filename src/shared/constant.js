export const apiPath = import.meta.env.VITE_API_BASE_URL;
export const env_path = import.meta.env.VITE_MODE;

const token = sessionStorage.getItem("token");

export const headerWithOutToken = {
  headers: { "Content-type": "application/json" },
};

export const headerWithToken = {
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};
