/* eslint-disable react/prop-types */
import { Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAddLoan } from "../../../../store/reducer/AddLoanReducer";
import Loader from "../../../../component/Loader";
import { InputField } from "../../../../component/FieldType";
import { findIFSC } from "../../AddUser/AddUserService";
import { applicationUpdate, getLoanDetails } from "../LoanService";

const PLoanAccount = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loanDetails = useSelector((state) => state.loan.addLoan);
  const [loading, setLoading] = useState(false);
  const [getLoanData, setLoanData] = useState({});
  const accountValidationSchema = Yup.object().shape({
    bankName: Yup.string().required("Bank name is required"),
    accountNumber: Yup.string().required("Account number is required"),
    bankBranchName: Yup.string().required("Branch name is required"),
    ifsc: Yup.string().required("IFSC code is required"),
    accountName: Yup.string().required("Account name is required"),
  });

  useEffect(() => {
    if (loanDetails.type === "edit") {
      setLoading(true);
      getLoanDetails(loanDetails.loanId)
        .then((res) => {
          setLoanData(res.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const initialValues =
    loanDetails.type === "add"
      ? {
          accountNumber: "",
          bankName: "",
          bankBranchName: "",
          ifsc: "",
          accountName: "",
        }
      : {
          bankName: getLoanData.bankName ? getLoanData.bankName : "",
          accountNumber: getLoanData.accountNumber
            ? getLoanData.accountNumber
            : "",
          bankBranchName: getLoanData.bankBranchName
            ? getLoanData.bankBranchName
            : "",
          ifsc: getLoanData.ifsc ? getLoanData.ifsc : "",
          accountName: getLoanData.accountName ? getLoanData.accountName : "",
        };

  const handelSubmit = (values) => {
    setLoading(true);

    applicationUpdate({
      ...values,
      applicationType: "account",
      _id: getLoanData._id,
    })
      .then((res) => {
        setLoading(false);
        Swal.fire({
          title: res.message,
          icon: "success",
        });
        dispatch(setAddLoan({ type: "", loanType: {}, loanId: "", data: {} }));
        navigate("/applications/list");
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handelIfsc = (e, setFieldValue) => {
    setFieldValue("ifsc", e.target.value.toUpperCase());
    if (e.target.value.length === 11) {
      setLoading(true);
      findIFSC(e.target.value)
        .then((res) => {
          const data = res.data;

          setFieldValue("bankName", data.BANK);
          setFieldValue("bankBranchName", data.BRANCH);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  return (
    <>
      {loading && <Loader />}
      <Formik
        onSubmit={handelSubmit}
        initialValues={initialValues}
        validationSchema={accountValidationSchema}
        enableReinitialize
      >
        {({ handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex flex-column">
              <div className="border-2 border-dashed surface-border border-round surface-ground  font-medium">
                <div className="grid p-3">
                  <div className="col-12 md:col-3">
                    <Field
                      label="IFSC Code"
                      component={InputField}
                      name="ifsc"
                      onChange={(e) => handelIfsc(e, setFieldValue)}
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Bank Name"
                      component={InputField}
                      name="bankName"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Branch Name"
                      component={InputField}
                      name="bankBranchName"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Account Number"
                      component={InputField}
                      name="accountNumber"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Account Name"
                      component={InputField}
                      name="accountName"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex pt-4 justify-content-between">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => props.back()}
                type="button"
              />
              <Button label="Submit" type="submit" />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PLoanAccount;
