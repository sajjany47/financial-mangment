import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../../../store/reducer/searchReducer";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import Swal from "sweetalert2";
import * as Yup from "yup";
import Loader from "../../../component/Loader";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import { InputField, RadioField } from "../../../component/FieldType";
import {
  MenuList,
  PrimeMenuCreate,
  PrimeMenuUpdate,
} from "./AccessControlService";

const primaryMenuSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

const PrimaryMenu = () => {
  const dispatch = useDispatch();
  const searchKey = useSelector((state) => state?.search?.value);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [selectData, setSelectData] = useState({});

  const initialValues =
    actionType === "add"
      ? {
          name: "",
          icon: "",
        }
      : {
          name: selectData.name,
          isActive: selectData.isActive,
          icon: selectData.icon,
        };
  useEffect(() => {
    if (searchKey?.page === "primaryMenu") {
      dispatch(setSearch({ ...searchKey }));
    } else {
      dispatch(
        setSearch({
          page: "primaryMenu",
          filterOptions: {},
          pageNumber: 1,
          firstPage: 0,
          rows: 10,
          sortOrder: 1,
          sortField: "name",
        })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = () => {
    setLoading(true);

    MenuList()
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
          {"Primary Menu List"}
        </span>
        <div className="flex gap-2">
          <Button
            label="Add"
            icon="pi pi-plus"
            type="button"
            onClick={() => {
              setVisible(true);
            }}
          />
        </div>
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
      PrimeMenuCreate({ ...values })
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
      PrimeMenuUpdate({ ...values, _id: selectData._id })
        .then((res) => {
          Swal.fire({ title: res.message, icon: "success" });
          setLoading(false);
          setVisible(false);
          setSelectData({});
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
          <Column field="icon" header="Icon" />
          <Column field="isActive" header="Status" body={statusTemplate} />
          <Column
            field="createdBy"
            header="CreatedBy"
            body={(item) => (
              <div>
                {`${
                  item.createdBy
                    ? `${item.createdBy.name} (${item.createdBy.username})`
                    : ""
                }  `}
              </div>
            )}
          />
          <Column
            field="updatedBy"
            header="UpdatedBy"
            body={(item) => (
              <div>
                {`${
                  item.updatedBy
                    ? `${item.updatedBy.name} (${item.updatedBy.username})`
                    : ""
                }  `}
              </div>
            )}
          />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </div>

      <Dialog
        header={actionType === "add" ? "Add Primary Menu" : "Edit Primary Menu"}
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => {
          setVisible(false);
          setActionType("add");
          setSelectData({});
        }}
      >
        <Formik
          onSubmit={handelSubmits}
          initialValues={initialValues}
          validationSchema={primaryMenuSchema}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid p-3 border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
                <div className="col-12 md:col-12">
                  <Field label="Name" component={InputField} name="name" />
                </div>
                <div className="col-12 md:col-12">
                  <Field
                    label="Icon (Prime React Icon Only)"
                    component={InputField}
                    name="icon"
                  />
                </div>

                {actionType === "edit" && (
                  <div className="col-12 md:col-12">
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

export default PrimaryMenu;
