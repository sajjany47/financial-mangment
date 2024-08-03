import { Field, Form, Formik } from "formik";
import { InputField } from "../../../component/FieldType";
import { useState } from "react";
import { Image } from "primereact/image";

const DocumentDetails = () => {
  const [aadharImagePre, setAadharImagePre] = useState("");
  const [panImagePre, setPanImagePre] = useState("");
  const [voterImagePre, setVoterImagePre] = useState("");
  const [passportImagePre, setPassportImagePre] = useState("");
  const initialValues = {
    aadharNumber: "",
    voterNumber: "",
    panNumber: "",
    passportNumber: "",
    passportImage: "",
    voterImage: "",
    panImage: "",
    aadharImage: "",
  };
  const handelSubmit = (values) => {
    console.log(values);
  };
  return (
    <div className="p-3">
      <Formik onSubmit={handelSubmit} initialValues={initialValues}>
        {({ handelSubmit, setFieldValue }) => (
          <Form onSubmit={handelSubmit}>
            <div className="grid">
              <div className="col-12 md:col-3">
                <Field
                  label="Aadhar Number"
                  component={InputField}
                  name="aadharNumber"
                />
              </div>
              <div className="col-12 md:col-3">
                <Field
                  label="Voter Number"
                  component={InputField}
                  name="voterNumber"
                />
              </div>

              <div className="col-12 md:col-3">
                <Field
                  label="Pan Number"
                  component={InputField}
                  name="panNumber"
                />
              </div>
              <div className="col-12 md:col-3">
                <Field
                  label="Passport Number"
                  component={InputField}
                  name="passportNumber"
                />
              </div>
              <div className="col-12 md:col-3">
                <label
                  htmlFor="aadharImage-upload"
                  className="block  font-medium mb-2 custom-file-upload"
                >
                  Upload Aadhar Image
                </label>
                <input
                  id="aadharImage-upload"
                  name="aadharImage"
                  type="file"
                  onChange={(e) => {
                    setFieldValue("aadharImage", e.target.files[0]);
                    setAadharImagePre(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                <Image
                  src={aadharImagePre}
                  alt="Image"
                  width="260"
                  height="260"
                />
              </div>
              <div className="col-12 md:col-3">
                <label
                  htmlFor="panImage-upload"
                  className="block  font-medium mb-2 custom-file-upload"
                >
                  Upload Pan Image
                </label>
                <input
                  id="panImage-upload"
                  name="panImage"
                  type="file"
                  onChange={(e) => {
                    setFieldValue("panImage", e.target.files[0]);
                    setPanImagePre(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                <Image src={panImagePre} alt="Image" width="260" height="260" />
              </div>
              <div className="col-12 md:col-3">
                <label
                  htmlFor="voterImage-upload"
                  className="block  font-medium mb-2 custom-file-upload"
                >
                  Upload Voter Image
                </label>
                <input
                  id="voterImage-upload"
                  name="voterImage"
                  type="file"
                  onChange={(e) => {
                    setFieldValue("voterImage", e.target.files[0]);
                    setVoterImagePre(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                <Image
                  src={voterImagePre}
                  alt="Image"
                  width="260"
                  height="260"
                />
              </div>
              <div className="col-12 md:col-3">
                <label
                  htmlFor="passportImage-upload"
                  className="block  font-medium mb-2 custom-file-upload"
                >
                  Upload Passport Image
                </label>
                <input
                  id="passportImage-upload"
                  name="passportImage"
                  type="file"
                  onChange={(e) => {
                    setFieldValue("passportImage", e.target.files[0]);
                    setPassportImagePre(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                <Image
                  src={passportImagePre}
                  alt="Image"
                  width="260"
                  height="260"
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DocumentDetails;
