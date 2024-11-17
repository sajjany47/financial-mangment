/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import Loader from "../../../../component/Loader";
import {
  DateField,
  DropdownField,
  InputField,
} from "../../../../component/FieldType";
import {
  applicationCreate,
  applicationDetails,
  applicationUpdate,
} from "../LoanService";
import { branchList } from "../../Branch/BranchService";
import Swal from "sweetalert2";
import { setAddLoan } from "../../../../store/reducer/AddLoanReducer";
import * as Yup from "yup";
import { Position } from "../../../../shared/Config";
import { loanTypeList } from "../../Operation_Hub/OperationHubService";

const basicValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  loanAmount: Yup.string().required("Loan amount is required"),
  loanTenure: Yup.string().required("Loan tenure is required"),
  mobile: Yup.string().required("Mobile number is required"),
  email: Yup.string().required("Email is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(Date.now() - 567648000000), "You must be at least 18 years"),
  branch: Yup.string().required("Branch is required"),
  fatherName: Yup.string().required("Father name is required"),
  motherName: Yup.string().required("Mother name is required"),
  loanType: Yup.string().required("Loan type is required"),
});
const PLoanBasic = (props) => {
  const dispatch = useDispatch();
  const loanDetails = useSelector((state) => state.loan.addLoan);
  const userDetails = useSelector((state) => state.user.user.data);
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState([]);
  const [getLoanData, setLoanData] = useState({});
  const [loanTypeOption, setLoanTypeOption] = useState([]);

  useEffect(() => {
    loanTypeDetails();
    if (loanDetails.type === "edit") {
      setLoading(true);
      applicationDetails(loanDetails.loanId)
        .then((res) => {
          setLoanData(res.data);

          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userDetails.position === Position.ADMIN) {
      getBranchList({});
    } else if (userDetails.position === Position.SM) {
      getBranchList({ country: userDetails.country, state: userDetails.state });
    } else {
      getBranchList({
        country: userDetails.country,
        state: userDetails.state,
        city: userDetails.city,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const loanTypeDetails = () => {
    loanTypeList({ isActive: true })
      .then((res) => {
        setLoanTypeOption(
          res.data.map((item) => ({ label: item.name, value: item._id }))
        );

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const getBranchList = (payload) => {
    setLoading(true);
    branchList(payload)
      .then((res) => {
        setBranch(
          res.data.map((item) => ({
            label: `${item.name} (${item.code})`,
            value: item._id,
          }))
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const initialValues =
    loanDetails.type === "edit"
      ? {
          loanAmount: getLoanData.loanAmount,
          loanTenure: getLoanData.loanTenure,
          name: getLoanData.name,
          mobile: getLoanData.mobile,
          email: getLoanData.email,
          dob: getLoanData?.dob ? new Date(getLoanData.dob) : "",
          branch: getLoanData.branch,
          loanType: getLoanData.loanType,
          fatherName: getLoanData.fatherName,
          motherName: getLoanData.motherName,
          applicationType: "basic",
        }
      : {
          applicationType: "basic",
          loanAmount: "",
          loanTenure: "",
          name: "",
          mobile: "",
          email: "",
          dob: "",
          fatherName: "",
          motherName: "",
          branch:
            userDetails.position === Position.SM ||
            userDetails.position === Position.ADMIN
              ? ""
              : userDetails.branch,
          loanType: loanDetails.loanType._id,
        };

  const handelSubmit = (values) => {
    setLoading(true);

    // eslint-disable-next-line react/prop-types
    if (loanDetails.type === "edit") {
      applicationUpdate({
        ...values,
        _id: getLoanData._id,
      })
        .then((res) => {
          setLoading(false);
          Swal.fire({
            title: res.message,
            icon: "success",
          });
          props.next();
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      applicationCreate({ ...values })
        .then((res) => {
          dispatch(
            setAddLoan({
              ...loanDetails,
              loanId: res.data._id,
              data: res.data,
            })
          );
          setLoading(false);
          Swal.fire({
            title: res.message,
            icon: "success",
          });
          props.next();
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  return (
    <>
      {loading && <Loader />}{" "}
      <Formik
        onSubmit={handelSubmit}
        initialValues={initialValues}
        validationSchema={basicValidationSchema}
        enableReinitialize
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex flex-column ">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <div className="grid p-3">
                  <div className="col-12 md:col-3">
                    <Field
                      label="Loan Type"
                      component={DropdownField}
                      name="loanType"
                      options={loanTypeOption}
                      disabled
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Loan Amount"
                      component={InputField}
                      name="loanAmount"
                      keyfilter="money"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Tenure (In months)"
                      component={InputField}
                      name="loanTenure"
                      keyfilter="int"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field label="Name" component={InputField} name="name" />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Mobile"
                      component={InputField}
                      name="mobile"
                      keyfilter="num"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Email"
                      component={InputField}
                      name="email"
                      keyfilter="email"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Date Of Birth"
                      component={DateField}
                      name="dob"
                      maxDate={new Date(Date.now() - 567648000000)}
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Father Name"
                      component={InputField}
                      name="fatherName"
                    />
                  </div>{" "}
                  <div className="col-12 md:col-3">
                    <Field
                      label="Mother Name"
                      component={InputField}
                      name="motherName"
                    />
                  </div>
                  <div className="col-12 md:col-3">
                    <Field
                      label="Branch Name"
                      component={DropdownField}
                      name="branch"
                      filter
                      options={branch}
                      disabled={
                        userDetails.position === Position.SM ||
                        userDetails.position === Position.ADMIN
                          ? false
                          : true
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex pt-4 justify-content-end gap-2 mb-3">
              {loanDetails.type === "edit" && (
                <Button
                  type="button"
                  label={"Next"}
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => props.next()}
                />
              )}
              <Button
                type="submit"
                label={loanDetails.type === "add" ? "Submit & Next" : "Update"}
                icon="pi pi-arrow-right"
                iconPos="right"
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PLoanBasic;
