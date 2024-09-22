/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { city, countryList, state } from "../../AddUser/AddUserService";
import Loader from "../../../../component/Loader";
import {
  DateField,
  DropdownField,
  InputField,
} from "../../../../component/FieldType";
import {
  applicationCreate,
  applicationUpdate,
  getLoanDetails,
} from "../LoanService";
import { branchList } from "../../Branch/BranchService";
import Swal from "sweetalert2";
import { setAddLoan } from "../../../../store/reducer/AddLoanReducer";
import * as Yup from "yup";
import { LoanTypes } from "../../../../shared/Config";

const basicValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  loanAmount: Yup.string().required("Loan amount is required"),
  loanTenure: Yup.string().required("Loan tenure is required"),
  mobile: Yup.string().required("Mobile number is required"),
  email: Yup.string().required("Email is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(Date.now() - 567648000000), "You must be at least 18 years"),
  branch: Yup.string().required("Branch is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  loanType: Yup.string().required("Loan type is required"),
});
const PLoanBasic = (props) => {
  const dispatch = useDispatch();
  const loanDetails = useSelector((state) => state.loan.addLoan);
  const [loading, setLoading] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [branch, setBranch] = useState([]);
  const [getLoanData, setLoanData] = useState({});

  useEffect(() => {
    setLoading(true);
    countryList()
      .then((res) => {
        setCountryData(
          res.data.map((item) => ({ label: item.name, value: item.id }))
        );
        setLoanData({});
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    getBranchList({});
    if (loanDetails.type === "edit") {
      getLoanDetails(loanDetails.loanId)
        .then((res) => {
          setLoanData(res.data);
          Promise.all([
            stateList(Number(res.data.country)),
            cityList(Number(res.data.country), Number(res.data.state)),
          ]);

          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getBranchList = (payload) => {
    setLoading(true);
    branchList(payload)
      .then((res) => {
        setBranch(
          res.data.map((item) => ({
            label: `${item.name} (${item.code})`,
            value: item._id,
          }))
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const initialValues =
    loanDetails.type === "edit"
      ? {
          loanAmount: getLoanData.loanAmount,
          loanTenure: getLoanData.loanTenure,
          name: getLoanData.name,
          mobile: getLoanData.mobile,
          email: getLoanData.email,
          dob: new Date(getLoanData.dob),
          state: Number(getLoanData.state),
          country: Number(getLoanData.country),
          city: Number(getLoanData.city),
          branch: getLoanData.branch,
          loanType: getLoanData.loanType,
        }
      : {
          loanAmount: "",
          loanTenure: "",
          name: "",
          mobile: "",
          email: "",
          dob: "",
          state: "",
          country: "",
          city: "",
          branch: "",
          loanType: loanDetails.loanType.value,
        };

  const stateList = (country) => {
    state(Number(country))
      .then((res) => {
        setStateData(
          res.data.map((item) => ({
            ...item,
            label: item.name,
            value: item.id,
          }))
        );
      })
      .catch(() => {});
  };

  const cityList = (country, state) => {
    city(Number(country), Number(state))
      .then((res) => {
        setCityData(
          res.data.map((item) => ({ label: item.name, value: item.id }))
        );
      })
      .catch(() => {});
  };

  const handelCountry = (setFieldValue, e) => {
    setStateData([]);
    setCityData([]);
    setFieldValue("state", "");
    setFieldValue("city", "");
    setFieldValue("country", e);
    stateList(e);
  };

  const handelState = (setFieldValue, e, value) => {
    setCityData([]);
    setFieldValue("city", "");
    setFieldValue("state", e);
    cityList(value.country, e);
  };
  const handelSubmit = (values) => {
    setLoading(true);

    // eslint-disable-next-line react/prop-types
    if (loanDetails.type === "edit") {
      applicationUpdate({
        ...values,
        dataType: "basic",
        id: getLoanData._id,
      })
        .then((res) => {
          setLoading(false);
          Swal.fire({
            title: res.message,
            icon: "success",
          });
          props.next();
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      applicationCreate({ ...values, userImage: values.userImage.name })
        .then((res) => {
          dispatch(
            setAddLoan({
              ...loanDetails,
              loanId: res.data._id,
              data: res.data,
            })
          );
          setLoading(false);
          Swal.fire({
            title: res.message,
            icon: "success",
          });
          props.next();
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  return (
    <>
      {loading && <Loader />}{" "}
      <Formik
        onSubmit={handelSubmit}
        initialValues={initialValues}
        validationSchema={basicValidationSchema}
        enableReinitialize
      >
        {({ handleSubmit, setFieldValue, values }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex flex-column ">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <div className="grid p-3">
                  <div className="col-12 md:col-3">
                    <Field
                      label="Loan Type"
                      component={DropdownField}
                      name="loanType"
                      options={LoanTypes}
                      disabled
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Loan Amount"
                      component={InputField}
                      name="loanAmount"
                      keyfilter="money"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Tenure (In months)"
                      component={InputField}
                      name="loanTenure"
                      keyfilter="num"
                    />
                  </div>

                  <div className="col-12 md:col-3">
                    <Field
                      label="Name"
                      component={InputField}
                      name="name"
                      keyfilter="alpha"
                    />
                  </div>

                  <div className="col-12 md:col-3">
                    <Field
                      label="Mobile"
                      component={InputField}
                      name="mobile"
                      keyfilter="num"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Email"
                      component={InputField}
                      name="email"
                      keyfilter="email"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Date Of Birth"
                      component={DateField}
                      name="dob"
                    />
                  </div>

                  <div className="col-12 md:col-3">
                    <Field
                      label="Country"
                      component={DropdownField}
                      name="country"
                      options={countryData}
                      filter
                      onChange={(e) => {
                        setFieldValue("branch", "");
                        handelCountry(setFieldValue, e.target.value);
                        getBranchList({ country: e.target.value });
                      }}
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="State"
                      filter
                      component={DropdownField}
                      name="state"
                      options={stateData}
                      onChange={(e) => {
                        setFieldValue("branch", "");
                        handelState(setFieldValue, e.target.value, values);
                        getBranchList({
                          country: Number(values.country),
                          state: Number(e.target.value),
                        });
                      }}
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="City"
                      component={DropdownField}
                      name="city"
                      filter
                      options={cityData}
                      onChange={(e) => {
                        setFieldValue("branch", "");
                        setFieldValue("city", e.target.value);
                        getBranchList({
                          country: Number(values.country),
                          state: Number(values.state),
                          city: Number(e.targte.value),
                        });
                      }}
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Branch Name"
                      component={DropdownField}
                      name="branch"
                      filter
                      options={branch}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex pt-4 justify-content-end gap-2 mb-3">
              {loanDetails.type === "edit" && (
                <Button
                  type="button"
                  label={"Next"}
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => props.next()}
                />
              )}
              <Button
                type="submit"
                label={loanDetails.type === "add" ? "Submit & Next" : "Update"}
                icon="pi pi-arrow-right"
                iconPos="right"
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PLoanBasic;
