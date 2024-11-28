import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../../../store/reducer/searchReducer";
import { createMenu, menuList, updateMenu } from "./AccessControlService";
import { Button } from "primereact/button";
import Swal from "sweetalert2";
import { Tag } from "primereact/tag";
import Loader from "../../../component/Loader";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  DropdownField,
  InputField,
  RadioField,
} from "../../../component/FieldType";

const childMenuSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  primaryMenu: Yup.string().required("Primary Menu is required"),
  path: Yup.string().required("Path is required"),
});
const ChildMenu = () => {
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
          primaryMenu: "",
          name: "",
          path: "",
        }
      : {
          primaryMenu: selectData.primaryMenu,
          name: selectData.name,
          path: selectData.path,
          isActive: selectData.isActive,
        };

  useEffect(() => {
    if (searchKey?.page === "childMenu") {
      dispatch(setSearch({ ...searchKey }));
    } else {
      dispatch(
        setSearch({
          page: "childMenu",
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

    menuList()
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
        <span className="text-xl text-900 font-bold">{"Child Menu List"}</span>
        <div className="flex gap-2">
          <Button
            label="Add"
            icon="pi pi-plus"
            type="button"
            onClick={() => {
              setActionType("add");
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
      createMenu({ ...values })
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
      updateMenu({ ...values, _id: selectData._id })
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
          <Column field="primaryMenu" header="Primary Menu" />
          <Column field="name" header="Name" />
          <Column field="isActive" header="Status" body={statusTemplate} />
          <Column field="path" header="Path" />

          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </div>

      <Dialog
        header={actionType === "add" ? "Add Child Menu" : "Edit Child Menu"}
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
          validationSchema={childMenuSchema}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid p-3 border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
                <div className="col-12 md:col-12">
                  <Field
                    label="Primary Menu"
                    component={DropdownField}
                    name="primaryMenu"
                    filter
                    options={[]}
                  />
                </div>
                <div className="col-12 md:col-12">
                  <Field label="Name" component={InputField} name="name" />
                </div>
                <div className="col-12 md:col-12">
                  <Field label="Path" component={InputField} name="path" />
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

export default ChildMenu;
