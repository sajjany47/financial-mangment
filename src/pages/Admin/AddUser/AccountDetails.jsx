import { Field, Form, Formik } from "formik";
import { InputField } from "../../../component/FieldType";
import { FileUpload } from "primereact/fileupload";

const AccountDetails = () => {
  const initialValues = {
    accountNumber: "",
    bankName: "",
    branchName: "",
    ifsc: "",
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
              <div className="col-12">
                <label className="block text-900 font-medium mb-2">
                  Bank Passbook or statement{" "}
                </label>
                <FileUpload
                  name="demo[]"
                  url={"/api/upload"}
                  multiple
                  accept="image/*"
                  maxFileSize={1000000}
                  emptyTemplate={
                    <p className="m-0">
                      Drag and drop files to here to upload.
                    </p>
                  }
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AccountDetails;
