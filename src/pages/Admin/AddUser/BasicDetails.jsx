/* eslint-disable react/prop-types */
import { Field, Form, Formik } from "formik";
import {
  DateField,
  DropdownField,
  InputField,
  TextAreaInputField,
} from "../../../component/FieldType";
import { DropdownPosition, Position } from "../../../shared/Config";
import { Button } from "primereact/button";
import * as Yup from "yup";
import { ErrorMessage } from "./EducationDetails";
import { Image } from "primereact/image";
import {
  city,
  countryList,
  state,
  userBasicUpdate,
  userCreate,
} from "./AddUserService";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { branchList } from "../Branch/BranchService";
import Loader from "../../../component/Loader";
import { setAddUser } from "../../../store/reducer/AddUserReducer";

const adminSignUpSchema30 = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  name: Yup.string().required("Name is required"),
  userImage: Yup.string().required("User Profile Picture is required"),
  mobile: Yup.string().required("Mobile number is required"),
  email: Yup.string()
    // .matches("/S+@S+.S+/", "Please enter valid email")
    .required("Email is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(Date.now() - 567648000000), "You must be at least 18 years"),
  position: Yup.string()
    .oneOf([
      Position.ADMIN,
      Position.AM,
      Position.CD,
      Position.CDM,
      Position.CM,
      Position.FM,
      Position.LD,
      Position.LM,
      Position.PM,
      Position.SM,
      Position.VD,
      Position.BM,
    ])
    .required("Position is required"),

  jobBranchName: Yup.object().required("Branch is required"),

  address: Yup.string().required("Address is required"),
  state: Yup.object().required("State is required"),
  country: Yup.object().required("Country is required"),
  city: Yup.object().required("City is required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Enter valid pincode")
    .required("Pincode is required"),
});
const BasicDetails = (props) => {
  const dispatch = useDispatch();
  const searchKey = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [branch, setBranch] = useState([]);
  const initialValues = {
    name: "",
    username: "",
    mobile: "",
    email: "",
    dob: "",
    position: "",
    address: "",
    state: "",
    country: "",
    city: "",
    pincode: "",
    jobBranchName: "",
    userImage: "",
    userImagePre: "",
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([countryList(), getBranchList({})])
      .then((res) => {
        setCountryData(res[0].data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getBranchList = (payload) => {
    setLoading(true);
    branchList(payload)
      .then((res) => {
        setBranch(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const stateList = (country) => {
    state({ country: country })
      .then((res) => {
        setStateData(res.data);
      })
      .catch(() => {});
  };

  const cityList = (country, state) => {
    city({ country: country, state: state })
      .then((res) => {
        setCityData(res.data);
      })
      .catch(() => {});
  };

  const handelSate = (setFieldValue, e) => {
    setFieldValue("state", "");
    setFieldValue("city", "");
    setFieldValue("country", e.value);
    stateList(e.value.iso2);
  };

  const handelCityList = (setFieldValue, e, value) => {
    setFieldValue("city", "");
    setFieldValue("state", e.value);
    cityList(value.country.iso2, e.value.iso2);
  };
  const handelSubmit = (values) => {
    setLoading(true);
    const reqData = {
      ...values,
      city: values.city.id,
      country: values.country.id,
      state: values.state.id,
      jobBranchName: values.jobBranchName._id,
    };

    // eslint-disable-next-line react/prop-types
    if (searchKey.addUser.addUser.type === "edit") {
      userBasicUpdate({ ...values })
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
      console.log({ ...reqData, userImage: values.userImage.name });
      userCreate({ ...reqData, userImage: "values.userImage.name" })
        .then((res) => {
          dispatch(
            setAddUser({
              ...searchKey.addUser.addUser,
              id: res.data._id,
              data: res.data,
            })
          );
          setLoading(false);
          Swal.fire({
            title: res.message,
            icon: "success",
          });
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
        validationSchema={adminSignUpSchema30}
      >
        {({ handleSubmit, setFieldValue, errors, touched, values }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex flex-column ">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <div className="grid p-3">
                  <div className="col-12 md:col-3">
                    <Field label="Name" component={InputField} name="name" />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Username"
                      component={InputField}
                      name="username"
                    />
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
                      label="Position"
                      component={DropdownField}
                      options={DropdownPosition}
                      name="position"
                    />
                  </div>

                  <div className="col-12 md:col-3">
                    <Field
                      label="Address"
                      component={TextAreaInputField}
                      name="address"
                      rows={2}
                      cols={10}
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Country"
                      component={DropdownField}
                      name="country"
                      optionLabel="name"
                      optionValue="iso2"
                      options={countryData}
                      filter
                      onChange={(e) => {
                        setFieldValue("jobBranchName", "");
                        handelSate(setFieldValue, e);
                        getBranchList({ country: e.value.id });
                      }}
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="State"
                      filter
                      component={DropdownField}
                      name="state"
                      optionLabel="name"
                      optionValue="iso2"
                      options={stateData}
                      onChange={(e) => {
                        setFieldValue("jobBranchName", "");
                        handelCityList(setFieldValue, e, values);
                        getBranchList({
                          country: values.country.id,
                          state: e.value.id,
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
                      optionLabel="name"
                      optionValue="id"
                      onChange={(e) => {
                        setFieldValue("jobBranchName", "");
                        setFieldValue("city", e.value);
                        getBranchList({
                          country: values.country.id,
                          state: values.state.id,
                          city: e.value.id,
                        });
                      }}
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Pincode"
                      component={InputField}
                      name="pincode"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Branch Name"
                      component={DropdownField}
                      name="jobBranchName"
                      filter
                      options={branch}
                      optionLabel={"name"}
                      optionValue={"_id"}
                    />
                  </div>
                  <div className="col-12 md:col-3 mt-4">
                    <label
                      htmlFor="userImage"
                      className="block  font-medium mb-2 custom-file-upload"
                    >
                      Upload User Profile Picture
                    </label>
                    <input
                      id="userImage"
                      name="userImage"
                      type="file"
                      onChange={(e) => {
                        setFieldValue("userImage", e.target.files[0]);
                        setFieldValue(
                          "userImagePre",
                          URL.createObjectURL(e.target.files[0])
                        );
                      }}
                    />
                    {ErrorMessage(errors, `userImage`, touched)}
                    <Image
                      src={values.userImagePre}
                      alt="Image"
                      width="260"
                      height="260"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex pt-4 justify-content-end gap-2">
              {searchKey.addUser.addUser.type === "edit" && (
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
                label={
                  searchKey.addUser.addUser.type === "add"
                    ? "Submit & Next"
                    : "Update"
                }
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

export default BasicDetails;
