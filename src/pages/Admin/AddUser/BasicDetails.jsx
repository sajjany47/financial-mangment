/* eslint-disable react/prop-types */
import { Field, Form, Formik } from "formik";
import {
  DateField,
  DropdownField,
  InputField,
  TextAreaInputField,
} from "../../../component/FieldType";
import { DropdownPosition } from "../../../shared/Config";
import { Button } from "primereact/button";

const BasicDetails = (props) => {
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
    // eslint-disable-next-line react/prop-types
    props.next();
    console.log(values);
  };

  return (
    <Formik onSubmit={handelSubmit} initialValues={initialValues}>
      {({ handleSubmit }) => (
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
