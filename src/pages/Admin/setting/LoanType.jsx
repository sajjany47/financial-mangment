import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Tag } from "primereact/tag";
import { loanTypeCreate, loanTypeList, loanTypeUpdate } from "./SettingService";
import Loader from "../../../component/Loader";
import {
  InputField,
  MultiDropdownField,
  RadioField,
} from "../../../component/FieldType";
import { countryList } from "../Employee/AddUserService";

const loanTypeSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  icon: Yup.string().required("Icon is required"),
  country: Yup.array().min(1, "Country is required"),
});

const LoanType = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [selectData, setSelectData] = useState({});
  const [countryData, setCountryData] = useState([]);

  const initialValues =
    actionType === "add"
      ? {
          name: "",
          country: [],
          icon: "",
        }
      : {
          name: selectData.name,
          country: selectData.country,
          isActive: selectData.isActive,
          icon: selectData.icon,
        };

  useEffect(() => {
    getList();
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

    loanTypeList()
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
        <span className="text-xl text-900 font-bold">{"Loan Type List"}</span>

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
            setSelectData({
              ...item,
              country: item.country.map((elm) => elm._id),
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
      loanTypeCreate({ ...values })
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
      loanTypeUpdate({ ...values, _id: selectData._id })
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

  const countryTemplate = (item) => {
    return (
      <div>
        {item.country.map((elm, ind) => {
          return (
            <Tag
              severity="warning"
              className="m-1"
              value={elm.name}
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
          <Column field="name" header="Name" />
          <Column field="country" header="Country" body={countryTemplate} />
          <Column field="isActive" header="Status" body={statusTemplate} />
          <Column field="createdBy" header="CreatedBy" />
          <Column field="updatedBy" header="UpdatedBy" />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </div>

      <Dialog
        header={actionType === "add" ? "Add Loan Type" : "Edit Loan Type"}
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
          validationSchema={loanTypeSchema}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid p-3 border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
                <div className="col-12 md:col-4">
                  <Field label="Name" component={InputField} name="name" />
                </div>
                <div className="col-12 md:col-4">
                  <Field label="Icon" component={InputField} name="icon" />
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

export default LoanType;
