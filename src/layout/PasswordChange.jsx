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
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "password must match"
    ),
  });
  const handelSubmit = (values) => {
    const reqData = {
      password: values.password,
      id: props.type === "user" ? userDetails.data._id : props.id,
    };
    userPasswordReset(reqData).then((res) => {
      Swal.fire({
        title: res.message,
        icon: "success",
      });
      props.dislogeClose();
    });
    // .catch((error) => {
    //   Swal.fire({
    //     title: error.message,
    //     icon: "error",
    //   });
    // });
  };
  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      onSubmit={handelSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className="flex align-items-center justify-content-center">
            <div className="surface-card p-3 border-round w-full lg:w-6">
              <div className="text-center mb-5">
                <img
                  src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1721898000&semt=sph"
                  alt="hyper"
                  height={50}
                  className="mb-3"
                />
                <div className="text-900 text-3xl font-medium mb-3">
                  Reset Password
                </div>
              </div>
              <Field
                label="Password"
                component={InputField}
                name={"password"}
                type="password"
              />
              <Field
                label="Confirm Password"
                component={InputField}
                name={"confirmPassword"}
                type="password"
              />
              <Button label="Sign In" className="w-full" />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PasswordChange;
