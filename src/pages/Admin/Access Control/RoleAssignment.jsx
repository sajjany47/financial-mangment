import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import Loader from "../../../component/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../../../store/reducer/searchReducer";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import {
  ChildMenuList,
  PositionCreate,
  PositionList,
  PositionUpdate,
} from "./AccessControlService";
import Swal from "sweetalert2";
import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import {
  InputField,
  MultiDropdownField,
  RadioField,
} from "../../../component/FieldType";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const RoleAssignSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  menu: Yup.array()
    .required("Primary Menu is required")
    .min(1, "Minimum one field is required"),
});
const RoleAssignment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchKey = useSelector((state) => state?.search?.value);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [list, setList] = useState([]);
  const [actionType, setActionType] = useState("add");
  const [visible, setVisible] = useState(false);
  const [option, setOptions] = useState([]);

  const initialValues =
    actionType === "add"
      ? {
          name: "",
          menu: [],
        }
      : {
          name: selectedItem.name,
          menu: selectedItem.childMenus.map((item) => item._id),
          isActive: selectedItem.isActive,
        };

  useEffect(() => {
    if (searchKey?.page === "role") {
      dispatch(setSearch({ ...searchKey }));
    } else {
      dispatch(
        setSearch({
          page: "role",
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
    Promise.all([getList(), geChildMenutList()]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = () => {
    setLoading(true);

    PositionList()
      .then((res) => {
        const modifyData = res.data.map((elm) => ({
          ...elm,
          childMenus: elm.menu.flatMap((menu) => menu.childMenu),
        }));

        setList(modifyData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const geChildMenutList = () => {
    setLoading(true);

    ChildMenuList()
      .then((res) => {
        const filterData = res.data.filter(
          (item) =>
            item?.isActive === true && item?.childMenu?.isActive === true
        );
        setOptions(
          filterData.map((item) => ({
            label: item.childMenu.name,
            value: item.childMenu._id,
          }))
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
        <span className="text-xl text-900 font-bold">{"Role List"}</span>
        <div className="flex gap-2">
          <Button
            label={"Add"}
            icon="pi pi-plus"
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
            setSelectedItem(item);
            setActionType("edit");
          }}
        />
      </>
    );
  };
  const handelSubmits = (values) => {
    setLoading(true);

    if (actionType === "add") {
      PositionCreate({ ...values })
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
      PositionUpdate({ ...values, _id: selectedItem._id })
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
        {item?.isActive ? (
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
          <Column
            field="menu"
            header="Menu"
            body={(item) => (
              <div
                onClick={() =>
                  navigate("/menu/role-view", { state: { data: item } })
                }
                style={{ cursor: "pointer", color: "blue" }}
                className="hover:text-primary"
              >
                {item?.childMenus ? item.childMenus.length : null}
              </div>
            )}
          />

          <Column body={statusTemplate} header="Status" />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </div>

      <Dialog
        header={actionType === "add" ? "Add Role & Menu" : "Edit Role & Menu"}
        visible={visible}
        style={{ width: "60vw" }}
        className="w-full md:w-6"
        onHide={() => {
          setVisible(false);
          setActionType("add");
          setSelectedItem({});
        }}
      >
        <Formik
          onSubmit={handelSubmits}
          initialValues={initialValues}
          validationSchema={RoleAssignSchema}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid p-3 border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
                <div className="col-12 md:col-12">
                  <Field label="Name" component={InputField} name="name" />
                </div>
                <div className="col-12 md:col-12">
                  <Field
                    label="Menu"
                    component={MultiDropdownField}
                    name="menu"
                    filter
                    options={option}
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

export default RoleAssignment;
