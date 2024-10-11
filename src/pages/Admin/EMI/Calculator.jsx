import { Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { Currency, InputField } from "../../../component/FieldType";
import { Button } from "primereact/button";
// import Swal from "sweetalert2";
import { emiDetails } from "./EmiService";
import Loader from "../../../component/Loader";
import { Splitter, SplitterPanel } from "primereact/splitter";
import moment from "moment";
import CustomChip from "./CustomChip";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useLocation } from "react-router-dom";

const emiSchema = Yup.object().shape({
  loanTenure: Yup.string().required("Loan tenure is required"),
  loanAmount: Yup.string().required("Loan amount is required"),
  interestRate: Yup.string().required("Interest rate is required"),
});
const Calculator = () => {
  const propsValue = useLocation()?.state?.data;
  console.log(propsValue);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const handelStatusChange = (values) => {
    setLoading(true);
    emiDetails({
      loanTenure: values.loanTenure,
      interestRate: values.interestRate,
      loanAmount: values.loanAmount,
    })
      .then((res) => {
        setData(res.data);
        // Swal.fire({
        //   title: res.message,
        //   icon: "success",
        // });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <Loader />}

      <Splitter>
        <SplitterPanel
          className="flex  justify-content-start"
          size={25}
          minSize={10}
          style={{ padding: 10 }}
        >
          <Formik
            onSubmit={handelStatusChange}
            initialValues={
              propsValue === undefined
                ? { loanTenure: "", interestRate: "", loanAmount: "" }
                : {
                    loanTenure: propsValue.loanTenure,
                    interestRate: propsValue.interestRate,
                    loanAmount: propsValue.loanAmount,
                  }
            }
            validationSchema={emiSchema}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="border-2 border-dashed surface-border border-round surface-ground  font-medium">
                  <div className="grid p-3">
                    <div className="col-12 md:col-12">
                      <Field
                        label="Loan Amount"
                        component={InputField}
                        name="loanAmount"
                        keyfilter="money"
                      />
                    </div>

                    <div className="col-12 md:col-12">
                      <Field
                        label="Interest Rate/Month"
                        component={InputField}
                        name="interestRate"
                        keyfilter="num"
                      />
                    </div>
                    <div className="col-12 md:col-12">
                      <Field
                        label="Tenure (In months)"
                        component={InputField}
                        name="loanTenure"
                        keyfilter="int"
                      />
                    </div>

                    <div className="col-12 md:col-12 ">
                      <Button
                        label="Calculate"
                        type="submit"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </SplitterPanel>
        <SplitterPanel
          className="flex  justify-content-start"
          size={75}
          style={{ padding: 10 }}
        >
          <div className="surface-0">
            <div className="font-medium text-3xl text-900 mb-3">
              EMI Details
            </div>

            <ul className="list-none p-0 m-0">
              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                <div className="text-500 w-6 md:w-2 font-medium">
                  EMI Monthly
                </div>
                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                  {Currency(data?.EMIMonthly)}
                </div>
              </li>
              <li className="flex align-items-center  border-top-1 border-300 flex-wrap">
                <div className="text-500 w-6 md:w-2 font-medium">Charges</div>
                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                  <div className="grid">
                    <div className="col-12 md:col-4 lg:col-4">
                      <CustomChip
                        data={data?.disbursment?.processingFees}
                        name={"Processing Fees"}
                      />
                    </div>
                    <div className="col-12 md:col-4 lg:col-4">
                      <CustomChip
                        data={data?.disbursment?.processingFeesGST}
                        name={"Processing Fees GST"}
                      />
                    </div>
                    <div className="col-12 md:col-4 lg:col-4">
                      <CustomChip
                        data={data?.disbursment?.loginFees}
                        name={"Login Fees"}
                      />
                    </div>
                    <div className="col-12 md:col-4 lg:col-4">
                      <CustomChip
                        data={data?.disbursment?.loginFeesGST}
                        name={"Login Fees GST"}
                      />
                    </div>
                    <div className="col-12 md:col-4 lg:col-4">
                      <CustomChip
                        data={data?.disbursment?.otherCharges}
                        name={"Other Charges"}
                      />
                    </div>
                    <div className="col-12 md:col-4 lg:col-4">
                      {" "}
                      <CustomChip
                        data={data?.disbursment?.otherChargesGST}
                        name={"Other Charges GST"}
                      />
                    </div>
                  </div>
                </div>
              </li>
              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                <div className="text-500 w-6 md:w-2 font-medium">
                  Disbursment Amount
                </div>
                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                  {Currency(data?.disbursment?.disbursedAmount)}
                </div>
              </li>
              <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                <div className="text-500 w-6 md:w-2 font-medium">
                  EMI Schedule
                </div>

                <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
                  <DataTable
                    value={data?.emiSchedule}
                    tableStyle={{ minWidth: "50rem" }}
                  >
                    <Column
                      field="emiDate"
                      header="Date"
                      body={(item) => (
                        <>{moment(item?.emiDate).format("DD-MM-YYYY")}</>
                      )}
                    />
                    <Column
                      field="emiAmount"
                      header="EMI Amount"
                      body={(item) => <>{Currency(item?.emiAmount)}</>}
                    />
                    <Column
                      field="interestPaid"
                      header="Interest Paid"
                      body={(item) => <>{Currency(item?.interestPaid)}</>}
                    />
                    <Column
                      field="principalPaid"
                      header=" Principle Paid"
                      body={(item) => <> {Currency(item?.principalPaid)}</>}
                    />
                    <Column
                      field="remainingOutstanding"
                      header="Outstanding"
                      body={(item) => (
                        <>{Currency(item?.remainingOutstanding)}</>
                      )}
                    />
                  </DataTable>
                  <div className="grid"></div>
                </div>
              </li>
            </ul>
          </div>
        </SplitterPanel>
      </Splitter>
    </>
  );
};

export default Calculator;
