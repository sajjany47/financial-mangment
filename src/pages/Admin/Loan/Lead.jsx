import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";
import Loader from "../../../component/Loader";
import { Field, Form, Formik } from "formik";
import {
  DropdownField,
  InputField,
  TextAreaInputField,
} from "../../../component/FieldType";
import { city, countryList, state } from "../AddUser/AddUserService";
import { branchList } from "../Branch/BranchService";
import {
  applicationCreate,
  applicationList,
  applicationUpdate,
} from "./LoanService";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { loanTypeGetList } from "../setting/SettingService";

const leadSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  email: Yup.string().required("Email is required"),
  mobile: Yup.string().required("Mobile number is required"),
  address: Yup.string().required("Address is required"),
  pincode: Yup.string().required("Pincode is required"),
  loanAmount: Yup.string().required("Loan amount is required"),
  loanTenure: Yup.string().required("Loan tenure is required"),
  loanType: Yup.string().required("Loan type is required"),
  monthlyIncome: Yup.string().required("Monthly income is required"),
  branch: Yup.string().when("userType", {
    is: (value) => value === "admin",
    then: () => Yup.string().required("Branch is required"),
  }),
});
const Lead = () => {
  const userDetails = useSelector((state) => state.user?.user.data);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [branch, setBranch] = useState([]);
  const [actionType, setActionType] = useState("add");
  const [selectData, setSelectData] = useState({});
  const [loanTypeOption, setLoanTypeOption] = useState([]);

  const initialValues =
    actionType === "add"
      ? {
          name: "",
          mobile: "",
          email: "",
          address: "",
          state: "",
          country: "",
          city: "",
          pincode: "",
          loanType: "",
          loanAmount: "",
          loanTenure: "",
          monthlyIncome: "",
          branch: userDetails.position === "admin" ? "" : userDetails.branch,
          userType: userDetails.position,
          applicationType: "lead",
        }
      : {
          name: selectData.name,
          mobile: selectData.mobile,
          email: selectData.email,
          address: selectData.address,
          state: selectData.state,
          country: selectData.country,
          city: selectData.city,
          pincode: selectData.pincode,
          loanType: selectData.loanType,
          loanAmount: selectData.loanAmount,
          loanTenure: selectData.loanTenure,
          monthlyIncome: selectData.monthlyIncome,
          branch: selectData.branch,
          userType: userDetails.position,
          applicationType: "lead",
        };
  useEffect(() => {
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

    getBranchList({});
    getLeadList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getLoanTypeList = (countrId) => {
    loanTypeGetList({ country: countrId })
      .then((res) => {
        setLoanTypeOption(
          res.data.map((item) => ({
            ...item,
            label: item.name,
            value: item._id,
          }))
        );

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const getLeadList = () => {
    setLoading(true);

    applicationList({ type: "lead" })
      .then((res) => {
        setList(res.data);

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

  const stateList = (country) => {
    state(Number(country))
      .then((res) => {
        setStateData(
          res.data.map((item) => ({
            ...item,
            label: item.name,
            value: item.id,
          }))
        );
      })
      .catch(() => {});
  };

  const cityList = (country, state) => {
    city(Number(country), Number(state))
      .then((res) => {
        setCityData(
          res.data.map((item) => ({
            ...item,
            label: item.name,
            value: item.id,
          }))
        );
      })
      .catch(() => {});
  };

  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">{"Lead List"}</span>

        <Button
          label="Add Application"
          icon="pi pi-plus"
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
            setSelectData(item);
            setActionType("edit");
          }}
        />
      </>
    );
  };

  const handelSate = (setFieldValue, e) => {
    setStateData([]);
    setCityData([]);
    setFieldValue("state", "");
    setFieldValue("city", "");
    setFieldValue("country", e);
    stateList(e);
  };

  const handelCityList = (setFieldValue, e, value) => {
    setCityData([]);
    setFieldValue("city", "");
    setFieldValue("state", e);
    cityList(value.country, e);
  };

  const handelSubmit = (values) => {
    setLoading(true);

    if (actionType === "add") {
      applicationCreate({ ...values })
        .then((res) => {
          Swal.fire({ title: res.message, icon: "success" });
          setLoading(false);
          setVisible(false);
          getLeadList();
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      applicationUpdate({ ...values, _id: selectData._id })
        .then((res) => {
          Swal.fire({ title: res.message, icon: "success" });
          setLoading(false);
          setVisible(false);
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
          <Column field="applicationNumber" header="Lead Number" />
          <Column field="name" header="Name" />
          <Column field="mobile" header="Mobile" />
          <Column field="loanType" header="Type" />
          <Column field="loanAmount" header="Amount" />
          <Column field="loanStatus" header="Status" />
          <Column field="branch" header="Branch" />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </div>

      <Dialog
        header={actionType === "add" ? "Add Lead" : "Edit Lead"}
        visible={visible}
        style={{ width: "60vw" }}
        onHide={() => {
          setVisible(false);
        }}
      >
        <Formik
          onSubmit={handelSubmit}
          initialValues={initialValues}
          validationSchema={leadSchema}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex flex-column ">
                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                  <div className="grid p-3">
                    <div className="col-12 md:col-4">
                      <Field label="Name" component={InputField} name="name" />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        label="Mobile"
                        component={InputField}
                        name="mobile"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Email"
                        component={InputField}
                        name="email"
                      />
                    </div>

                    <div className="col-12 md:col-4">
                      <Field
                        label="Address"
                        component={TextAreaInputField}
                        name="address"
                        rows={2}
                        cols={10}
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Country"
                        component={DropdownField}
                        name="country"
                        options={countryData}
                        filter
                        onChange={(e) => {
                          handelSate(setFieldValue, e.target.value);
                          getLoanTypeList(e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="State"
                        filter
                        component={DropdownField}
                        name="state"
                        options={stateData}
                        onChange={(e) =>
                          handelCityList(setFieldValue, e.target.value, values)
                        }
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="City"
                        component={DropdownField}
                        name="city"
                        filter
                        options={cityData}
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Pincode"
                        component={InputField}
                        name="pincode"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Loan Type"
                        component={DropdownField}
                        name="loanType"
                        options={loanTypeOption}
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Loan Amount"
                        component={InputField}
                        name="loanAmount"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Loan Tenure"
                        component={InputField}
                        name="loanTenure"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Net Monthly Income"
                        component={InputField}
                        name="monthlyIncome"
                      />
                    </div>
                    {userDetails.position === "admin" && (
                      <div className="col-12 md:col-4">
                        <Field
                          label="Branch Name"
                          component={DropdownField}
                          name="branch"
                          filter
                          options={branch}
                        />
                      </div>
                    )}
                  </div>
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

export default Lead;
