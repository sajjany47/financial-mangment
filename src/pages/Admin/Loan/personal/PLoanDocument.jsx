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
import { applicationUpdateWithImage, getLoanDetails } from "../LoanService";
import Swal from "sweetalert2";
import * as Yup from "yup";
// import { Image } from "primereact/image";

const documentValidationSchema = Yup.object().shape({
  ID_Proof_documentType: Yup.string().required(
    "Id Proof Document type is required"
  ),
  ID_Proof_documentNumber: Yup.string().required(
    "Id Proof Document number is required"
  ),
  ID_Proof_documentImage: Yup.string().required(
    "Id Proof Document file is required"
  ),
  Address_Proof_documentType: Yup.string().required(
    "Address proof Document type is required"
  ),
  Address_Proof_documentNumber: Yup.string().required(
    "Address proof Document number is required"
  ),
  Address_Proof_documentImage: Yup.string().required(
    "Address proof Document file is required"
  ),
  Income_Proof_documentType: Yup.string().required(
    "Income proof Document type is required"
  ),
  Income_Proof_documentImage: Yup.string().required(
    "Income proof Document file is required"
  ),
  Bank_Statements_documentType: Yup.string().required(
    "Bank statement proof Document type is required"
  ),
  Bank_Statements_documentImage: Yup.string().required(
    "Bank statement proof Document file is required"
  ),
  Employment_Proof_documentType: Yup.string().required(
    "Employment proof Document type is required"
  ),
  Employment_Proof_documentImage: Yup.string().required(
    "Employment proof Document file is required"
  ),
});
const PLoanDocument = (props) => {
  const loanDetails = useSelector((state) => state.loan.addLoan);
  const [loading, setLoading] = useState(false);
  const [getLoanData, setLoanData] = useState({});

  useEffect(() => {
    if (loanDetails.type === "edit") {
      setLoading(true);
      getLoanDetails(loanDetails.loanId)
        .then((res) => {
          setLoanData(res.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          Income_Proof_documentImage: getLoanData.incomeProof.documentImage,

          Bank_Statements_documentType: getLoanData.bankStatement.documentType,
          Bank_Statements_documentImage:
            getLoanData.bankStatement.documentImage,

          Employment_Proof_documentType:
            getLoanData.employmentProof.documentType,
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
          Income_Proof_documentImage: "",
          Bank_Statements_documentType: "",
          Bank_Statements_documentImage: "",
          Employment_Proof_documentType: "",
          Employment_Proof_documentImage: "",
        };

  const handelSubmit = (values) => {
    let reqData = {
      IDProof: {
        documentType: values.ID_Proof_documentType,
        documentNumber: values.ID_Proof_documentNumber,
        documentImage: values.Address_Proof_documentImage,
      },
      addressProof: {
        documentType: values.Address_Proof_documentType,
        documentNumber: values.Address_Proof_documentNumber,
        documentImage: values.ID_Proof_documentImage,
      },
      incomeProof: {
        documentType: values.Income_Proof_documentType,
        documentImage: values.Income_Proof_documentImage,
      },
      bankStatement: {
        documentType: values.Bank_Statements_documentType,
        documentImage: values.Bank_Statements_documentImage,
      },
      employmentProof: {
        documentType: values.Employment_Proof_documentType,
        documentImage: values.Employment_Proof_documentImage,
      },
    };
    applicationUpdateWithImage({
      ...reqData,
      dataType: "document",
      id: getLoanData._id,
    })
      .then((res) => {
        setLoading(false);
        Swal.fire({
          title: res.message,
          icon: "success",
        });
        props.next();
      })
      .catch(() => {
        setLoading(false);
      });
  };
  return (
    <>
      {loading && <Loader />}
      <Formik
        onSubmit={handelSubmit}
        initialValues={initialValues}
        validationSchema={documentValidationSchema}
        enableReinitialize
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            {personalLoanDocuments.map((item, index) => {
              return (
                <Panel
                  header={`${item.documentType} (${item.description})`}
                  className="mt-2"
                  key={index}
                >
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

                        {item.documentType !== "Income Proof" &&
                          item.documentType !== "Bank Statements" &&
                          item.documentType !== "Employment Proof" && (
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
                          )}
                        <div className="col-12 md:col-8">
                          <Field
                            label="Document (Image or pdf)"
                            component={UploadField}
                            multiple
                            name={`${item.documentType.replace(
                              / /g,
                              "_"
                            )}_documentImage`}
                          />
                        </div>

                        {/* <div className="col-12 md:col-4 mt-4">
                          <Image
                            src="https://primefaces.org/cdn/primereact/images/galleria/galleria7.jpg"
                            alt="Image"
                            width="250"
                            height="170"
                          />
                        </div> */}
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
