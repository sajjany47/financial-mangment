/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../../component/Loader";
import { Field, Form, Formik } from "formik";
import {
  DateField,
  DropdownField,
  InputField,
} from "../../../component/FieldType";
import { city, countryList, state } from "../AddUser/AddUserService";
import { Button } from "primereact/button";

const LoanBasic = (props) => {
  const addUserData = useSelector((state) => state.addUser.addUser);
  const [loading, setLoading] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [getUserData, setGetUerData] = useState({});

  useEffect(() => {
    setLoading(true);
    countryList()
      .then((res) => {
        setCountryData(
          res.data.map((item) => ({ label: item.name, value: item.id }))
        );
        setGetUerData({});
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);
  const initialValues =
    addUserData.type === "edit"
      ? {
          loanAmount: getUserData.loanAmount,
          loanTenure: getUserData.loanTenure,
          name: getUserData.name,
          mobile: getUserData.mobile,
          email: getUserData.email,
          dob: new Date(getUserData.dob),
          state: Number(getUserData.state),
          country: Number(getUserData.country),
          city: Number(getUserData.city),
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
    console.log(values);
  };
  return (
    <>
      {loading && <Loader />}{" "}
      <Formik
        onSubmit={handelSubmit}
        initialValues={initialValues}
        enableReinitialize
      >
        {({ handleSubmit, setFieldValue, values }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex flex-column ">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <div className="grid p-3">
                  <div className="col-12 md:col-3">
                    <Field
                      label="Loan Amount"
                      component={InputField}
                      name="loanAmount"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Tenure (In months)"
                      component={InputField}
                      name="loanTenure"
                    />
                  </div>

                  <div className="col-12 md:col-3">
                    <Field label="Name" component={InputField} name="name" />
                  </div>

                  <div className="col-12 md:col-3">
                    <Field
                      label="Mobile"
                      component={InputField}
                      name="mobile"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field label="Email" component={InputField} name="email" />
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
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex pt-4 justify-content-end gap-2 mb-3">
              {addUserData.type === "edit" && (
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
                label={addUserData.type === "add" ? "Submit & Next" : "Update"}
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

export default LoanBasic;
