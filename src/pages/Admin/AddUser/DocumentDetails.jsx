/* eslint-disable react/prop-types */
import { Field, Form, Formik } from "formik";
import { InputField } from "../../../component/FieldType";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import * as Yup from "yup";
import { ErrorMessage } from "./EducationDetails";

const DocumentDetails = (props) => {
  const documentsSchema = Yup.object().shape({
    aadharNumber: Yup.string().required("Aadhar number is required"),
    // .matches("^d{12}$", "Enter valid Aadhar number"),
    voterNumber: Yup.string().required("Voter number is required"),
    // .matches("/^[A-Z]{3}d{7}$/", "Enter valid voter number"),
    panNumber: Yup.string().required("Pan number is required"),
    // .matches("/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/", "Enter valid pan number"),
    passportNumber: Yup.string(),
    // .required("Passport number is required")
    // .matches("/^[A-Z]{1}[0-9]{7}$/", "Enter valid Passport number"),
    aadharImage: Yup.string().required("Aadhar Image is required"),
    voterImage: Yup.string().required("Voter Image is required"),
    panImage: Yup.string().required("Pan Image is required"),
    passportImage: Yup.string().when("passportNumber", {
      is: (val) => val !== "" && val !== undefined, // Check if passportNumber is not empty
      then: () => Yup.string().required("Passport Image is required"),
      otherwise: () => Yup.string().notRequired(),
    }),
  });
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
    <Formik
      onSubmit={handelSubmit}
      initialValues={initialValues}
      validationSchema={documentsSchema}
    >
      {({ handleSubmit, setFieldValue, values, touched, errors }) => (
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
                  {ErrorMessage(errors, `aadharImage`, touched)}
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
                  {ErrorMessage(errors, `panImage`, touched)}
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
                  {ErrorMessage(errors, `voterImage`, touched)}
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
                  {ErrorMessage(errors, `passportImage`, touched)}
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
                type="submit"
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DocumentDetails;
