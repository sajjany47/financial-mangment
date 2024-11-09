/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Loader from "../../../component/Loader";
import { Field, Form, Formik } from "formik";
import {
  DateField,
  DropdownField,
  InputField,
} from "../../../component/FieldType";
import * as Yup from "yup";
import {
  financeCreate,
  financeUpdate,
  getInvestorDetails,
} from "./FinanceService";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { InvestmentTypes, PayoutFrequencies } from "../../../shared/Config";
import { findIFSC } from "../Employee/AddUserService";
import { Button } from "primereact/button";

const financeSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  mobile: Yup.string().required("Mobile number is required"),
  email: Yup.string()
    // .matches("/S+@S+.S+/", "Please enter valid email")
    .required("Email is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(Date.now() - 567648000000), "You must be at least 18 years"),
  bankName: Yup.string().required("Bank name is required"),
  accountNumber: Yup.string().required("Account number is required"),
  bankBranchName: Yup.string().required("Branch name is required"),
  ifsc: Yup.string().required("IFSC code is required"),
  accountName: Yup.string().required("Account name is required"),
  investmentType: Yup.string().required("Investment type is required"),
  investmentAmount: Yup.string().required("Investment amount is required"),
  duration: Yup.string().required("Duration is required"),
  interestRate: Yup.string().required("Interest Rate is required"),
  payoutFrequency: Yup.string().required("Payout frequency is required"),
  payoutDate: Yup.string().required("Payout date is required"),
  aadharNumber: Yup.string().required("Aadhar Number is required"),
  panNumber: Yup.string().required("Pan number is required"),
});
const AddInvestor = () => {
  const navigation = useNavigate();
  const propsData = useLocation().state;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    if (propsData.type === "edit") {
      getInvestorDetails(propsData.id)
        .then((res) => {
          setData(res.data);

          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialValues =
    propsData.type === "edit"
      ? {
          name: data.name,
          mobile: data.mobile,
          email: data.email,
          dob: new Date(data.dob),
          investmentType: data.investmentType,
          investmentAmount: data.investmentAmount,
          duration: propsData?.plan ? "" : data.duration,
          interestRate: propsData?.plan ? "" : data.interestRate,
          payoutFrequency: propsData?.plan ? "" : data.payoutFrequency,
          payoutDate: propsData?.plan ? "" : new Date(data.payoutDate),
          accountNumber: data.accountNumber,
          bankName: data.bankName,
          bankBranchName: data.bankBranchName,
          ifsc: data.ifsc,
          accountName: data.accountName,
          _id: data._id,
          panNumber: data.panNumber,
          aadharNumber: data.aadharNumber,
        }
      : {
          name: "",
          mobile: "",
          email: "",
          dob: "",
          investmentType: "",
          investmentAmount: "",
          duration: "",
          interestRate: "",
          payoutFrequency: "",
          payoutDate: "",
          accountNumber: "",
          bankName: "",
          bankBranchName: "",
          ifsc: "",
          accountName: "",
          panNumber: "",
          aadharNumber: "",
        };

  const handelSubmit = (values) => {
    setLoading(true);

    // eslint-disable-next-line react/prop-types
    if (propsData.type === "edit") {
      financeUpdate({
        ...values,
        dataType: "basic",
        id: data._id,
      })
        .then((res) => {
          setLoading(false);
          Swal.fire({
            title: res.message,
            icon: "success",
          });
          navigation("/finance/investor");
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      financeCreate({ ...values })
        .then((res) => {
          setLoading(false);
          Swal.fire({
            title: res.message,
            icon: "success",
          });
          navigation("/finance/investor");
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const handelIfsc = (e, setFieldValue) => {
    setFieldValue("ifsc", e.target.value.toUpperCase());
    if (e.target.value.length === 11) {
      setLoading(true);
      findIFSC(e.target.value)
        .then((res) => {
          const data = res.data;

          setFieldValue("bankName", data.BANK);
          setFieldValue("bankBranchName", data.BRANCH);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  return (
    <>
      {loading && <Loader />}
      <Formik
        onSubmit={handelSubmit}
        initialValues={initialValues}
        validationSchema={financeSchema}
        enableReinitialize
      >
        {({ handleSubmit, setFieldValue, resetForm }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex flex-column ">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <div className="grid p-3">
                  <div className="col-12 md:col-3">
                    <Field label="Name" component={InputField} name="name" />
                  </div>

                  <div className="col-12 md:col-3">
                    <Field
                      label="Mobile"
                      component={InputField}
                      name="mobile"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field label="Email" component={InputField} name="email" />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Date Of Birth"
                      component={DateField}
                      name="dob"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Aadhar Nummber"
                      component={InputField}
                      name="aadharNumber"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Pan number"
                      component={InputField}
                      name="panNumber"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Investment Type"
                      component={DropdownField}
                      options={InvestmentTypes}
                      name="investmentType"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Investment Amount"
                      component={InputField}
                      name="investmentAmount"
                      keyfilter="money"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Duration (In months)"
                      component={InputField}
                      name="duration"
                      keyfilter="int"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Interest Rate/Month"
                      component={InputField}
                      name="interestRate"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Payout Frequency"
                      component={DropdownField}
                      options={PayoutFrequencies}
                      name="payoutFrequency"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Payout Date"
                      component={DateField}
                      name="payoutDate"
                      dateFormat="dd"
                      view="date"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="IFSC Code"
                      component={InputField}
                      name="ifsc"
                      onChange={(e) => handelIfsc(e, setFieldValue)}
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Bank Name"
                      component={InputField}
                      name="bankName"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Branch Name"
                      component={InputField}
                      name="bankBranchName"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Account Number"
                      component={InputField}
                      name="accountNumber"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Account Name"
                      component={InputField}
                      name="accountName"
                    />
                  </div>
                  <div className="flex pt-4 justify-content-end gap-2 col-12">
                    <Button
                      type="button"
                      label={"Cancel"}
                      severity="danger"
                      onClick={() => resetForm()}
                    />
                    <Button type="submit" label={"Submit "} />
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

export default AddInvestor;
