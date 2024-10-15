/* eslint-disable react/prop-types */
import { Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { InputField } from "../component/FieldType";
import { userPasswordReset } from "./UserService";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const PasswordChange = (props) => {
  const userDetails = useSelector((state) => state.user.user);
  const validationSchema = Yup.object({
    oldPassword: Yup.string().when("type", {
      is: (val) => val === "user",
      then: () => Yup.string().required("Old Password is required"),
      otherwise: () => Yup.string().notRequired(),
    }),

    newpassword: Yup.string().required("Password is required"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("newpassword"), null],
      "password must match"
    ),
  });
  const handelSubmit = (values) => {
    const reqData =
      props.type === "employee"
        ? {
            password: values.newpassword,
            id: props.id,
            type: props.type,
          }
        : {
            oldPassword: values.oldPassword,
            password: values.newpassword,
            id: userDetails.data._id,
            type: props.type,
          };
    userPasswordReset(reqData)
      .then((res) => {
        Swal.fire({
          title: res.message,
          icon: "success",
        });
        props.dislogeClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Formik
      initialValues={{
        type: props.type,
        oldPassword: "",
        newpassword: "",
        confirmPassword: "",
      }}
      onSubmit={handelSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className="flex flex-column ">
            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
              <div className="grid p-3">
                {props.type === "user" && (
                  <div className="col-12 md:col-12">
                    <Field
                      label="Old Password"
                      component={InputField}
                      name={"oldPassword"}
                      type="password"
                    />
                  </div>
                )}

                <div className="col-12 md:col-12">
                  <Field
                    label="New Password"
                    component={InputField}
                    name={"newpassword"}
                    type="password"
                  />
                </div>
                <div className="col-12 md:col-12">
                  <Field
                    label="Confirm Password"
                    component={InputField}
                    name={"confirmPassword"}
                    type="password"
                  />
                </div>
                <div className="col-12 md:col-12">
                  <Button label="Reset Password" className="w-full mt-2" />
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PasswordChange;
