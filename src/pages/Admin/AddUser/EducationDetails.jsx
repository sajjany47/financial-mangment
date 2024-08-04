/* eslint-disable react/prop-types */
import { Field, FieldArray, Form, Formik, getIn } from "formik";
import {
  DateField,
  InputField,
  RadioField,
} from "../../../component/FieldType";
import { Button } from "primereact/button";
import { fresherOrExperience } from "../../../shared/Config";
import { Image } from "primereact/image";
import * as Yup from "yup";

export const ErrorMessage = (errors, name, touched) => {
  return (
    Boolean(getIn(errors, name)) &&
    getIn(touched, name) && (
      <small className="text-red-400 mb-1">{getIn(errors, name)}</small>
    )
  );
};
const EducationDetails = (props) => {
  const educationOrCompanyDetailSchema = Yup.object().shape({
    education: Yup.array()
      .of(
        Yup.object().shape({
          boardName: Yup.string().required("Board name is required"),
          passingYear: Yup.string()
            .required("Passing year is required")
            .matches(/^\d{4}$/, "Enter a valid year"),
          marksPercentage: Yup.string()
            .required("Marks percentage is required")
            .matches(
              /^(100(\.0{1,2})?|(\d{1,2})(\.\d{1,2})?)$/,
              "Enter a valid percentage"
            ),
          resultImage: Yup.string().required("Marksheet is required"),
        })
      )
      .required("Education details are required")
      .min(1, "At least one education detail is required"),

    fresherOrExperience: Yup.string()
      .oneOf([fresherOrExperience.EXPERIENCE, fresherOrExperience.FRESHER])
      .required("Select one of these"),

    workDetail: Yup.array().when("fresherOrExperience", {
      is: (val) => val === fresherOrExperience.EXPERIENCE,
      then: Yup.array()
        .of(
          Yup.object().shape({
            companyName: Yup.string().required("Company name is required"),
            position: Yup.string().required("Position is required"),
            startingYear: Yup.string().required("Starting year is required"),
            // .matches(/^\d{4}$/, "Enter a valid year"),
            endingYear: Yup.string().required("Ending year is required"),
            // .matches(/^\d{4}$/, "Enter a valid year"),
            experienceLetter: Yup.string().required(
              "Experience Letter is required"
            ),
            relievingLetter: Yup.string().required(
              "Relieving Letter is required"
            ),
            appointmentLetter: Yup.string().required(
              "Appointment Letter is required"
            ),
            salarySlip: Yup.string().required("Salary Slip is required"),
          })
        )
        .required("Work details are required")
        .min(1, "At least one work detail is required"),
      otherwise: () => Yup.array().notRequired(),
    }),
  });
  const initialValues = {
    id: "1",
    education: [
      {
        boardName: "",
        passingYear: "",
        marksPercentage: "",
        resultImage: "",
        imagePreview: "",
      },
    ],
    fresherOrExperience: "",
    workDetail: [
      {
        companyName: "",
        position: "",
        startingYear: "",
        endingYear: "",
        experienceLetter: "",
        relievingLetter: "",
        appointmentLetter: "",
        salarySlip: "",
        experiencePreview: "",
        relievingPreview: "",
        appointmentPreview: "",
        slarySlipPreview: "",
      },
    ],
  };
  const handelSubmit = (values) => {
    console.log(values);
    props.next();
  };

  return (
    <Formik
      onSubmit={handelSubmit}
      initialValues={initialValues}
      validationSchema={educationOrCompanyDetailSchema}
    >
      {({ handleSubmit, values, setFieldValue, touched, errors }) => (
        <Form onSubmit={handleSubmit}>
          <div className="flex flex-column">
            <div className="border-2 border-dashed surface-border border-round surface-ground font-medium">
              <div className="grid p-3">
                <div className="col-12 md:col-12">
                  <FieldArray
                    name="education"
                    render={(arrayHelpers) => (
                      <>
                        {values.education &&
                          values.education.map((item, index) => (
                            <div
                              className="flex gap-2 align-item-center"
                              key={index}
                            >
                              <div className="grid w-full">
                                <div className="col-12 md:col-3">
                                  <Field
                                    label="Board Name"
                                    component={InputField}
                                    name={`education.${index}.boardName`}
                                  />
                                </div>
                                <div className="col-12 md:col-3">
                                  <Field
                                    label="Passing Year"
                                    component={InputField}
                                    name={`education.${index}.passingYear`}
                                  />
                                </div>
                                <div className="col-12 md:col-3">
                                  <Field
                                    label="Marks (%)"
                                    component={InputField}
                                    name={`education.${index}.marksPercentage`}
                                  />
                                </div>
                                <div className="col-12 md:col-3 mt-4">
                                  <label
                                    htmlFor={`education.${index}.resultImage`}
                                    className="block  font-medium mb-2 custom-file-upload"
                                  >
                                    Upload Marksheet Image
                                  </label>
                                  <input
                                    id={`education.${index}.resultImage`}
                                    name={`education.${index}.resultImage`}
                                    type="file"
                                    onChange={(e) => {
                                      setFieldValue(
                                        `education.${index}.resultImage`,
                                        e.target.files[0]
                                      );
                                      setFieldValue(
                                        `education.${index}.imagePreview`,
                                        URL.createObjectURL(e.target.files[0])
                                      );
                                    }}
                                  />
                                  {ErrorMessage(
                                    errors,
                                    `education.${index}.resultImage`,
                                    touched
                                  )}
                                </div>
                                <div className="col-12 md:col-3">
                                  <Image
                                    src={values.education[index].imagePreview}
                                    alt="Image"
                                    width="180"
                                    height="180"
                                  />
                                </div>
                              </div>

                              <div>
                                <Button
                                  icon="pi pi-times"
                                  type="button"
                                  rounded
                                  className="mt-4"
                                  text
                                  onClick={() => arrayHelpers.remove(index)}
                                  severity="danger"
                                  aria-label="Cancel"
                                  raised
                                />
                              </div>
                            </div>
                          ))}
                        <div className="col-12">
                          <Button
                            className="px-8"
                            label="Add"
                            type="button"
                            onClick={() =>
                              arrayHelpers.push({
                                boardName: "",
                                selectClass: "",
                                marks: "",
                                passingYear: "",
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                  />
                </div>
                <div className="col-12">
                  <Field
                    label="Fresher or Experience"
                    component={RadioField}
                    name={`fresherOrExperience`}
                    radiolist={[
                      {
                        label: "Experience",
                        value: fresherOrExperience.EXPERIENCE,
                        id: "1",
                      },
                      {
                        label: "Fresher",
                        value: fresherOrExperience.FRESHER,
                        id: "2",
                      },
                    ]}
                  />
                </div>
                {values.fresherOrExperience ===
                  fresherOrExperience.EXPERIENCE && (
                  <FieldArray
                    name="workDetail"
                    render={(arrayHelpers) => (
                      <>
                        {values.workDetail &&
                          values.workDetail.map((item, index) => (
                            <div
                              className="col-12 flex gap-2 align-item-center"
                              key={index}
                            >
                              <div className="grid w-full">
                                <div className="col-12 md:col-3">
                                  <Field
                                    label="Institute Name"
                                    component={InputField}
                                    name={`workDetail.${index}.companyName`}
                                  />
                                </div>
                                <div className="col-12 md:col-3">
                                  <Field
                                    label="Position"
                                    component={InputField}
                                    name={`workDetail.${index}.position`}
                                  />
                                </div>
                                <div className="col-12 md:col-3">
                                  <Field
                                    label="Starting Year"
                                    component={DateField}
                                    name={`workDetail.${index}.startingYear`}
                                  />
                                </div>
                                <div className="col-12 md:col-3">
                                  <Field
                                    label="Ending Year"
                                    component={DateField}
                                    name={`workDetail.${index}.endingYear`}
                                  />
                                </div>

                                <div className="col-12 md:col-3">
                                  <label
                                    htmlFor={`workDetail.${index}.appointmentLetter`}
                                    className="block  font-medium mb-2 custom-file-upload"
                                  >
                                    Upload Appointment Letter
                                  </label>
                                  <input
                                    id={`workDetail.${index}.appointmentLetter`}
                                    name={`workDetail.${index}.appointmentLetter`}
                                    type="file"
                                    onChange={(e) => {
                                      setFieldValue(
                                        `workDetail.${index}.appointmentLetter`,
                                        e.target.files[0]
                                      );
                                      setFieldValue(
                                        `workDetail.${index}.appointmentPreview`,
                                        URL.createObjectURL(e.target.files[0])
                                      );
                                    }}
                                  />
                                  {ErrorMessage(
                                    errors,
                                    `workDetail.${index}.appointmentLetter`,
                                    touched
                                  )}
                                  <Image
                                    src={
                                      values.workDetail[index]
                                        .appointmentPreview
                                    }
                                    alt="Image"
                                    width="180"
                                    height="180"
                                  />
                                </div>
                                <div className="col-12 md:col-3">
                                  <label
                                    htmlFor={`workDetail.${index}.salarySlip`}
                                    className="block  font-medium mb-2 custom-file-upload"
                                  >
                                    Latest Salary Slip
                                  </label>
                                  <input
                                    id={`workDetail.${index}.salarySlip`}
                                    name={`workDetail.${index}.salarySlip`}
                                    type="file"
                                    onChange={(e) => {
                                      setFieldValue(
                                        `workDetail.${index}.salarySlip`,
                                        e.target.files[0]
                                      );
                                      setFieldValue(
                                        `workDetail.${index}.slarySlipPreview`,
                                        URL.createObjectURL(e.target.files[0])
                                      );
                                    }}
                                  />
                                  {ErrorMessage(
                                    errors,
                                    `workDetail.${index}.salarySlip`,
                                    touched
                                  )}
                                  <Image
                                    src={
                                      values.workDetail[index].slarySlipPreview
                                    }
                                    alt="Image"
                                    width="180"
                                    height="180"
                                  />
                                </div>
                                <div className="col-12 md:col-3">
                                  <label
                                    htmlFor={`workDetail.${index}.experienceLetter`}
                                    className="block  font-medium mb-2 custom-file-upload"
                                  >
                                    Upload Experience Letter
                                  </label>
                                  <input
                                    id={`workDetail.${index}.experienceLetter`}
                                    name={`workDetail.${index}.experienceLetter`}
                                    type="file"
                                    onChange={(e) => {
                                      setFieldValue(
                                        `workDetail.${index}.experienceLetter`,
                                        e.target.files[0]
                                      );
                                      setFieldValue(
                                        `workDetail.${index}.experiencePreview`,
                                        URL.createObjectURL(e.target.files[0])
                                      );
                                    }}
                                  />
                                  {ErrorMessage(
                                    errors,
                                    `workDetail.${index}.experienceLetter`,
                                    touched
                                  )}
                                  <Image
                                    src={
                                      values.workDetail[index].experiencePreview
                                    }
                                    alt="Image"
                                    width="180"
                                    height="180"
                                  />
                                </div>
                                <div className="col-12 md:col-3">
                                  <label
                                    htmlFor={`workDetail.${index}.relievingLetter`}
                                    className="block  font-medium mb-2 custom-file-upload"
                                  >
                                    Upload Relieving Letter
                                  </label>
                                  <input
                                    id={`workDetail.${index}.relievingLetter`}
                                    name={`workDetail.${index}.relievingLetter`}
                                    type="file"
                                    onChange={(e) => {
                                      setFieldValue(
                                        `workDetail.${index}.relievingLetter`,
                                        e.target.files[0]
                                      );
                                      setFieldValue(
                                        `workDetail.${index}.relievingPreview`,
                                        URL.createObjectURL(e.target.files[0])
                                      );
                                    }}
                                  />
                                  {ErrorMessage(
                                    errors,
                                    `workDetail.${index}.relievingLetter`,
                                    touched
                                  )}
                                  <Image
                                    src={
                                      values.workDetail[index].relievingPreview
                                    }
                                    alt="Image"
                                    width="180"
                                    height="180"
                                  />
                                </div>
                              </div>
                              <Button
                                icon="pi pi-times"
                                type="button"
                                className="mt-4"
                                rounded
                                text
                                onClick={() => arrayHelpers.remove(index)}
                                severity="danger"
                                aria-label="Cancel"
                                raised
                              />
                            </div>
                          ))}
                        <div className="col-12">
                          <Button
                            className="px-8"
                            type="button"
                            label="Add"
                            onClick={() =>
                              arrayHelpers.push({
                                institutionName: "",
                                position: "",
                                startingYear: "",
                                endingYear: "",
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                  />
                )}
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

export default EducationDetails;
