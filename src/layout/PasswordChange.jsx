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
      initialValues={{ password: "", confirmPassword: "" }}
      onSubmit={handelSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className="flex flex-column ">
            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
              <div className="grid p-3">
                <div className="col-12 md:col-12">
                  <Field
                    label="Password"
                    component={InputField}
                    name={"password"}
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
