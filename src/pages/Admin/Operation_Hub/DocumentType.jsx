import { useEffect, useState } from "react";
import Loader from "../../../component/Loader";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import {
  documentTypeCreate,
  documentTypeList,
  documentTypeUpdate,
} from "./OperationHubService";
import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import { InputField, RadioField } from "../../../component/FieldType";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Tag } from "primereact/tag";

const documentTypeSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

const DocumentType = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [selectData, setSelectData] = useState({});

  const initialValues =
    actionType === "add"
      ? {
          name: "",
          description: "",
        }
      : {
          name: selectData.name,
          description: selectData.description,
          isActive: selectData.isActive,
        };

  useEffect(() => {
    getList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = () => {
    setLoading(true);

    documentTypeList()
      .then((res) => {
        setList(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">
          {"Document Type List"}
        </span>

        <Button
          label="Add"
          icon="pi pi-plus"
          type="button"
          onClick={() => {
            setVisible(true);
          }}
        />
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
            setSelectData(item);
            setActionType("edit");
          }}
        />
      </>
    );
  };

  const handelSubmits = (values) => {
    setLoading(true);

    if (actionType === "add") {
      documentTypeCreate({ ...values })
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
      documentTypeUpdate({ ...values, _id: selectData._id })
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
          <Column field="name" header="Name" />
          <Column field="description" header="Description" />
          <Column field="isActive" header="Status" body={statusTemplate} />
          <Column field="createdBy" header="CreatedBy" />
          <Column field="updatedBy" header="UpdatedBy" />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </div>

      <Dialog
        header={
          actionType === "add" ? "Add Document Type" : "Edit Document Type"
        }
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
          validationSchema={documentTypeSchema}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid p-3 border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
                <div className="col-12 md:col-6">
                  <Field label="Name" component={InputField} name="name" />
                </div>

                <div className="col-12 md:col-6">
                  <Field
                    label="Description"
                    component={InputField}
                    name="description"
                  />
                </div>

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

export default DocumentType;
