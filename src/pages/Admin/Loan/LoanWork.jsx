/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../../component/Loader";
import { Field, Form, Formik } from "formik";
import { DropdownField, InputField } from "../../../component/FieldType";
import { Button } from "primereact/button";

const LoanWork = (props) => {
  const loanDetails = useSelector((state) => state.loan.addLoan);
  const [loading, setLoading] = useState(false);
  const [getLoanData, setLoanData] = useState({});

  useEffect(() => {
    setLoading(false);
    setLoanData({});
  }, []);

  const initialValues =
    loanDetails.type === "edit"
      ? {
          companyOrBussinessName: getLoanData.companyOrBussinessName,
          jobTitle: getLoanData.jobTitle,
          employmentType: getLoanData.employmentType,
          yearsOfExperience: getLoanData.yearsOfExperience,
          monthlyIncome: getLoanData.monthlyIncome,
        }
      : {
          companyOrBussinessName: "",
          jobTitle: "",
          employmentType: "",
          yearsOfExperience: "",
          monthlyIncome: "",
        };

  const handelSubmit = (values) => {
    props.next();
    console.log(values);
  };
  return (
    <>
      {loading && <Loader />}{" "}
      <Formik
        onSubmit={handelSubmit}
        initialValues={initialValues}
        enableReinitialize
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex flex-column ">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <div className="grid p-3">
                  <div className="col-12 md:col-3">
                    <Field
                      label="Company/Bussiness Name"
                      component={InputField}
                      name="companyOrBussinessName"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="JobTitle"
                      component={InputField}
                      name="jobTitle"
                    />
                  </div>

                  <div className="col-12 md:col-3">
                    <Field
                      label="Type"
                      component={DropdownField}
                      name="employmentType"
                      options={[]}
                    />
                  </div>

                  <div className="col-12 md:col-3">
                    <Field
                      label="Year of Experience"
                      component={InputField}
                      name="yearsOfExperience"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Monthly Income"
                      component={InputField}
                      name="monthlyIncome"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex pt-4 justify-content-end gap-2 mb-3">
              {loanDetails.type === "edit" && (
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
                label={loanDetails.type === "add" ? "Submit & Next" : "Update"}
                icon="pi pi-arrow-right"
                iconPos="right"
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoanWork;
