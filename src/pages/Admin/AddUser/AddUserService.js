import axios from "axios";
import {
  headerWithFormData,
  headerWithToken,
  Instance,
} from "../../../shared/constant";
import Swal from "sweetalert2";

export const userCreate = async (payload) => {
  const response = await Instance.post(
    `/user/admin-signup`,
    payload,
    headerWithFormData()
  );
  return response.data;
};

export const userUpdate = async (payload) => {
  const response = await Instance.post(
    `/user/update`,
    payload,
    headerWithFormData()
  );
  return response.data;
};

export const userEducationDetailsUpdate = async (payload) => {
  const response = await Instance.post(
    `/user/update-education`,
    payload,
    headerWithFormData()
  );
  return response.data;
};

export const getDetails = async (payload) => {
  const response = await Instance.get(
    `/user/${payload}`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const employeeDataTable = async (payload) => {
  const response = await Instance.post(
    `/user/datatable`,
    payload,
    headerWithToken()
  );
  return response.data;
};

export const countryList = async () => {
  try {
    const countryList = await axios.get(
      `https://api.countrystatecity.in/v1/countries`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "OU5ycmZrek91NnpXVjdUTVJoUVZ1N3ZWWWJGM3lnQVB0N0djYngzMA==",
        },
      }
    );

    return countryList;
  } catch (error) {
    Swal.fire({ title: "Failed to fetched country list", icon: "error" });
  }
};

export const state = async (payload) => {
  try {
    const stateList = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${payload}/states`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "OU5ycmZrek91NnpXVjdUTVJoUVZ1N3ZWWWJGM3lnQVB0N0djYngzMA==",
        },
      }
    );

    return stateList;
  } catch (error) {
    Swal.fire({ title: "Failed to fetched state list", icon: "error" });
  }
};

export const city = async (country, state) => {
  try {
    const cityList = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${country}/states/${state}/cities`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "OU5ycmZrek91NnpXVjdUTVJoUVZ1N3ZWWWJGM3lnQVB0N0djYngzMA==",
        },
      }
    );

    return cityList;
  } catch (error) {
    Swal.fire({ title: "Failed to fetched city list", icon: "error" });
  }
};

export const findIFSC = async (payload) => {
  try {
    const ifscCode = await axios.get(`https://ifsc.razorpay.com/${payload}`);

    return ifscCode;
  } catch (error) {
    Swal.fire({ title: "Failed to fetched IFSC Code", icon: "error" });
  }
};
