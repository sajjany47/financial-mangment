import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Tag } from "primereact/tag";
import Loader from "../../../component/Loader";
import {
  DropdownField,
  InputField,
  MultiDropdownField,
  RadioField,
} from "../../../component/FieldType";
import {
  documentCreate,
  documentList,
  documentTypeList,
  documentUpdate,
  loanTypeList,
} from "./OperationHubService";
import { countryList } from "../Employee/AddUserService";
import { useSelector } from "react-redux";
import { Position } from "../../../shared/Config";

const documentSchema = Yup.object().shape({
  documentName: Yup.string().required("Name is required"),
  documentType: Yup.string().required("Document Type is required"),
  // optional: Yup.string().required("Optional is required"),
  loanType: Yup.array().min(1, "Loan type is required"),
  country: Yup.array().min(1, "Country is required"),
});

const Document = () => {
  const userDetails = useSelector((state) => state.user.user.data);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [selectData, setSelectData] = useState({});
  const [countryData, setCountryData] = useState([]);
  const [documntsList, setDocumntsList] = useState([]);
  const [getLoanList, setLoanList] = useState([]);

  const initialValues =
    actionType === "add"
      ? {
          documentName: "",
          documentType: "",
          loanType: [],
          country: [],
          optional: false,
        }
      : {
          documentName: selectData.documentName,
          documentType: selectData.documentType,
          loanType: selectData.loanType,
          country: selectData.country,
          optional: selectData.optional,
          isActive: selectData.isActive,
        };

  useEffect(() => {
    getList();
    docmentTypeList();
    loanList();
    countryList()
      .then((res) => {
        setCountryData(
          res.data.map((item) => ({
            ...item,
            label: item.name,
            value: item.id,
          }))
        );
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = () => {
    setLoading(true);

    documentList()
      .then((res) => {
        setList(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const docmentTypeList = () => {
    setLoading(true);
    documentTypeList({ isActive: true })
      .then((res) => {
        setDocumntsList(
          res.data.map((item) => ({ label: item.name, value: item._id }))
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const loanList = () => {
    setLoading(true);
    loanTypeList({ isActive: true })
      .then((res) => {
        setLoanList(
          res.data.map((item) => ({ label: item.name, value: item._id }))
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">{"Document List"}</span>
        {(userDetails.position === Position.SUPER_ADMIN ||
          userDetails.position === Position.ADMIN) && (
          <Button
            label="Add"
            icon="pi pi-plus"
            type="button"
            onClick={() => {
              setVisible(true);
            }}
          />
        )}
      </div>
    );
  };

  const actionBodyTemplate = (item) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          text
          aria-label="Filter"
          onClick={() => {
            setVisible(true);
            setSelectData({
              ...item,
              country: item.country.map((elm) => elm._id),
              documentType: item.documentType._id,
              loanType: item.loanType.map((elm) => elm._id),
            });
            setActionType("edit");
          }}
        />
      </>
    );
  };

  const handelSubmits = (values) => {
    setLoading(true);

    if (actionType === "add") {
      documentCreate({ ...values })
        .then((res) => {
          Swal.fire({ title: res.message, icon: "success" });
          setLoading(false);
          setVisible(false);
          getList();
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      documentUpdate({ ...values, _id: selectData._id })
        .then((res) => {
          Swal.fire({ title: res.message, icon: "success" });
          setLoading(false);
          setVisible(false);
          getList();
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const statusTemplate = (item) => {
    return (
      <>
        {item.isActive ? (
          <Tag severity="success" value="Active" rounded />
        ) : (
          <Tag severity="danger" value="Inactive" rounded />
        )}
      </>
    );
  };

  const loanTemplate = (item) => {
    return (
      <div>
        {item.loanType.map((elm, ind) => {
          return (
            <Tag
              //   severity="success"
              className="m-1"
              value={elm.name}
              //   rounded
              key={ind}
            />
          );
        })}
      </div>
    );
  };

  const countryTemplate = (item) => {
    return (
      <div>
        {item.country.map((elm, ind) => {
          return (
            <Tag
              severity="warning"
              className="m-1"
              value={elm.name}
              //   rounded
              key={ind}
            />
          );
        })}
      </div>
    );
  };
  return (
    <>
      {loading && <Loader />}
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3 mb-6">
        <DataTable
          value={list}
          header={header}
          // tableStyle={{ minWidth: "60rem" }}
          dataKey="_id"
          emptyMessage="No data found."
          showGridlines
        >
          <Column field="documentName" header="Name" />
          <Column field="documentType.name" header="Document Type" />
          <Column field="loanType" header="Loan Type" body={loanTemplate} />
          <Column field="country" header="Country" body={countryTemplate} />
          <Column field="isActive" header="Status" body={statusTemplate} />
          <Column field="createdBy" header="CreatedBy" />
          <Column field="updatedBy" header="UpdatedBy" />
          {(userDetails.position === Position.SUPER_ADMIN ||
            userDetails.position === Position.ADMIN) && (
            <Column header="Action" body={actionBodyTemplate} />
          )}
        </DataTable>
      </div>

      <Dialog
        header={actionType === "add" ? "Add Document" : "Edit Document"}
        visible={visible}
        style={{ width: "60vw" }}
        onHide={() => {
          setVisible(false);
          setActionType("add");
          setSelectData({});
        }}
      >
        <Formik
          onSubmit={handelSubmits}
          initialValues={initialValues}
          validationSchema={documentSchema}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid p-3 border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
                <div className="col-12 md:col-4">
                  <Field
                    label="Name"
                    component={InputField}
                    name="documentName"
                  />
                </div>

                <div className="col-12 md:col-4">
                  <Field
                    label="Document Type"
                    component={DropdownField}
                    name="documentType"
                    options={documntsList}
                  />
                </div>
                <div className="col-12 md:col-12">
                  <Field
                    label="Loan Type"
                    component={MultiDropdownField}
                    name="loanType"
                    options={getLoanList}
                  />
                </div>
                <div className="col-12 md:col-12">
                  <Field
                    label="Country"
                    component={MultiDropdownField}
                    name="country"
                    options={countryData}
                    filter
                  />
                </div>
                {/* <div className="col-12 md:col-4">
                  <Field
                    label="Optional"
                    component={RadioField}
                    name="optional"
                    radiolist={[
                      { label: "Yes", id: 1, value: true },
                      { label: "No", id: 2, value: false },
                    ]}
                  />
                </div> */}
                {actionType === "edit" && (
                  <div className="col-12 md:col-4">
                    <Field
                      label="Status"
                      component={RadioField}
                      name="isActive"
                      radiolist={[
                        { label: "Active", id: 1, value: true },
                        { label: "Inactive", id: 2, value: false },
                      ]}
                    />
                  </div>
                )}
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

export default Document;
