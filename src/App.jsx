/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PasswordChange from "./layout/PasswordChange";
import Layout from "./layout/Layout";
import CustomerList from "./pages/Admin/AddUser/CustomerList";
import EmployeeList from "./pages/Admin/AddUser/EmployeeList";
import AddEmployee from "./pages/Admin/AddUser/AddEmployee";
import Branch from "./pages/Admin/Branch/Branch";
import { useEffect } from "react";
import { Instance } from "./shared/constant";
import { RefreshToken } from "./layout/UserService";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from "./shared/Config";
import Swal from "sweetalert2";

function App() {
  let isRefreshing = false;

  useEffect(() => {
    const privateRequestInterceptor = Instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error?.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!isRefreshing) {
            isRefreshing = true;

            try {
              const result = await RefreshToken();

              const accessToken = result.accessToken;
              const refreshToken = result.refreshToken;

              // Store the new tokens

              sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
              sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);

              // Update the Authorization header
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${accessToken}`;

              return Instance(originalRequest);
            } catch (err) {
              Swal.fire({
                title: "Session expired. Please log in again.",
                icon: "error",
              });
              return Promise.reject(err);
            } finally {
              isRefreshing = false;
            }
          }
        }
        if (error.response.status !== 403) {
          Swal.fire({
            title: error.response?.data?.message || "An error occurred",
            icon: "error",
          });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      Instance.interceptors.response.eject(privateRequestInterceptor);
    };
  }, []);

  // useEffect(() => {
  //   // Add a request interceptor
  //   const publicRequestInterceptor = Instance.interceptors.request.use(
  //     function (config) {
  //       // Do something before request is sent
  //       return config;
  //     },
  //     function (error) {
  //       Swal.fire({
  //         title: error.response.data.message,
  //         icon: "error",
  //       });
  //       return Promise.reject(error);
  //     }
  //   );

  //   const publicResponseInterceptor = Instance.interceptors.response.use(
  //     (response) => {
  //       return response;
  //     },
  //     (error) => {
  //       Swal.fire({
  //         title: error.response.data.message,
  //         icon: "error",
  //       });
  //       return Promise.reject(error);
  //     }
  //   );
  //   return () => {
  //     Instance.interceptors.response.eject(publicRequestInterceptor);
  //     Instance.interceptors.response.eject(publicResponseInterceptor);
  //   };
  // }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/reset-password" element={<PasswordChange />} />
            <Route path="/customers/list" element={<CustomerList />} />
            <Route path="/branch/list" element={<Branch />} />
            <Route path="/employee/list" element={<EmployeeList />} />
            <Route path="/employee/add" element={<AddEmployee />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
