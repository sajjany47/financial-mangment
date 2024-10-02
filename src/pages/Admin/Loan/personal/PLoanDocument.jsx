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
import { applicationDetails, applicationUpdateWithImage } from "../LoanService";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { documentGetList } from "../../setting/SettingService";
import { Dialog } from "primereact/dialog";
// import { Image } from "primereact/image";

const documentValidationSchema = Yup.object().shape({
  documentType: Yup.string().required("Document type is required"),
  documentNumber: Yup.string().required("Document number is required"),
  documentImage: Yup.string().required("Document file is required"),
});
const PLoanDocument = (props) => {
  const loanDetails = useSelector((state) => state.loan.addLoan);
  const [loading, setLoading] = useState(false);
  const [getLoanData, setLoanData] = useState({});
  const [personalLoanDocuments, setPersonalLoanDocuments] = useState([]);
  const [visible, setVisible] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [selectTypeDocument, setSelectTypeDocument] = useState({});

  useEffect(() => {
    // if (loanDetails.type === "edit") {
    setLoading(true);
    applicationDetails(loanDetails.loanId)
      .then((res) => {
        setLoanData(res.data);
        documentGetList({
          country: res.data.branchDetails.country,
          loanTypeId: res.data.loanDetails._id,
        })
          .then((res) => {
            setPersonalLoanDocuments(res.data);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialValues =
    loanDetails.type === "edit"
      ? {
          documentType: "",
          documentImage: "",
          documentNumber: "",
        }
      : {
          documentType: "",
          documentImage: "",
          documentNumber: "",
        };

  const handelSubmit = (values) => {
    const reqData = {
      applicationType: "document",

      documentType: values.documentType,
      documentImage: values.documentImage,
      documentNumber: values.documentNumber,
      entity: selectTypeDocument.entity,
    };

    applicationUpdateWithImage({
      ...reqData,
      dataType: "document",
      _id: loanDetails.loanId,
    })
      .then((res) => {
        setLoading(false);
        Swal.fire({
          title: res.message,
          icon: "success",
        });
        // props.next();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onTemplateSelect = (e, setFieldValue, name) => {
    let files = e.files[0];
    setFieldValue(name, files, true);
  };

  const header = (data) => {
    return (
      <div
        className="flex align-items-center justify-content-between p-2"
        style={{ border: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}
      >
        <span className="text-xl text-900 font-bold">{`${data.documentType} (${data.description})`}</span>
        <Button
          icon="pi pi-plus"
          severity="danger"
          aria-label="Cancel"
          onClick={() => {
            setSelectTypeDocument(data);
            setVisible(true);
          }}
          type="button"
        />
      </div>
    );
  };

  return (
    <>
      {loading && <Loader />}

      {personalLoanDocuments.map((item, index) => {
        return (
          <Panel
            headerTemplate={() => header(item)}
            className="mt-2 "
            key={index}
          >
            <div className="flex flex-column ">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-start align-items-start font-medium">
                <div className="grid p-3"></div>
              </div>
            </div>
          </Panel>
        );
      })}
      <div className="flex pt-4 justify-content-end gap-2 mb-3">
        <Button
          label="Back"
          severity="secondary"
          icon="pi pi-arrow-left"
          // eslint-disable-next-line react/prop-types
          onClick={() => props.back()}
          type="button"
        />

        <Button
          type="button"
          label={"Next"}
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => props.next()}
        />
      </div>

      <Dialog
        header={
          actionType === "add"
            ? `Add ${selectTypeDocument.documentType}`
            : `Edit ${selectTypeDocument.documentType}`
        }
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          setVisible(false);
          setActionType("add");
        }}
      >
        <Formik
          onSubmit={handelSubmit}
          initialValues={initialValues}
          validationSchema={documentValidationSchema}
          enableReinitialize
        >
          {({ handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-start align-items-start font-medium">
                <div className="grid p-3">
                  <div className="col-12 md:col-6">
                    <Field
                      label="Document Type"
                      component={DropdownField}
                      name={`documentType`}
                      options={selectTypeDocument.document.map((elm) => ({
                        ...elm,
                        label: elm.name,
                        value: elm._id,
                      }))}
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <Field
                      label="Document Number"
                      component={InputField}
                      name={`documentNumber`}
                    />
                  </div>
                  <div className="col-12 md:col-12">
                    <Field
                      label="Document (Image or pdf)"
                      component={UploadField}
                      // multiple
                      name={`documentImage`}
                      onSelect={(e) =>
                        onTemplateSelect(e, setFieldValue, `documentImage`)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex pt-4 justify-content-end gap-2">
                <Button
                  type="button"
                  label={"Cancel"}
                  severity="danger"
                  onClick={() => setVisible(false)}
                />
                <Button type="submit" label={"Submit "} />
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default PLoanDocument;
