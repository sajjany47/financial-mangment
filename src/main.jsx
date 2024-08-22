import { useEffect } from "react";
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
import axios from "axios";

export const Root = () => {
  useEffect(() => {
    const privateRequestInterceptor = Instance.interceptors.response.use(
      (resposne) => {
        return resposne;
      },
      async (error) => {
        if (error?.response?.status === 401) {
          try {
            const result = await RefreshToken();

            const accessToken = result.accessToken;
            const refreshToken = result.refreshToken;
            localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
            localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);

            const prevRequest = error.config;
            prevRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return axios(prevRequest);
          } catch (err) {
            setTimeout(() => {
              Swal.fire({
                title: error.message,
                icon: "error",
              });
            }, 350);

            return Promise.reject(err);
          }
        }

        Swal.fire({
          title: error.message,
          icon: "error",
        });
        return Promise.reject(error);
      }
    );

    return () => {
      Instance.interceptors.response.eject(privateRequestInterceptor);
    };
  }, []);

  useEffect(() => {
    // Add a request interceptor
    const publicRequestInterceptor = Instance.interceptors.request.use(
      function (config) {
        // Do something before request is sent
        return config;
      },
      function (error) {
        Swal.fire({
          title: error.message,
          icon: "error",
        });
        return Promise.reject(error);
      }
    );

    const publicResponseInterceptor = Instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        Swal.fire({
          title: error.message,
          icon: "error",
        });
        return Promise.reject(error);
      }
    );
    return () => {
      Instance.interceptors.response.eject(publicRequestInterceptor);
      Instance.interceptors.response.eject(publicResponseInterceptor);
    };
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        {/* <React.StrictMode> */}
        <App />
        {/* </React.StrictMode> */}
      </PersistGate>
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Root />);
