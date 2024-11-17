import { useEffect, useState } from "react";
import Loader from "../../../component/Loader";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import {
  chargesCreate,
  chargesList,
  chargesStatusChange,
  documentTypeUpdate,
} from "./OperationHubService";
import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import { Currency, InputField } from "../../../component/FieldType";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { InputSwitch } from "primereact/inputswitch";

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
          foreclosureFees: "",
          foreclosureFeesGST: "",
          foreclosureApply: "",
          overdue: "",
        }
      : {
          processingFees: selectData.processingFees,
          processingFeesGST: selectData.processingFeesGST,
          loginFees: selectData.loginFees,
          loginFeesGST: selectData.loginFeesGST,
          otherCharges: selectData.otherCharges,
          otherChargesGST: selectData.otherChargesGST,
          foreclosureFees: selectData.foreclosureFees,
          foreclosureFeesGST: selectData.foreclosureFeesGST,
          foreclosureApply: selectData.foreclosureApply,
          overdue: selectData.overdue,
        };

  useEffect(() => {
    getList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = () => {
    setLoading(true);

    chargesList()
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
      chargesCreate({ ...values })
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

  const handelStatus = (value, id) => {
    setLoading(true);
    chargesStatusChange({ status: value, _id: id })
      .then((res) => {
        setLoading(false);
        getList();
        Swal.fire({ title: res.message, icon: "success" });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const statusTemplate = (item) => {
    return (
      <InputSwitch
        checked={item.isActive}
        onChange={() => handelStatus(!item.isActive, item._id)}
      />
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
          <Column
            field="processingFees"
            header="Processing Fees"
            body={(item) => (
              <>{item.processingFees && `${item.processingFees}%`}</>
            )}
            align={"center"}
          />
          <Column
            field="processingFeesGST"
            header="Processing Fees GST"
            body={(item) => (
              <>{item.processingFeesGST && `${item.processingFeesGST}%`}</>
            )}
            align={"center"}
          />
          <Column
            field="loginFees"
            header="Login Fees"
            align={"center"}
            body={(item) => <>{item.loginFees && Currency(item?.loginFees)}</>}
          />
          <Column
            field="loginFeesGST"
            header="Login Fees GST"
            body={(item) => <>{item.loginFeesGST && `${item.loginFeesGST}%`}</>}
            align={"center"}
          />
          <Column
            header="Foreclosure Apply"
            field="foreclosureApply"
            align={"center"}
          />
          <Column
            field="foreclosureFees"
            header="Foreclosure Fees"
            body={(item) => (
              <>{item.foreclosureFees && `${item.foreclosureFees}%`}</>
            )}
            align={"center"}
          />
          <Column
            field="foreclosureFeesGST"
            header="Foreclosure Fees GST"
            body={(item) => (
              <>{item.foreclosureFeesGST && `${item.foreclosureFeesGST}%`}</>
            )}
            align={"center"}
          />
          <Column
            field="otherCharges"
            header="Other Charges"
            align={"center"}
            body={(item) => (
              <>{item.otherCharges && Currency(item?.otherCharges)}</>
            )}
          />
          <Column
            header="Other Charges GST"
            field="otherChargesGST"
            body={(item) => (
              <>{item.otherChargesGST && `${item.otherChargesGST}%`}</>
            )}
            align={"center"}
          />
          <Column
            field="overdue"
            header="Overdue"
            align={"center"}
            body={(item) => <>{item.overdue && `${item.overdue}%`}</>}
          />

          <Column header="Status" field="isActive" body={statusTemplate} />
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
                <div className="col-12 md:col-4">
                  <Field
                    label="Processing Fees(%)"
                    component={InputField}
                    name="processingFees"
                  />
                </div>

                <div className="col-12 md:col-4">
                  <Field
                    label="Processing Fees GST(%)"
                    component={InputField}
                    name="processingFeesGST"
                  />
                </div>

                <div className="col-12 md:col-4">
                  <Field
                    label="Login Fees Amount"
                    component={InputField}
                    name="loginFees"
                  />
                </div>

                <div className="col-12 md:col-4">
                  <Field
                    label="Login Fees GST(%)"
                    component={InputField}
                    name="loginFeesGST"
                  />
                </div>
                <div className="col-12 md:col-4">
                  <Field
                    label="Foreclosure Fees(%)"
                    component={InputField}
                    name="foreclosureFees"
                  />
                </div>

                <div className="col-12 md:col-4">
                  <Field
                    label="Foreclosure Fees GST(%)"
                    component={InputField}
                    name="foreclosureFeesGST"
                  />
                </div>
                <div className="col-12 md:col-4">
                  <Field
                    label="Foreclosure Apply(In months)"
                    component={InputField}
                    name="foreclosureApply"
                    keyfilter="int"
                  />
                </div>

                <div className="col-12 md:col-4">
                  <Field
                    label="Overdue(%)/Perday of EMI"
                    component={InputField}
                    name="overdue"
                  />
                </div>
                <div className="col-12 md:col-4">
                  <Field
                    label="Other Charges Amount"
                    component={InputField}
                    name="otherCharges"
                  />
                </div>

                <div className="col-12 md:col-4">
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
