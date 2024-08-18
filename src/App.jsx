import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PasswordChange from "./layout/PasswordChange";
import Layout from "./layout/Layout";
import CustomerList from "./pages/Admin/AddUser/CustomerList";
import EmployeeList from "./pages/Admin/AddUser/EmployeeList";
import AddEmployee from "./pages/Admin/AddUser/AddEmployee";
import Branch from "./pages/Admin/Branch/Branch";

function App() {
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
