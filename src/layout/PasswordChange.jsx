import { Formik } from "formik";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const PasswordChange = () => {
  return (
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

        <Formik initialValues={{ password: "" }}></Formik>
        <div>
          <label htmlFor="email" className="block text-900 font-medium mb-2">
            Password
          </label>
          <InputText
            id="password"
            type="password"
            placeholder="Password"
            className="w-full mb-3"
            // onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="password" className="block text-900 font-medium mb-2">
            Confirm Password
          </label>
          <InputText
            id="password"
            type="password"
            placeholder="Password"
            className="w-full mb-3"
            // onChange={(e) => setPassword(e.target.value)}
          />

          <Button label="Sign In" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
