import { Button } from "primereact/button";
import { DropdownField, InputField } from "../../../component/FieldType";
import { useEffect, useState } from "react";
import { LoanPay, PaymentDetails } from "./ManageService";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getList = () => {
    setLoading(true);
    PaymentDetails(id)
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
  return (
    <>
      {loading && <Loader />}
      <TabView>
        <TabPanel header="PENDING EMI">
          <PaymentScreen data={data} clickData={clickData} />
        </TabPanel>
        <TabPanel header="PAID EMI">
          <PaymentScreen data={paidList} clickData={clickData} />
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
                          setFieldValue("type", e.value);
                          setFieldValue(
                            "amount",
                            e.value === "emi_pay"
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
                        label="Waiver Amount"
                        component={InputField}
                        name="waiverAmount"
                        keyfilter="money"
                        onChange={(e) => {
                          setFieldValue("waiverAmount", e.target.value);
                          setFieldValue(
                            "amount",
                            Number(
                              values.type === "emi_pay"
                                ? selectData.emiAmount
                                : selectData.foreclosureAmount
                            ) - Number(e.target.value)
                          );
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
