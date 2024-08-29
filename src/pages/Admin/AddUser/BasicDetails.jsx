/* eslint-disable react/prop-types */
import { Field, Form, Formik } from "formik";
import {
  DateField,
  DropdownField,
  InputField,
  RadioField,
  TextAreaInputField,
} from "../../../component/FieldType";
import {
  DropdownPosition,
  fresherOrExperience,
  Position,
} from "../../../shared/Config";
import { Button } from "primereact/button";
import * as Yup from "yup";
import { ErrorMessage } from "./EducationDetails";
import { Image } from "primereact/image";
import {
  city,
  getDetails,
  state,
  userCreate,
  userUpdate,
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

  jobBranchName: Yup.string().required("Branch is required"),

  address: Yup.string().required("Address is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Enter valid pincode")
    .required("Pincode is required"),
});
const BasicDetails = (props) => {
  const dispatch = useDispatch();
  const addUserData = useSelector((state) => state.addUser.addUser);
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [branch, setBranch] = useState([]);
  const [getUserData, setGetUerData] = useState({});

  useEffect(() => {
    setLoading(true);
    getBranchList({});

    if (addUserData.type === "edit") {
      getDetails(addUserData.id)
        .then((res) => {
          setGetUerData(res.data);

          if (res) {
            const filterCountry = props.countryData.find(
              (item) => item.id === Number(res.data.country)
            );
            state(filterCountry.iso2)
              .then((item) => {
                setStateData(item.data);
                if (res) {
                  const filterState = item.data.find(
                    (item) => item.id === Number(res.data.state)
                  );
                  city(filterCountry.iso2, filterState.iso2)
                    .then((elm) => {
                      setCityData(elm.data);
                      setLoading(false);
                    })
                    .catch(() => {
                      setLoading(false);
                    });
                }
              })
              .catch(() => {
                setLoading(false);
              });
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const initialValues =
    addUserData.type === "edit"
      ? {
          name: getUserData.name,
          username: getUserData.username,
          mobile: getUserData.mobile,
          email: getUserData.email,
          dob: new Date(getUserData.dob),
          position: getUserData.position,
          address: getUserData.address,
          state: Number(getUserData.state),
          country: Number(getUserData.country),
          city: Number(getUserData.city),
          pincode: getUserData.pincode,
          jobBranchName: getUserData.jobBranchName,
          fresherOrExperience: getUserData.fresherOrExperience,
          userImage: getUserData.userImage,
          userImagePre: getUserData.userImage,
        }
      : {
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
          fresherOrExperience: "",
        };

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
    state(country)
      .then((res) => {
        setStateData(res.data);
      })
      .catch(() => {});
  };

  const cityList = (country, state) => {
    city(country, state)
      .then((res) => {
        setCityData(res.data);
      })
      .catch(() => {});
  };

  const handelSate = (setFieldValue, e) => {
    const filterCountry = props.countryData.find((item) => item.id === e.value);
    setFieldValue("state", "");
    setFieldValue("city", "");
    setFieldValue("country", e.value);
    stateList(filterCountry.iso2);
  };

  const handelCityList = (setFieldValue, e, value) => {
    const filterState = stateData.find((item) => item.id === e.value);
    const filterCountry = props.countryData.find((item) => item.id === value);
    setFieldValue("city", "");
    setFieldValue("state", e.value);
    cityList(filterState.iso2, filterCountry.iso2);
  };
  const handelSubmit = (values) => {
    setLoading(true);

    // eslint-disable-next-line react/prop-types
    if (addUserData.type === "edit") {
      userUpdate({
        ...values,
        dataType: "basic",
        id: getUserData._id,
        profileRatio:
          getUserData.profileRatio <= 30 ? 30 : getUserData.profileRatio,
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
      userCreate({ ...values, userImage: values.userImage.name })
        .then((res) => {
          dispatch(
            setAddUser({
              ...addUserData,
              id: res.data._id,
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
        validationSchema={adminSignUpSchema30}
        enableReinitialize
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
                      optionValue="id"
                      options={props.countryData}
                      filter
                      onChange={(e) => {
                        setFieldValue("jobBranchName", "");
                        handelSate(setFieldValue, e);
                        getBranchList({ country: e.value });
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
                      optionValue="id"
                      options={stateData}
                      onChange={(e) => {
                        setFieldValue("jobBranchName", "");
                        handelCityList(setFieldValue, e, values);
                        getBranchList({
                          country: values.country,
                          state: e.value,
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
                          country: values.country,
                          state: values.state,
                          city: e.value,
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

                  <div className="col-12 md:col-3 ">
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
                  <div className="col-12 md:col-3">
                    <Field
                      label="Fresher or Experience"
                      component={RadioField}
                      name={`fresherOrExperience`}
                      radiolist={[
                        {
                          label: "Experience",
                          value: fresherOrExperience.EXPERIENCE,
                          id: "1",
                        },
                        {
                          label: "Fresher",
                          value: fresherOrExperience.FRESHER,
                          id: "2",
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex pt-4 justify-content-end gap-2">
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

export default BasicDetails;
