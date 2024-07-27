import { useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { userLogin } from "./UserService";
import { useDispatch } from "react-redux";
import { setUser } from "../store/reducer/UserReducer";
import { Field, Form, Formik } from "formik";
import { InputField } from "../component/FieldType";
import * as Yup from "yup";

const Login = () => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handelSubmit = (values) => {
    userLogin(values)
      .then((res) => {
        sessionStorage.setItem("token", res.data.accessToken);

        dispatch(
          setUser({
            data: res.data.data,
            acccessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={handelSubmit}
        validationSchema={validationSchema}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex align-items-center justify-content-center">
              <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
                <div className="text-center mb-5">
                  <img
                    src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1721898000&semt=sph"
                    alt="hyper"
                    height={50}
                    className="mb-3"
                  />
                  <div className="text-900 text-3xl font-medium mb-3">
                    Welcome Back
                  </div>
                  <span className="text-600 font-medium line-height-3">
                    {"Don't have an account?"}
                  </span>
                  <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
                    Create today!
                  </a>
                </div>

                <div>
                  <Field
                    label="Username"
                    component={InputField}
                    name={"username"}
                  />
                  <Field
                    label="Password"
                    component={InputField}
                    name={"password"}
                    type="password"
                  />

                  <div className="flex align-items-center justify-content-between mb-6">
                    <div className="flex align-items-center">
                      <Checkbox
                        id="rememberme"
                        onChange={(e) => setChecked(e.checked)}
                        checked={checked}
                        className="mr-2"
                      />
                      <label htmlFor="rememberme">Remember me</label>
                    </div>
                    <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                      Forgot your password?
                    </a>
                  </div>

                  <Button
                    label="Sign In"
                    className="w-full"
                    type="submit"
                    onClick={handelSubmit}
                  />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Login;
