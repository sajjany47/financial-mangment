import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PasswordChange from "./layout/PasswordChange";
import Layout from "./layout/Layout";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
import "../node_modules/primereact/resources/themes/lara-light-cyan/theme.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/reset-password" element={<PasswordChange />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
