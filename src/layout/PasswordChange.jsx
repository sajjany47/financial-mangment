import { Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { InputField } from "../component/FieldType";

const PasswordChange = () => {
  const handelSubmit = (values) => {
    console.log(values);
  };
  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      onSubmit={handelSubmit}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className="flex align-items-center justify-content-center">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-3">
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
