/* eslint-disable react/prop-types */
import { Field, Form, Formik } from "formik";
import { InputField } from "../../../component/FieldType";
import { Image } from "primereact/image";
import { Button } from "primereact/button";

const DocumentDetails = (props) => {
  const initialValues = {
    aadharNumber: "",
    voterNumber: "",
    panNumber: "",
    passportNumber: "",
    passportImage: "",
    voterImage: "",
    panImage: "",
    aadharImage: "",
    aadharImagePre: "",
    panImagePre: "",
    voterImagePre: "",
    passportImagePre: "",
  };
  const handelSubmit = (values) => {
    console.log(values);
    props.next();
  };
  return (
    <Formik onSubmit={handelSubmit} initialValues={initialValues}>
      {({ handleSubmit, setFieldValue, values }) => (
        <Form onSubmit={handleSubmit}>
          <div className="flex flex-column">
            <div className="border-2 border-dashed surface-border border-round surface-ground font-medium">
              <div className="grid p-3">
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
                      setFieldValue(
                        "aadharImagePre",
                        URL.createObjectURL(e.target.files[0])
                      );
                    }}
                  />
                  <Image
                    src={values.aadharImagePre}
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
                      setFieldValue(
                        "panImagePre",
                        URL.createObjectURL(e.target.files[0])
                      );
                    }}
                  />
                  <Image
                    src={values.panImagePre}
                    alt="Image"
                    width="260"
                    height="260"
                  />
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
                      setFieldValue(
                        "voterImagePre",
                        URL.createObjectURL(e.target.files[0])
                      );
                    }}
                  />
                  <Image
                    src={values.voterImagePre}
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
                      setFieldValue(
                        "passportImagePre",
                        URL.createObjectURL(e.target.files[0])
                      );
                    }}
                  />
                  <Image
                    src={values.passportImagePre}
                    alt="Image"
                    width="260"
                    height="260"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex pt-4 justify-content-between">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              // eslint-disable-next-line react/prop-types
              onClick={() => props.back()}
              type="button"
            />
            <div className="flex  justify-content-end gap-2">
              {props.type === "edit" && (
                <Button
                  label="Next"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => props.next()}
                  type="button"
                />
              )}

              <Button
                label={props.type === "add" ? "Submit & Next" : "Update"}
                icon="pi pi-arrow-right"
                iconPos="right"
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DocumentDetails;
