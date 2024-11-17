import { Button } from "primereact/button";
import { DropdownField, InputField } from "../../../component/FieldType";
import { useEffect, useState } from "react";
import { LoanPay, PaidDetails, PaymentDetails } from "./ManageService";
import { useParams } from "react-router-dom";
import Loader from "../../../component/Loader";
import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { TabPanel, TabView } from "primereact/tabview";
import { PayWithFore, PayWithoutFore } from "../../../shared/Config";
import PaymentScreen from "./PaymentScreen";

const validationSchema = Yup.object({
  type: Yup.string().required("Type is required"),
  amount: Yup.string().required("Amount is required"),
  waiverAmount: Yup.string().required("Waiver amount is required"),
  transactionNumber: Yup.string().required("Transaction Number is required"),
});
const LoanPayment = () => {
  const id = useParams().id;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [paidList, setPaidList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectData, setSelectData] = useState({});

  useEffect(() => {
    getList();
    LoanPaidList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const LoanPaidList = () => {
    setLoading(true);
    PaidDetails({ loanId: id })
      .then((res) => {
        setPaidList(res?.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getList = () => {
    setLoading(true);
    PaymentDetails({ loanId: id })
      .then((res) => {
        setData(res?.data.filter((item) => item.isPaid === false));
        setPaidList(res?.data.filter((item) => item.isPaid === true));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handelSubmit = (values) => {
    setLoading(true);
    LoanPay({
      ...values,
      loanId: selectData.loanId,
      _id: selectData._id,
      overdueAmount: selectData.overdueAmount,
      overdueDays: selectData.overdueDays,
    })
      .then((res) => {
        setLoading(false);
        setVisible(false);
        getList();
        LoanPaidList();
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
  const clickData = (item) => {
    {
      setSelectData(item);
      setVisible(true);
    }
  };

  const handelType = (setFieldValue, value) => {
    setFieldValue("type", value);
    if (value === "emi_pay" || value === "emi_settlement") {
      setFieldValue(
        "amount",
        Number(selectData.emiAmount) + Number(selectData.overdueAmount)
      );
    }
    if (value === "foreclosure" || value === "loan_settlement") {
      let foreclosureAmount = Number(selectData.emiAmount);
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        foreclosureAmount += Number(element.overdueAmount);
      }
      setFieldValue("amount", Number(foreclosureAmount));
    }
  };

  const handelWaiver = (setFieldValue, value, fieldValue) => {
    setFieldValue("waiverAmount", value);
    if (fieldValue.type === "emi_pay" || fieldValue.type === "emi_settlement") {
      setFieldValue(
        "amount",
        Number(selectData.emiAmount) +
          Number(selectData.overdueAmount) -
          Number(value)
      );
    }
    if (
      fieldValue.type === "foreclosure" ||
      fieldValue.type === "loan_settlement"
    ) {
      let foreclosureAmount = Number(selectData.emiAmount);
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        foreclosureAmount += Number(element.overdueAmount);
      }
      setFieldValue("amount", Number(foreclosureAmount) - Number(value));
    }
  };
  return (
    <>
      {loading && <Loader />}
      <TabView>
        <TabPanel header="PENDING EMI">
          <PaymentScreen data={data} clickData={clickData} type="unpaid" />
        </TabPanel>
        <TabPanel header="PAID EMI">
          <PaymentScreen data={paidList} clickData={clickData} type="paid" />
        </TabPanel>
      </TabView>

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
            waiverAmount: "",
          }}
          onSubmit={handelSubmit}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex flex-column ">
                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                  <div className="grid p-3">
                    <div className="col-12 md:col-12">
                      <Field
                        label="Type"
                        component={DropdownField}
                        name="type"
                        options={
                          selectData.foreclosureAmount !== "Not applicable"
                            ? PayWithFore
                            : PayWithoutFore
                        }
                        onChange={(e) => {
                          handelType(setFieldValue, e.value);
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
                        label="Waiver Amount"
                        component={InputField}
                        name="waiverAmount"
                        keyfilter="money"
                        onChange={(e) => {
                          handelWaiver(setFieldValue, e.target.value, values);
                        }}
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
