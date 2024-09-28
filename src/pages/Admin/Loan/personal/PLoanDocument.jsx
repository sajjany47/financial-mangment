/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import Loader from "../../../../component/Loader";
import {
  DropdownField,
  InputField,
  UploadField,
} from "../../../../component/FieldType";
import { applicationUpdateWithImage, getLoanDetails } from "../LoanService";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { documentGetList } from "../../setting/SettingService";
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
  const [personalLoanDocuments, setPersonalLoanDocuments] = useState([]);

  useEffect(() => {
    setLoading(false);
    documentGetList({
      country: loanDetails.loanType.country,
      loanTypeId: loanDetails.loanType._id,
    })
      .then((res) => {
        setPersonalLoanDocuments(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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
          id_proof_documentType: getLoanData.IDProof.documentType,
          id_proof_documentNumber: getLoanData.IDProof.documentNumber,
          id_proof_documentImage: getLoanData.IDProof.documentImage,

          address_proof_documentType: getLoanData.addressProof.documentType,
          address_proof_documentNumber: getLoanData.addressProof.documentNumber,
          address_proof_documentImage: getLoanData.addressProof.documentImage,

          income_proof_documentType: getLoanData.incomeProof.documentType,
          income_proof_documentImage: getLoanData.incomeProof.documentImage,

          bank_statements_documentType: getLoanData.bankStatement.documentType,
          bank_statements_documentImage:
            getLoanData.bankStatement.documentImage,

          employment_proof_documentType:
            getLoanData.employmentProof.documentType,
          employment_proof_documentImage:
            getLoanData.employmentProof.documentImage,
        }
      : {
          id_proof_documentType: "",
          id_proof_documentNumber: "",
          id_proof_documentImage: "",
          address_proof_documentType: "",
          address_proof_documentNumber: "",
          address_proof_documentImage: "",
          income_proof_documentType: "",
          income_proof_documentImage: "",
          bank_statements_documentType: "",
          bank_statements_documentImage: "",
          employment_proof_documentType: "",
          employment_proof_documentImage: "",
        };

  const handelSubmit = (values) => {
    const reqData = {
      applicationType: "document",
      IDProof: {
        documentType: values.id_proof_documentType,
        documentNumber: values.id_proof_documentNumber,
        documentImage: values.id_proof_documentImage,
      },
      addressProof: {
        documentType: values.address_proof_documentType,
        documentNumber: values.address_proof_documentNumber,
        documentImage: values.address_proof_documentImage,
      },
      incomeProof: {
        documentType: values.income_proof_documentType,
        documentImage: values.income_proof_documentImage,
      },
      bankStatement: {
        documentType: values.bank_statements_documentType,
        documentImage: values.bank_statements_documentImage,
      },
      employmentProof: {
        documentType: values.employment_proof_documentType,
        documentImage: values.employment_proof_documentImage,
      },
    };
    applicationUpdateWithImage({
      ...reqData,
      dataType: "document",
      _id: getLoanData._id,
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

  const onTemplateSelect = (e) => {
    let files = e.files;

    console.log(files);
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
                            name={`${item.entity}_documentType`}
                            options={item.document.map((item) => ({
                              ...item,
                              label: item.name,
                              value: item.value,
                            }))}
                          />
                        </div>

                        {item.entity !== "income_proof" &&
                          item.entity !== "bank_statements" &&
                          item.entity !== "employment_proof" && (
                            <div className="col-12 md:col-4">
                              <Field
                                label="Document Number"
                                component={InputField}
                                name={`${item.entity}_documentNumber`}
                              />
                            </div>
                          )}
                        <div className="col-12 md:col-12">
                          <Field
                            label="Document (Image or pdf)"
                            component={UploadField}
                            multiple
                            name={`${item.entity}_documentImage`}
                            onSelect={onTemplateSelect}
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
