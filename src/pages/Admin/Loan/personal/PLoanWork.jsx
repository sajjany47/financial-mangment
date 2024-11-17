/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import Loader from "../../../../component/Loader";
import { DropdownField, InputField } from "../../../../component/FieldType";
import { Panel } from "primereact/panel";
import { EmployeeTypes } from "../../../../shared/Config";
import { applicationDetails, applicationUpdate } from "../LoanService";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { city, countryList, state } from "../../Employee/AddUserService";

const workValidationSchema = Yup.object().shape({
  companyOrBussinessName: Yup.string().required(
    "Company or Business is required"
  ),
  jobTitle: Yup.string().required("Job title is required"),
  employmentType: Yup.string().required("Employment type is required"),
  yearsOfExperience: Yup.string().required("Year of experience is required"),
  monthlyIncome: Yup.string().required("Monthly income is required"),
  shopOrBuildingNumber: Yup.string().required(
    "Shop or Building or Block number is required"
  ),
  workStreet: Yup.string().required("Street or Village name is required"),
  workLandmark: Yup.string().required("Land mark is required"),
  workPincode: Yup.string().required("Pincode is required"),
  workState: Yup.string().required("State is required"),
  workCountry: Yup.string().required("Country is required"),
  workCity: Yup.string().required("City is required"),
});

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

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    // if (loanDetails.type === "edit") {
    setLoading(true);
    applicationDetails(loanDetails.loanId)
      .then((res) => {
        setLoanData(res.data);
        if (res?.data?.workCountry && res?.data?.workState) {
          stateList(Number(res?.data?.workCountry));
          cityList(
            Number(res?.data?.workCountry),
            Number(res?.data?.workState)
          );
        }

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    applicationUpdate({
      ...values,
      applicationType: "work",
      _id: loanDetails.loanId,
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
  };
  return (
    <>
      {loading && <Loader />}{" "}
      <Formik
        onSubmit={handelSubmit}
        initialValues={initialValues}
        validationSchema={workValidationSchema}
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
                        options={EmployeeTypes}
                      />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        label="Year of Experience (In months)"
                        component={InputField}
                        name="yearsOfExperience"
                        keyfilter="num"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Net Monthly Income"
                        component={InputField}
                        name="monthlyIncome"
                        keyfilter="money"
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
                        keyfilter="num"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
            <div className="flex pt-4 justify-content-end gap-2 mb-3">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                // eslint-disable-next-line react/prop-types
                onClick={() => props.back()}
                type="button"
              />
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
