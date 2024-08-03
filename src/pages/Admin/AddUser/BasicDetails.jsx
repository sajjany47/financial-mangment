import { Field, Form, Formik } from "formik";
import {
  DateField,
  DropdownField,
  InputField,
  TextAreaInputField,
} from "../../../component/FieldType";
import { DropdownPosition } from "../../../shared/Config";

const BasicDetails = () => {
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
  };
  const handelSubmit = (values) => {
    console.log(values);
  };

  return (
    <div className="p-3">
      <Formik onSubmit={handelSubmit} initialValues={initialValues}>
        {({ handelSubmit }) => (
          <Form onSubmit={handelSubmit}>
            <div className="grid">
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
                <Field label="Date Of Birth" component={DateField} name="dob" />
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
                <Field label="Pincode" component={InputField} name="pincode" />
              </div>
              <div className="col-12 md:col-3">
                <Field
                  label="Branch Name"
                  component={DropdownField}
                  name="jobBranchName"
                  options={[]}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BasicDetails;
