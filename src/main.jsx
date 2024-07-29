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
  useEffect(() => {
    Instance.interceptors.request.use(
      (res) => {
        return res;
      },
      async (error) => {
        if (error.response.status === 403) {
          try {
            const result = await RefreshToken();
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
                title: "Failed to get Refresh Token",
                icon: "error",
              });
            }, 350);
          }
        } else {
          Swal.fire({
            title: error.response.data.message,
            icon: "error",
          });
        }
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
