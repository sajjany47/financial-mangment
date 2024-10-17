import { Button } from "primereact/button";
import {
  Currency,
  DropdownField,
  InputField,
} from "../../../component/FieldType";
import { useEffect, useState } from "react";
import { LoanPay, PaymentDetails } from "./ManageService";
import { useParams } from "react-router-dom";
import Loader from "../../../component/Loader";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";

const validationSchema = Yup.object({
  type: Yup.string().required("Type is required"),
  amount: Yup.string().required("Amount is required"),
  transactionNumber: Yup.string().required("Transaction Number is required"),
});
const LoanPayment = () => {
  const id = useParams().id;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectData, setSelectData] = useState({});

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getList = () => {
    setLoading(true);
    PaymentDetails(id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handelSubmit = (values) => {
    setLoading(true);
    LoanPay({ ...values })
      .then((res) => {
        setLoading(false);
        setVisible(false);
        Swal.fire({
          title: res.message,
          icon: "success",
        });
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <>
      {loading && <Loader />}
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-1 mb-6 surface-0">
        <div className="grid">
          {data.map((item, index) => {
            const unpaidIndex = data.findIndex((emi) => !emi.isPaid);
            return (
              <div className="col-12 lg:col-4" key={item._id}>
                <div className="p-3 h-full">
                  <div
                    className="shadow-2 p-3 h-full flex flex-column"
                    style={{ borderRadius: "6px" }}
                  >
                    <div className="text-900 font-medium text-xl mb-2">
                      {moment(item.emiDate).format("DD MMM,YYYY")} ({index + 1}/
                      {data.length + 1} )
                    </div>
                    <div className="text-600">{Currency(item.emiAmount)}</div>
                    <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                    <div className="flex align-items-center">
                      <span className="font-bold text-2xl text-900">
                        {Currency(item.payableAmount)}
                      </span>
                      <span className="ml-2 font-medium text-600">
                        Payable Amount
                      </span>
                    </div>
                    <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                    <ul className="list-none p-0 m-0 flex-grow-1">
                      <li className="flex align-items-center mb-2 justify-content-between">
                        <span className="text-600 ">Principle Paid </span>
                        <span>{Currency(item.principalPaid)}</span>
                      </li>
                      <li className="flex align-items-center mb-2 justify-content-between">
                        <span className="text-600 ">Interest Paid </span>
                        <span>{Currency(item.interestPaid)}</span>
                      </li>
                      <li className="flex align-items-center mb-2 justify-content-between">
                        <span className="text-600 ">Overdue (In Days) </span>
                        <span>{item.overdueDays}</span>
                      </li>
                      <li className="flex align-items-center mb-2 justify-content-between">
                        <span className="text-600 ">Overdue Paid </span>
                        <span>{Currency(item.overdueAmount)}</span>
                      </li>
                      <li className="flex align-items-center mb-2 justify-content-between">
                        <span className="text-600 ">
                          Remaining Outstanding{" "}
                        </span>
                        <span>{Currency(item.remainingOutstanding)}</span>
                      </li>
                      <li className="flex align-items-center mb-2 justify-content-between">
                        <span className="text-600 ">Foreclosure Amount</span>
                        <span>{Currency(item.foreclosureAmount)}</span>
                      </li>
                    </ul>
                    <hr className="mb-3 mx-0 border-top-1 border-bottom-none border-300 mt-auto" />
                    <Button
                      label={item.isPaid ? "Paid" : "Pay Now"}
                      className="p-3 w-full mt-auto"
                      disabled={index !== unpaidIndex || item.isPaid}
                      severity={item.isPaid ? "success" : "primary"}
                      onClick={() => {
                        setSelectData(item);
                        setVisible(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Dialog
        header={"Loan Payment"}
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => {
          setVisible(false);
          setSelectData({});
        }}
      >
        <Formik
          initialValues={{
            type: "",
            amount: "",
            transactionNumber: "",
          }}
          onSubmit={handelSubmit}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex flex-column ">
                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                  <div className="grid p-3">
                    <div className="col-12 md:col-12">
                      <Field
                        label="Type"
                        component={DropdownField}
                        name="type"
                        options={[
                          { label: "EMI Pay", value: "emi" },
                          { label: "Foreclosure", value: "foreclosure" },
                        ]}
                        onChange={(e) => {
                          setFieldValue("type", e.value);
                          setFieldValue(
                            "amount",
                            e.value === "emi"
                              ? selectData.emiAmount
                              : selectData.foreclosureAmount
                          );
                        }}
                      />
                    </div>
                    <div className="col-12 md:col-12">
                      <Field
                        label="Amount"
                        component={InputField}
                        name="amount"
                        disabled
                      />
                    </div>
                    <div className="col-12 md:col-12">
                      <Field
                        label="Transaction Number"
                        component={InputField}
                        name="transactionNumber"
                      />
                    </div>
                    <div className="col-12 md:col-12">
                      <Button label="Submit" className="w-full mt-2" />
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default LoanPayment;
