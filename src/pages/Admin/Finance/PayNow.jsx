/* eslint-disable react/prop-types */
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { financepayNow } from "./FinanceService";
import Swal from "sweetalert2";
import Loader from "../../../component/Loader";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { InputField } from "../../../component/FieldType";

const validationSchema = Yup.object({
  accountNumber: Yup.string().required("Account number is required"),
  amount: Yup.string().required("Amount is required"),
  accountName: Yup.string().required("Account name is required"),
  bankName: Yup.string().required("Bank name is required"),
  ifsc: Yup.string().required("IFSC is required"),
  transactionNumber: Yup.string().required("Transaction Number is required"),
});
const PayNow = (props) => {
  const data = props.data;
  const [loading, setLoading] = useState(false);

  const handelSubmit = (values) => {
    setLoading(true);
    let reqData = { ...values, _id: data._id, type: props.type };
    if (props.type === "payout") {
      reqData.payoutId = data.payoutSchedule._id;
    }
    if (props.type === "reedemId") {
      reqData.payoutId = data.payoutReedem._id;
    }

    financepayNow({
      ...reqData,
    })
      .then((res) => {
        setLoading(false);
        Swal.fire({
          title: res.message,
          icon: "success",
        });
        props.handelDialog(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  return (
    <>
      {loading && <Loader />}
      <Formik
        initialValues={{
          accountNumber: data.accountNumber,
          accountName: data.accountName,
          bankName: data.bankName,
          ifsc: data.ifsc,
          amount:
            props.type === "payout"
              ? data.payoutSchedule.payoutAmount
              : data.payoutReedem.reedemAmount,
          transactionNumber: "",
        }}
        onSubmit={handelSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex flex-column ">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <div className="grid p-3">
                  <div className="col-12 md:col-6">
                    <Field
                      label="Account Number"
                      component={InputField}
                      name="accountNumber"
                      disabled
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <Field
                      label="Account Name"
                      component={InputField}
                      name="accountName"
                      disabled
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <Field
                      label="Bank Name"
                      component={InputField}
                      name="bankName"
                      disabled
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <Field
                      label="IFSC"
                      component={InputField}
                      name="ifsc"
                      disabled
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <Field
                      label="Payout Amount"
                      component={InputField}
                      name="amount"
                      disabled
                    />
                  </div>

                  <div className="col-12 md:col-6">
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
    </>
  );
};

export default PayNow;
