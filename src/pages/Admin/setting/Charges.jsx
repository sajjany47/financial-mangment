import { useEffect, useState } from "react";
import Loader from "../../../component/Loader";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import {
  documentTypeCreate,
  documentTypeList,
  documentTypeUpdate,
} from "./SettingService";
import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import { InputField } from "../../../component/FieldType";
import Swal from "sweetalert2";
import * as Yup from "yup";

const chargesSchema = Yup.object().shape({
  processingFees: Yup.string().required("Processing Fees is required"),
  processingFeesGST: Yup.string().required("Processing Fees GST is required"),
  loginFees: Yup.string().required("Login Fees is required"),
  loginFeesGST: Yup.string().required("Login Fees GST is required"),
  otherCharges: Yup.string().required("Other Charges is required"),
  otherChargesGST: Yup.string().required("Other Charges GST is required"),
});

const Charges = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [selectData, setSelectData] = useState({});

  const initialValues =
    actionType === "add"
      ? {
          processingFees: "",
          processingFeesGST: "",
          loginFees: "",
          loginFeesGST: "",
          otherCharges: "",
          otherChargesGST: "",
        }
      : {
          processingFees: selectData.processingFees,
          processingFeesGST: selectData.processingFeesGST,
          loginFees: selectData.loginFees,
          loginFeesGST: selectData.loginFeesGST,
          otherCharges: selectData.otherCharges,
          otherChargesGST: selectData.otherChargesGST,
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
        <span className="text-xl text-900 font-bold">{"Charges List"}</span>

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

  return (
    <>
      {loading && <Loader />}
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
        <DataTable
          value={list}
          header={header}
          // tableStyle={{ minWidth: "60rem" }}
          dataKey="_id"
          emptyMessage="No data found."
          filterDisplay="row"
        >
          <Column field="processingFees" header="Processing Fees" />
          <Column field="processingFeesGST" header="Processing Fees GST" />
          <Column field="loginFees" header="Login Fees" />
          <Column field="loginFeesGST" header="Login Fees GST" />
          <Column field="otherCharges" header="Other Charges" />
          <Column header="Other Charges GST" field="otherChargesGST" />
          <Column header="Status" field="status" />
        </DataTable>
      </div>

      <Dialog
        header={actionType === "add" ? "Add Charges" : "Edit Charges"}
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
          validationSchema={chargesSchema}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid p-3 border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
                <div className="col-12 md:col-6">
                  <Field
                    label="Processing Fees(%)"
                    component={InputField}
                    name="processingFees"
                  />
                </div>

                <div className="col-12 md:col-6">
                  <Field
                    label="Processing Fees GST(%)"
                    component={InputField}
                    name="processingFeesGST"
                  />
                </div>

                <div className="col-12 md:col-6">
                  <Field
                    label="Login Fees Amount"
                    component={InputField}
                    name="loginFees"
                  />
                </div>

                <div className="col-12 md:col-6">
                  <Field
                    label="Login Fees GST(%)"
                    component={InputField}
                    name="loginFeesGST"
                  />
                </div>

                <div className="col-12 md:col-6">
                  <Field
                    label="Other Charges Amount"
                    component={InputField}
                    name="otherCharges"
                  />
                </div>

                <div className="col-12 md:col-6">
                  <Field
                    label="Other Charges GST(%)"
                    component={InputField}
                    name="otherChargesGST"
                  />
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

export default Charges;
