import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "../node_modules/primereact/resources/themes/lara-light-cyan/theme.css";
import "../node_modules/primeicons/primeicons.css";
import "../node_modules/primeflex/primeflex.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
// import "../node_modules/primeflex/themes/primeone-light.css ";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
