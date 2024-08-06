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
import { userBasicUpdate, userCreate } from "./AddUserService";
import Swal from "sweetalert2";

const BasicDetails = (props) => {
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
      .max(
        new Date(Date.now() - 567648000000),
        "You must be at least 18 years"
      ),
    position: Yup.string().when("role", {
      is: (val) => val !== Position.CUSTOMER,
      then: () =>
        Yup.string()
          .oneOf([
            Position.ADMIN,
            Position.AM,
            Position.CD,
            Position.CDM,
            Position.CM,
            Position.CUSTOMER,
            Position.FM,
            Position.LD,
            Position.LM,
            Position.PM,
            Position.SM,
            Position.VD,
          ])
          .required("Position is required"),
      otherwise: () => Yup.string().notRequired(),
    }),
    jobBranchName: Yup.string()
      .when("position", {
        is: (val) => val !== Position.CUSTOMER,
        then: () => Yup.string().required("Branch is required"),
        otherwise: () => Yup.string().notRequired(),
      })
      .required("Branch is required"),
    address: Yup.string().required("Address is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    pincode: Yup.string()
      .matches(/^\d{6}$/, "Enter valid pincode")
      .required("Pincode is required"),
  });
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
    role: props.role,
    userImage: "",
    userImagePre: "",
  };
  const handelSubmit = (values) => {
    // eslint-disable-next-line react/prop-types
    if (props.type === "edit") {
      userBasicUpdate({ ...values })
        .then((res) => {
          Swal.fire({
            title: res.message,
            icon: "success",
          });
          props.next();
        })
        .catch(() => {});
    } else {
      userCreate(values).then((res) => {
        Swal.fire({
          title: res.message,
          icon: "success",
        });
      });
    }
  };

  return (
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
                  <Field label="Mobile" component={InputField} name="mobile" />
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
                {props.role !== Position.CUSTOMER && (
                  <div className="col-12 md:col-3">
                    <Field
                      label="Position"
                      component={DropdownField}
                      options={DropdownPosition}
                      name="position"
                    />
                  </div>
                )}

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
                    options={[]}
                  />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="State"
                    component={DropdownField}
                    name="state"
                    options={[]}
                  />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="City"
                    component={DropdownField}
                    name="city"
                    options={[]}
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
                    options={[]}
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
            {props.type === "edit" && (
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
              label={props.type === "add" ? "Submit & Next" : "Update"}
              icon="pi pi-arrow-right"
              iconPos="right"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BasicDetails;
