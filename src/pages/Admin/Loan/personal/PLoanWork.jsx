/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import Loader from "../../../../component/Loader";
import { DropdownField, InputField } from "../../../../component/FieldType";
import { Panel } from "primereact/panel";
import { city, countryList, state } from "../../AddUser/AddUserService";

const PLoanWork = (props) => {
  const loanDetails = useSelector((state) => state.loan.addLoan);
  const [loading, setLoading] = useState(false);
  const [getLoanData, setLoanData] = useState({});
  const [workStateData, setWorkStateData] = useState([]);
  const [workCityData, setWorkCityData] = useState([]);
  const [countryData, setCountryData] = useState([]);

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
  }, []);

  const stateList = (country) => {
    state(Number(country))
      .then((res) => {
        setWorkStateData(
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
        setWorkCityData(
          res.data.map((item) => ({ label: item.name, value: item.id }))
        );
      })
      .catch(() => {});
  };

  const initialValues =
    loanDetails.type === "edit"
      ? {
          companyOrBussinessName: getLoanData.companyOrBussinessName,
          jobTitle: getLoanData.jobTitle,
          employmentType: getLoanData.employmentType,
          yearsOfExperience: getLoanData.yearsOfExperience,
          monthlyIncome: getLoanData.monthlyIncome,
          shopOrBuildingNumber: getLoanData.shopOrBuildingNumber,
          workStreet: getLoanData.workStreet,
          workLandmark: getLoanData.workLandmark,
          workPincode: getLoanData.workPincode,
          workState: Number(getLoanData.workState),
          workCountry: Number(getLoanData.workCountry),
          workCity: Number(getLoanData.workCity),
        }
      : {
          companyOrBussinessName: "",
          jobTitle: "",
          employmentType: "",
          yearsOfExperience: "",
          monthlyIncome: "",
          shopOrBuildingNumber: "",
          workStreet: "",
          workLandmark: "",
          workPincode: "",
          workState: "",
          workCountry: "",
          workCity: "",
        };

  const handelWorkCountry = (setFieldValue, e) => {
    setWorkCityData([]);
    setWorkStateData([]);
    setFieldValue("workState", "");
    setFieldValue("workCity", "");
    setFieldValue("workCountry", e);
    stateList(e, "work");
  };

  const handelWorkState = (setFieldValue, e, value) => {
    setWorkCityData([]);
    setFieldValue("workCity", "");
    setFieldValue("workState", e);
    cityList(value.workCountry, e, "work");
  };

  const handelSubmit = (values) => {
    props.next();
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
            <Panel header="Work Detail" className="mt-2">
              <div className="flex flex-column ">
                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                  <div className="grid p-3">
                    <div className="col-12 md:col-4">
                      <Field
                        label="Company/Bussiness Name"
                        component={InputField}
                        name="companyOrBussinessName"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="JobTitle"
                        component={InputField}
                        name="jobTitle"
                      />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        label="Type"
                        component={DropdownField}
                        name="employmentType"
                        options={[]}
                      />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        label="Year of Experience"
                        component={InputField}
                        name="yearsOfExperience"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Monthly Income"
                        component={InputField}
                        name="monthlyIncome"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel header="Work Address" className="mt-2">
              <div className="flex flex-column ">
                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                  <div className="grid p-3">
                    <div className="col-12 md:col-4">
                      <Field
                        label="Country"
                        component={DropdownField}
                        name="workCountry"
                        options={countryData}
                        filter
                        onChange={(e) => {
                          handelWorkCountry(setFieldValue, e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="State"
                        filter
                        component={DropdownField}
                        name="workState"
                        options={workStateData}
                        onChange={(e) => {
                          handelWorkState(
                            setFieldValue,
                            e.target.value,
                            values
                          );
                        }}
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="City"
                        component={DropdownField}
                        name="workCity"
                        filter
                        options={workCityData}
                        onChange={(e) => {
                          setFieldValue("workCity", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="House/Building/Block Number"
                        component={InputField}
                        name="shopOrBuildingNumber"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Street/Road/Village Name"
                        component={InputField}
                        name="workStreet"
                      />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        label="Landmark"
                        component={InputField}
                        name="workLandmark"
                      />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        label="Pincode"
                        component={InputField}
                        name="workPincode"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
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

export default PLoanWork;
