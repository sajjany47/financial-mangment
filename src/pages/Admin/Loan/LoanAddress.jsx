/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../../component/Loader";
import { Field, Form, Formik } from "formik";
import {
  CheckField,
  DropdownField,
  InputField,
} from "../../../component/FieldType";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { city, countryList, state } from "../AddUser/AddUserService";

const LoanAddress = (props) => {
  const loanDetails = useSelector((state) => state.loan.addLoan);
  const [loading, setLoading] = useState(false);
  const [getLoanData, setLoanData] = useState({});
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [resisdenceStateData, setResisdenceStateData] = useState([]);
  const [resisdenceCityData, setResisdenceCityData] = useState([]);
  const [workStateData, setWorkStateData] = useState([]);
  const [workCityData, setWorkCityData] = useState([]);

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

  const initialValues =
    loanDetails.type === "edit"
      ? {
          permanentHouseOrBuildingNumber:
            getLoanData.permanentHouseOrBuildingNumber,
          permanentStreet: getLoanData.permanentStreet,
          permanentLandmark: getLoanData.permanentLandmark,
          permanentPincode: getLoanData.permanentPincode,
          permanentState: Number(getLoanData.permanentState),
          permanentCountry: Number(getLoanData.permanentCountry),
          permanentCity: Number(getLoanData.permanentCity),
          residenceHouseOrBuildingNumber:
            getLoanData.residenceHouseOrBuildingNumber,
          residenceStreet: getLoanData.residenceStreet,
          residenceLandmark: getLoanData.residenceLandmark,
          residencePincode: getLoanData.residencePincode,
          residenceState: Number(getLoanData.residenceState),
          residenceCountry: Number(getLoanData.residenceCountry),
          residenceCity: Number(getLoanData.residenceCity),
          shopOrBuildingNumber: getLoanData.shopOrBuildingNumber,
          workStreet: getLoanData.workStreet,
          workLandmark: getLoanData.workLandmark,
          workPincode: getLoanData.workPincode,
          workState: Number(getLoanData.workState),
          workCountry: Number(getLoanData.workCountry),
          workCity: Number(getLoanData.workCity),
          addressSame: getLoanData.addressSame,
        }
      : {
          permanentHouseOrBuildingNumber: "",
          permanentStreet: "",
          permanentLandmark: "",
          permanentPincode: "",
          permanentState: "",
          permanentCountry: "",
          permanentCity: "",
          residenceHouseOrBuildingNumber: "",
          residenceStreet: "",
          residenceLandmark: "",
          residencePincode: "",
          residenceState: "",
          residenceCountry: "",
          residenceCity: "",
          shopOrBuildingNumber: "",
          workStreet: "",
          workLandmark: "",
          workPincode: "",
          workState: "",
          workCountry: "",
          workCity: "",
          addressSame: false,
        };

  const stateList = (country, value) => {
    state(Number(country))
      .then((res) => {
        const data = res.data.map((item) => ({
          ...item,
          label: item.name,
          value: item.id,
        }));
        if (value === "permanent") {
          setStateData(data);
        }
        if (value === "residence") {
          setResisdenceStateData(data);
        }
        if (value === "work") {
          setWorkStateData(data);
        }
      })
      .catch(() => {});
  };

  const cityList = (country, state, value) => {
    city(Number(country), Number(state))
      .then((res) => {
        const data = res.data.map((item) => ({
          ...item,
          label: item.name,
          value: item.id,
        }));
        if (value === "permanent") {
          setCityData(data);
        }
        if (value === "residence") {
          setResisdenceCityData(data);
        }
        if (value === "work") {
          setWorkCityData(data);
        }
      })
      .catch(() => {});
  };

  const handelPermanentCountry = (setFieldValue, e) => {
    setStateData([]);
    setCityData([]);
    setFieldValue("permanentState", "");
    setFieldValue("permanentCity", "");
    setFieldValue("permanentCountry", e);
    stateList(e, "permanent");
  };

  const handelPermanentState = (setFieldValue, e, value) => {
    setCityData([]);
    setFieldValue("permanentCity", "");
    setFieldValue("permanentState", e);

    cityList(value.permanentCountry, e, "permanent");
  };

  const handelResisdenceCountry = (setFieldValue, e) => {
    setResisdenceStateData([]);
    setResisdenceCityData([]);
    setFieldValue("residenceState", "");
    setFieldValue("residenceCity", "");
    setFieldValue("residenceCountry", e);
    stateList(e, "residence");
  };

  const handelResisdenceState = (setFieldValue, e, value) => {
    setResisdenceCityData([]);
    setFieldValue("residenceCity", "");
    setFieldValue("residenceState", e);
    cityList(value.residenceCountry, e, "residence");
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
            <Panel header="Permanent Address">
              <div className="flex flex-column ">
                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                  <div className="grid p-3">
                    <div className="col-12 md:col-4">
                      <Field
                        label="Country"
                        component={DropdownField}
                        name="permanentCountry"
                        options={countryData}
                        filter
                        onChange={(e) => {
                          handelPermanentCountry(setFieldValue, e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="State"
                        filter
                        component={DropdownField}
                        name="permanentState"
                        options={stateData}
                        onChange={(e) => {
                          handelPermanentState(
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
                        name="permanentCity"
                        filter
                        options={cityData}
                        onChange={(e) => {
                          setFieldValue("permanentCity", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="House/Building/Block Number"
                        component={InputField}
                        name="permanentHouseOrBuildingNumber"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Street/Road/Village Name"
                        component={InputField}
                        name="permanentStreet"
                      />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        label="Landmark"
                        component={InputField}
                        name="permanentLandmark"
                      />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        label="Pincode"
                        component={InputField}
                        name="permanentPincode"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel header="Residence Address" className="mt-2">
              <div className="flex flex-column ">
                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                  <div className="grid p-3">
                    <div className="col-12 md:col-12">
                      <Field
                        label="Residence address same as permanent address?"
                        component={CheckField}
                        name="addressSame"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Country"
                        value={
                          values.addressSame ? values.permanentCountry : ""
                        }
                        component={DropdownField}
                        name="residenceCountry"
                        options={countryData}
                        filter
                        onChange={(e) => {
                          handelResisdenceCountry(
                            setFieldValue,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="State"
                        filter
                        value={values.addressSame ? values.permanentState : ""}
                        component={DropdownField}
                        name="residenceState"
                        options={
                          values.addressSame ? stateData : resisdenceStateData
                        }
                        onChange={(e) => {
                          handelResisdenceState(
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
                        value={values.addressSame ? values.permanentCity : ""}
                        component={DropdownField}
                        name="residenceCity"
                        filter
                        options={
                          values.addressSame ? cityData : resisdenceCityData
                        }
                        onChange={(e) => {
                          setFieldValue("residenceCity", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        value={
                          values.addressSame
                            ? values.permanentHouseOrBuildingNumber
                            : ""
                        }
                        label="House/Building/Block Number"
                        component={InputField}
                        name="residenceHouseOrBuildingNumber"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        value={values.addressSame ? values.permanentStreet : ""}
                        label="Street/Road/Village Name"
                        component={InputField}
                        name="residenceStreet"
                      />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        value={
                          values.addressSame ? values.permanentLandmark : ""
                        }
                        label="Landmark"
                        component={InputField}
                        name="residenceLandmark"
                      />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        value={
                          values.addressSame ? values.permanentPincode : ""
                        }
                        label="Pincode"
                        component={InputField}
                        name="residencePincode"
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

export default LoanAddress;
