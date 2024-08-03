import { Field, FieldArray, Form, Formik } from "formik";
import { InputField, RadioField } from "../../../component/FieldType";
import { Button } from "primereact/button";
import { fresherOrExperience } from "../../../shared/Config";

const EducationDetails = () => {
  const initialValues = {
    education: [{ boardName: "", passingYear: "", marksPercentage: "" }],
    fresherOrExperience: "",
    workDetail: [
      { companyName: "", position: "", startingYear: "", endingYear: "" },
    ],
  };
  const handelSubmit = (values) => {
    console.log(values);
  };
  return (
    <div className="p-3">
      <Formik onSubmit={handelSubmit} initialValues={initialValues}>
        {({ handelSubmit, values }) => (
          <Form onSubmit={handelSubmit}>
            <div className="grid">
              <div className="col-12 md:col-12">
                <FieldArray
                  name="education"
                  render={(arrayHelpers) => (
                    <>
                      {values.education &&
                        values.education.map((item, index) => (
                          <div className="grid " key={index}>
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
                            <div className="col-12 md:col-3">
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
                <div className="col-12">
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
                                    component={InputField}
                                    name={`workDetail.${index}.startingYear`}
                                  />
                                </div>
                                <div className="col-12 md:col-3">
                                  <Field
                                    label="Ending Year"
                                    component={InputField}
                                    name={`workDetail.${index}.endingYear`}
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
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EducationDetails;
