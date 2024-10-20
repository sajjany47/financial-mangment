/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PasswordChange from "./layout/PasswordChange";
import Layout from "./layout/Layout";
import Branch from "./pages/Admin/Branch/Branch";
import { useEffect } from "react";
import { Instance } from "./shared/constant";
import { RefreshToken } from "./layout/UserService";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from "./shared/Config";
import Swal from "sweetalert2";
import Lead from "./pages/Admin/Loan/Lead";
import NewApplication from "./pages/Admin/Loan/NewApplication";
import PLoanAdd from "./pages/Admin/Loan/personal/PLoanAdd";
import RejectedApplication from "./pages/Admin/Loan/RejectedApplication";
import ProgressApplication from "./pages/Admin/Loan/ProgressApplication";
import ApprovedApplication from "./pages/Admin/Loan/ApprovedApplication";
import Document from "./pages/Admin/setting/Document";
import DocumentType from "./pages/Admin/setting/DocumentType";
import LoanType from "./pages/Admin/setting/LoanType";
import PLoanEdit from "./pages/Admin/Loan/personal/PLoanEdit";
import Charges from "./pages/Admin/setting/Charges";
import Calculator from "./pages/Admin/EMI/Calculator";
import Disbursed from "./pages/Admin/Loan/Disbursed";
import ActiveLoan from "./pages/Admin/Loan_Management/ActiveLoan";
import DeliquentLoan from "./pages/Admin/Loan_Management/DeliquentLoan";
import ClosedLoan from "./pages/Admin/Loan_Management/ClosedLoan";
import CustomerList from "./pages/Admin/Customer/CustomerList";
import EmployeeList from "./pages/Admin/Employee/EmployeeList";
import AddEmployee from "./pages/Admin/Employee/AddEmployee";
import EditEmployee from "./pages/Admin/Employee/EditEmployee";
import RemarkDetails from "./pages/Admin/Loan_Management/RemarkDetails";
import LoanPayment from "./pages/Admin/Loan_Management/LoanPayment";
import History from "./pages/Admin/Payment/History";
import Upcoming from "./pages/Admin/Payment/Upcoming";
import Defaulter from "./pages/Admin/Payment/Defaulter";
import ApplicationView from "./pages/Admin/Payment/ApplicationView";

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
            <Route path="/employee/edit" element={<EditEmployee />} />
            <Route path="/emi/calculator" element={<Calculator />} />
            <Route path="/lead/list" element={<Lead />} />
            <Route path="/applications/list" element={<NewApplication />} />
            <Route
              path="/applications/rejected"
              element={<RejectedApplication />}
            />
            <Route
              path="/applications/approved"
              element={<ApprovedApplication />}
            />
            <Route
              path="/applications/progress"
              element={<ProgressApplication />}
            />
            <Route path="/applications/disbursed" element={<Disbursed />} />
            <Route
              path="/application/personal-loan/add"
              element={<PLoanAdd />}
            />
            <Route
              path="/application/personal-loan/edit"
              element={<PLoanEdit />}
            />
            <Route path="/settings/document" element={<Document />} />
            <Route path="/settings/document-type" element={<DocumentType />} />
            <Route path="/settings/loan-type" element={<LoanType />} />
            <Route path="/settings/charges" element={<Charges />} />
            <Route path="/loans/active" element={<ActiveLoan />} />
            <Route path="/loans/delinquent" element={<DeliquentLoan />} />
            <Route path="/loans/closed" element={<ClosedLoan />} />
            <Route path="/loans/payment/:id" element={<LoanPayment />} />
            <Route path="/remark/details" element={<RemarkDetails />} />
            <Route path="/payments/history" element={<History />} />
            <Route path="/payments/upcoming" element={<Upcoming />} />
            <Route path="/payments/defaulter" element={<Defaulter />} />
            <Route
              path="/loans/application-view/:id"
              element={<ApplicationView />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
