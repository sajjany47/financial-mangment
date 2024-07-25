import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { userLogin } from "./UserService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const handelSubmit = () => {
    userLogin({ username: username, password: password })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
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
            <label htmlFor="email" className="block text-900 font-medium mb-2">
              Username
            </label>
            <InputText
              id="email"
              placeholder="Enter Username"
              className="w-full mb-3"
              onChange={(e) => setUsername(e.target.value)}
            />

            <label
              htmlFor="password"
              className="block text-900 font-medium mb-2"
            >
              Password
            </label>
            <InputText
              id="password"
              type="password"
              placeholder="Password"
              className="w-full mb-3"
              onChange={(e) => setPassword(e.target.value)}
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

            <Button label="Sign In" className="w-full" onClick={handelSubmit} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
