import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "../node_modules/primereact/resources/primereact.min.css";
import "../node_modules/primereact/resources/themes/lara-light-cyan/theme.css";
import "../node_modules/primeicons/primeicons.css";
import "../node_modules/primeflex/primeflex.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import Swal from "sweetalert2";
import { Instance } from "./shared/constant.js";
import { RefreshToken } from "./layout/UserService.js";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from "./shared/Config.js";

export const Root = () => {
  const errorMessage = (error) => {
    switch (error.response.status) {
      case 400:
        return error.response.data.message.message
          ? error.response.data.message.message
          : error.response.data.message;
      case 502:
        return error.response.data.message.message
          ? error.response.data.message.message
          : error.message;
      case 500:
        return error.message;
      default:
        return error.response.data.message;
    }
  };

  useEffect(() => {
    Instance.interceptors.response.use(
      (res) => {
        return res;
      },
      async (error) => {
        if (error.response.status === 403) {
          try {
            const payload = sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
            const result = await RefreshToken(payload);
            const accessToken = result.data.accessToken;
            const refreshToken = result.data.refreshToken;
            sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
            sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
            const prevRequest = error.config;
            prevRequest.sent = true;
            prevRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return Instance(prevRequest);
          } catch (error) {
            setTimeout(() => {
              Swal.fire({
                title: "Failed to generate Refresh Token",
                icon: "error",
              });
            }, 350);
            window.location.href = "/login";
          }
        } else if (error.response.status === 401) {
          Swal.fire({
            title: errorMessage(error),
            icon: "error",
          });
          sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
          sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
          // window.location.href = `http://localhost:5173/`;
        } else {
          Swal.fire({
            title: errorMessage(error),
            icon: "error",
          });
        }

        return Promise.reject(error);
      }
    );
  }, []);

  useEffect(() => {
    // Add a request interceptor
    Instance.interceptors.request.use(
      function (config) {
        // Do something before request is sent
        return config;
      },
      function (error) {
        Swal.fire({
          title: errorMessage(error),
          icon: "error",
        });
        return Promise.reject(error);
      }
    );
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </PersistGate>
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Root />);
