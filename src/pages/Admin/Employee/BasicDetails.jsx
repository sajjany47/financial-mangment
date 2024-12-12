/* eslint-disable react/prop-types */
import { Field, Form, Formik } from "formik";
import {
  DateField,
  DropdownField,
  InputField,
  RadioField,
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
      Position.SUPER_ADMIN,
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

  branch: Yup.string().when("position", {
    is: (val) =>
      val !== Position.ADMIN &&
      val !== Position.SM &&
      val !== Position.CM &&
      val !== Position.SUPER_ADMIN,
    then: () => Yup.string().required("Branch is required"),
    otherwise: () => Yup.string().notRequired(),
  }),

  state: Yup.string().when("position", {
    is: (val) =>
      val !== Position.ADMIN &&
      val !== Position.SM &&
      val !== Position.CM &&
      val !== Position.SUPER_ADMIN,
    then: () => Yup.string().required("State is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  country: Yup.string().when("position", {
    is: (val) =>
      val !== Position.ADMIN &&
      val !== Position.SM &&
      val !== Position.CM &&
      val !== Position.SUPER_ADMIN,
    then: () => Yup.string().required("Country is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  city: Yup.string().when("position", {
    is: (val) =>
      val !== Position.ADMIN &&
      val !== Position.SM &&
      val !== Position.CM &&
      val !== Position.SUPER_ADMIN,
    then: () => Yup.string().required("City is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
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
    getBranchList({});
    if (addUserData.type === "edit") {
      getDetails(addUserData.id)
        .then((res) => {
          setGetUerData(res.data);
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
    addUserData.type === "edit"
      ? {
          name: getUserData.name,
          username: getUserData.username,
          mobile: getUserData.mobile,
          email: getUserData.email,
          dob: new Date(getUserData.dob),
          position: getUserData.position,
          state: getUserData?.state ? Number(getUserData.state) : "",
          country: getUserData?.country ? Number(getUserData.country) : "",
          city: getUserData?.city ? Number(getUserData.city) : "",
          branch: getUserData.branch,
          fresherOrExperience: getUserData.fresherOrExperience,
          userImage: getUserData.userImage,
          userImagePre: getUserData.userImageUrl,
        }
      : {
          name: "",
          username: "",
          mobile: "",
          email: "",
          dob: "",
          position: "",
          state: "",
          country: "",
          city: "",
          branch: "",
          userImage: "",
          userImagePre: "",
          fresherOrExperience: "",
        };

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

  const handelSate = (setFieldValue, e) => {
    setStateData([]);
    setCityData([]);
    setFieldValue("state", "");
    setFieldValue("city", "");
    setFieldValue("country", e);
    stateList(e);
  };

  const handelCityList = (setFieldValue, e, value) => {
    setCityData([]);
    setFieldValue("city", "");
    setFieldValue("state", e);
    cityList(value.country, e);
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
          getUserData.profileRatio <= 20 ? 20 : getUserData.profileRatio,
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
      userCreate({ ...values })
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

                  {values.position !== Position.ADMIN &&
                    values.position !== Position.SUPER_ADMIN &&
                    values.position !== "" && (
                      <>
                        <div className="col-12 md:col-3">
                          <Field
                            label="Country"
                            component={DropdownField}
                            name="country"
                            options={props.countryData.map((item) => ({
                              label: item.name,
                              value: item.id,
                            }))}
                            filter
                            onChange={(e) => {
                              setFieldValue("branch", "");
                              handelSate(setFieldValue, e.target.value);
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
                              handelCityList(
                                setFieldValue,
                                e.target.value,
                                values
                              );
                              getBranchList({
                                country: Number(values.country),
                                state: Number(e.target.value),
                              });
                            }}
                          />
                        </div>
                      </>
                    )}
                  {values.position !== Position.ADMIN &&
                    values.position !== Position.SUPER_ADMIN &&
                    values.position !== "" &&
                    values.position !== Position.SM && (
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
                              city: Number(e.target.value),
                            });
                          }}
                        />
                      </div>
                    )}

                  {values.position !== Position.ADMIN &&
                    values.position !== Position.SUPER_ADMIN &&
                    values.position !== "" &&
                    values.position !== Position.SM &&
                    values.position !== Position.CM && (
                      <div className="col-12 md:col-3">
                        <Field
                          label="Branch Name"
                          component={DropdownField}
                          name="branch"
                          filter
                          options={branch}
                        />
                      </div>
                    )}
                  <div className="col-12 md:col-4">
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
                  <div className="col-12 md:col-3 ">
                    <label
                      htmlFor="userImage"
                      className="block  font-medium mb-2 custom-file-upload"
                    >
                      <i className="pi pi-upload mr-2" /> User Profile Picture
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

export default BasicDetails;
