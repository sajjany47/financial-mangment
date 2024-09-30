/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { city, countryList, state } from "../../AddUser/AddUserService";
import Loader from "../../../../component/Loader";
import {
  CheckField,
  DropdownField,
  InputField,
} from "../../../../component/FieldType";
import { ResidenceTypes } from "../../../../shared/Config";
import { applicationDetails, applicationUpdate } from "../LoanService";
import Swal from "sweetalert2";
import * as Yup from "yup";

const addressValidationSchema = Yup.object().shape({
  permanentHouseOrBuildingNumber: Yup.string().required(
    "House or Building or Block number is required"
  ),
  permanentStreet: Yup.string().required("Street or Village name is required"),
  permanentLandmark: Yup.string().required("Land mark is required"),
  permanentPincode: Yup.string().required("Pincode is required"),
  residenceType: Yup.string().required("Residence Type is required"),
  permanentState: Yup.string().required("State is required"),
  permanentCountry: Yup.string().required("Country is required"),
  permanentCity: Yup.string().required("City is required"),
  residenceHouseOrBuildingNumber: Yup.string().required(
    "House or Building or Block number is required"
  ),
  residenceStreet: Yup.string().required("Street or Village name is required"),
  residenceLandmark: Yup.string().required("Land mark is required"),
  residencePincode: Yup.string().required("Pincode is required"),
  residenceState: Yup.string().required("State is required"),
  residenceCountry: Yup.string().required("Country is required"),
  residenceCity: Yup.string().required("City is required"),
});
const PLoanAddress = (props) => {
  const loanDetails = useSelector((state) => state.loan.addLoan);
  const [loading, setLoading] = useState(false);
  const [getLoanData, setLoanData] = useState({});
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [resisdenceStateData, setResisdenceStateData] = useState([]);
  const [resisdenceCityData, setResisdenceCityData] = useState([]);

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
    if (loanDetails.type === "edit") {
      setLoading(true);
      applicationDetails(loanDetails.loanId)
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
          addressSame: getLoanData.addressSame,
          residenceType: getLoanData.residenceType,
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
          residenceType: "",
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

  const handelSubmit = (values) => {
    applicationUpdate({
      ...values,
      applicationType: "address",
      _id: getLoanData._id,
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

  const handelResisdence = (e, setFieldValue, values) => {
    setFieldValue("addressSame", e.checked);
    if (e.checked) {
      setFieldValue("residenceCountry", values.permanentCountry);
      setFieldValue("residenceState", values.permanentState);
      setFieldValue("residenceCity", values.permanentCity);
      setFieldValue(
        "residenceHouseOrBuildingNumber",
        values.permanentHouseOrBuildingNumber
      );
      setFieldValue("residenceStreet", values.permanentStreet);
      setFieldValue("residenceLandmark", values.permanentLandmark);
      setFieldValue("residencePincode", values.permanentPincode);
    }
  };
  return (
    <>
      {loading && <Loader />}{" "}
      <Formik
        onSubmit={handelSubmit}
        initialValues={initialValues}
        validationSchema={addressValidationSchema}
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
                        keyfilter="num"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Residence Type"
                        component={DropdownField}
                        name="residenceType"
                        options={ResidenceTypes}
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
                        onChange={(e) =>
                          handelResisdence(e, setFieldValue, values)
                        }
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Country"
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
                        label="House/Building/Block Number"
                        component={InputField}
                        name="residenceHouseOrBuildingNumber"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Street/Road/Village Name"
                        component={InputField}
                        name="residenceStreet"
                      />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        label="Landmark"
                        component={InputField}
                        name="residenceLandmark"
                      />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        label="Pincode"
                        component={InputField}
                        name="residencePincode"
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

export default PLoanAddress;
