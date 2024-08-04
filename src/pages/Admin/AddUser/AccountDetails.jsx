import { Field, Form, Formik } from "formik";
import { InputField } from "../../../component/FieldType";
import { Image } from "primereact/image";

const AccountDetails = () => {
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
  };
  const handelSubmit = (values) => {
    console.log(values);
  };
  return (
    <div className="p-3">
      <Formik onSubmit={handelSubmit} initialValues={initialValues}>
        {({ handelSubmit, setFieldValue, values }) => (
          <Form onSubmit={handelSubmit}>
            <div className="grid">
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
                      name="aadharImage"
                      type="file"
                      onChange={(e) => {
                        setFieldValue("uan", e.target.files[0]);
                        setFieldValue(
                          "uanImage",
                          URL.createObjectURL(e.target.files[0])
                        );
                      }}
                    />
                    <Image
                      src={values.uanImage}
                      alt="Image"
                      width="260"
                      height="260"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AccountDetails;
