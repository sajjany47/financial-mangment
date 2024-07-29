import React from "react";
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

export const Root = () => {
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
