/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import Loader from "../../../../component/Loader";
import { personalLoanDocuments } from "../../../../shared/Config";
import {
  DropdownField,
  InputField,
  UploadField,
} from "../../../../component/FieldType";

const PLoanDocument = (props) => {
  const loanDetails = useSelector((state) => state.loan.addLoan);
  const [loading, setLoading] = useState(false);
  const [getLoanData, setLoanData] = useState({});

  useEffect(() => {
    setLoanData({});
    setLoading(false);
  }, []);

  const initialValues =
    loanDetails.type === "edit"
      ? {
          ID_Proof_documentType: getLoanData.IDProof.documentType,
          ID_Proof_documentNumber: getLoanData.IDProof.documentNumber,
          ID_Proof_documentImage: getLoanData.IDProof.documentImage,

          Address_Proof_documentType: getLoanData.addressProof.documentType,
          Address_Proof_documentNumber: getLoanData.addressProof.documentNumber,
          Address_Proof_documentImage: getLoanData.addressProof.documentImage,

          Income_Proof_documentType: getLoanData.incomeProof.documentType,
          Income_Proof_documentNumber: getLoanData.incomeProof.documentNumber,
          Income_Proof_documentImage: getLoanData.incomeProof.documentImage,

          Bank_Statements_documentType: getLoanData.bankStatement.documentType,
          Bank_Statements_documentNumber:
            getLoanData.bankStatement.documentNumber,
          Bank_Statements_documentImage:
            getLoanData.bankStatement.documentImage,

          Employment_Proof_documentType:
            getLoanData.employmentProof.documentType,
          Employment_Proof_documentNumber:
            getLoanData.employmentProof.documentNumber,
          Employment_Proof_documentImage:
            getLoanData.employmentProof.documentImage,
        }
      : {
          ID_Proof_documentType: "",
          ID_Proof_documentNumber: "",
          ID_Proof_documentImage: "",

          Address_Proof_documentType: "",
          Address_Proof_documentNumber: "",
          Address_Proof_documentImage: "",

          Income_Proof_documentType: "",
          Income_Proof_documentNumber: "",
          Income_Proof_documentImage: "",

          Bank_Statements_documentType: "",
          Bank_Statements_documentNumber: "",
          Bank_Statements_documentImage: "",

          Employment_Proof_documentType: "",
          Employment_Proof_documentNumber: "",
          Employment_Proof_documentImage: "",
        };

  const handelSubmit = (values) => {
    // props.next();
    console.log(values);
  };
  return (
    <>
      {loading && <Loader />}
      <Formik
        onSubmit={handelSubmit}
        initialValues={initialValues}
        enableReinitialize
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            {personalLoanDocuments.map((item, index) => {
              return (
                <Panel header={item.documentType} className="mt-2" key={index}>
                  <div className="flex flex-column ">
                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-start align-items-start font-medium">
                      <div className="grid p-3">
                        <div className="col-12 md:col-4">
                          <Field
                            label="Document Type"
                            component={DropdownField}
                            name={`${item.documentType.replace(
                              / /g,
                              "_"
                            )}_documentType`}
                            options={item.documentNameList}
                          />
                        </div>

                        <div className="col-12 md:col-4">
                          <Field
                            label="Document Number"
                            component={InputField}
                            name={`${item.documentType.replace(
                              / /g,
                              "_"
                            )}_documentNumber`}
                          />
                        </div>
                        <div className="col-12 md:col-12">
                          <Field
                            label="Document (Image or pdf)"
                            component={UploadField}
                            name={`${item.documentType.replace(
                              / /g,
                              "_"
                            )}_documentImage`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>
              );
            })}

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

export default PLoanDocument;
