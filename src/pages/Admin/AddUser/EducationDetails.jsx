import { Field, FieldArray, Form, Formik } from "formik";
import { InputField } from "../../../component/FieldType";
import { Button } from "primereact/button";

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
                          <div
                            className="flex col-12 gap-2 align-item-center"
                            key={index}
                          >
                            <div className="grid ">
                              <div className="col-12 md:col-4">
                                <Field
                                  label="Board Name"
                                  component={InputField}
                                  name={`education.${index}.boardName`}
                                />
                              </div>
                              <div className="col-12 md:col-4">
                                <Field
                                  label="Passing Year"
                                  component={InputField}
                                  name={`education.${index}.passingYear`}
                                />
                              </div>
                              <div className="col-12 md:col-4">
                                <Field
                                  label="Marks (%)"
                                  component={InputField}
                                  name={`education.${index}.marksPercentage`}
                                />
                              </div>
                            </div>

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
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EducationDetails;
