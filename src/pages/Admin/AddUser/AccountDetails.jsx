/* eslint-disable react/prop-types */
import { Field, Form, Formik } from "formik";
import { InputField } from "../../../component/FieldType";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import * as Yup from "yup";
import { ErrorMessage } from "./EducationDetails";

const AccountDetails = (props) => {
  const accountDetailSchema = Yup.object().shape({
    bankName: Yup.string().required("Bank name is required"),
    accountNumber: Yup.string().required("Account number is required"),
    // .matches("/^d{9,18}$/", "Enter valid Account number"),
    branchName: Yup.string().required("Branch name is required"),
    ifsc: Yup.string().required("IFSC code is required"),
    passbookImage: Yup.string().required(
      "Passbook Front Page image is required"
    ),
    uanImage: Yup.string().when("uan", {
      is: (val) => val !== "" && val !== undefined,
      then: () => Yup.string().required("UAN image is required"),
    }),
  });
  const initialValues = {
    accountNumber: "",
    bankName: "",
    branchName: "",
    ifsc: "",
    uan: "",
    passbookImage: "",
    uanImage: "",
    passbookPreview: "",
    uanPreview: "",
    id: 1,
  };
  const handelSubmit = (values) => {
    console.log(values);
  };
  return (
    <Formik
      onSubmit={handelSubmit}
      initialValues={initialValues}
      validationSchema={accountDetailSchema}
    >
      {({ handleSubmit, setFieldValue, values, touched, errors }) => (
        <Form onSubmit={handleSubmit}>
          <div className="flex flex-column">
            <div className="border-2 border-dashed surface-border border-round surface-ground  font-medium">
              <div className="grid p-3">
                <div className="col-12 md:col-3">
                  <Field label="IFSC Code" component={InputField} name="ifsc" />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="Bank Name"
                    component={InputField}
                    name="bankName"
                  />
                </div>
                <div className="col-12 md:col-3">
                  <Field
                    label="Account Number"
                    component={InputField}
                    name="accountNumber"
                  />
                </div>

                <div className="col-12 md:col-3">
                  <Field
                    label="Branch Name"
                    component={InputField}
                    name="branchName"
                  />
                </div>
                <div className="col-12 md:col-3">
                  <Field label="UAN (EPFO)" component={InputField} name="uan" />
                </div>
                <div className="col-12">
                  <div className="grid">
                    <div className="col-12 md:col-3">
                      <label
                        htmlFor="passbookImage"
                        className="block  font-medium mb-2 custom-file-upload"
                      >
                        Bank Passbook or statement{" "}
                      </label>
                      <input
                        id="passbookImage"
                        name="passbookImage"
                        type="file"
                        onChange={(e) => {
                          setFieldValue("passbookImage", e.target.files[0]);
                          setFieldValue(
                            "passbookPreview",
                            URL.createObjectURL(e.target.files[0])
                          );
                        }}
                      />
                      {ErrorMessage(errors, `passbookImage`, touched)}
                      <Image
                        src={values.passbookPreview}
                        alt="Image"
                        width="260"
                        height="260"
                      />
                    </div>
                    <div className="col-12 md:col-3">
                      <label
                        htmlFor="uan-upload"
                        className="block  font-medium mb-2 custom-file-upload"
                      >
                        Upload UAN (EPFO) Image{" "}
                      </label>
                      <input
                        id="uan-upload"
                        name="uanImage"
                        type="file"
                        onChange={(e) => {
                          setFieldValue("uanImage", e.target.files[0]);
                          setFieldValue(
                            "uanImagePreviw",
                            URL.createObjectURL(e.target.files[0])
                          );
                        }}
                      />
                      {ErrorMessage(errors, `uanImage`, touched)}
                      <Image
                        src={values.uanImagePreviw}
                        alt="Image"
                        width="260"
                        height="260"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex pt-4 justify-content-between">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => props.back()}
              type="button"
            />
            <Button label="Submit" type="submit" />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AccountDetails;
