/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useRef, useState } from "react";
import Loader from "../../../component/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoan } from "../../../store/reducer/AddLoanReducer";
import { Dialog } from "primereact/dialog";
import {
  applicationDelete,
  applicationList,
  applicationUpdate,
} from "./LoanService";
import { Dropdown } from "primereact/dropdown";
import { countryList } from "../AddUser/AddUserService";
import { loanTypeGetList } from "../setting/SettingService";
import CPaginator from "../../../component/CPaginator";
import {
  AddLoanPath,
  EditLoanPath,
  LoanApplicationSteps,
  LoanApplicationStepsEnum,
  LoantatusSeverityColor,
} from "../../../shared/Config";
import { Tag } from "primereact/tag";
import { Menu } from "primereact/menu";
import Swal from "sweetalert2";
import { Field, Form, Formik } from "formik";
import {
  DateField,
  DropdownField,
  InputField,
  TextAreaInputField,
} from "../../../component/FieldType";
import * as Yup from "yup";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { setSearch } from "../../../store/reducer/searchReducer";
import LoanSearch from "./LoanSearch";

const ApplicationStatusSchema = Yup.object().shape({
  status: Yup.string().required("Application status is required"),
  remark: Yup.string().required("Application remark is required"),
  interestRate: Yup.string().when("status", {
    is: (val) => val === LoanApplicationStepsEnum.DISBURSED,
    then: () => Yup.string().required("Interest rate is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  emiDate: Yup.string().when("status", {
    is: (val) => val === LoanApplicationStepsEnum.DISBURSED,
    then: () => Yup.string().required("EMI date is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  transactionNumber: Yup.string().when("status", {
    is: (val) => val === LoanApplicationStepsEnum.DISBURSED,
    then: () => Yup.string().required("Transaction Number is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
});
const LoanList = (props) => {
  const menuRef = useRef();
  const dispatch = useDispatch();
  const loanDetails = useSelector((state) => state.loan.addLoan);
  const userDetails = useSelector((state) => state.user.user.data);
  const searchKey = useSelector((state) => state?.search?.value);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [selectCountry, setSelectCountry] = useState(userDetails.country);
  const [loanTypeOption, setLoanTypeOption] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [actionType, setActionType] = useState("country");
  const [total, setTotal] = useState(0);
  const [selectedItem, setSelectedItem] = useState({});
  const [searchShow, setSearchShow] = useState(false);

  useEffect(() => {
    if (searchKey?.page === props.type) {
      dispatch(setSearch({ ...searchKey }));
    } else {
      dispatch(
        setSearch({
          page: props.type,
          filterOptions: {},
          pageNumber: 1,
          firstPage: 0,
          rows: 10,
          sortOrder: 1,
          sortField: "name",
        })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getApplicationList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loanTypeDetails = (country) => {
    loanTypeGetList({ country: country })
      .then((res) => {
        setLoanTypeOption(res.data);
        setActionType("loanType");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const getApplicationList = () => {
    setLoading(true);
    let reqData = {
      page: searchKey?.pageNumber,
      limit: searchKey?.rows,
      sort:
        searchKey.hasOwnProperty("sortField") &&
        searchKey.hasOwnProperty("sortOrder")
          ? { [searchKey.sortField]: searchKey.sortOrder }
          : { name: 1 },
      applicationStaus: props.type,
    };
    if (Object.keys(searchKey?.filterOptions).length > 0) {
      reqData = { ...reqData, ...searchKey?.filterOptions };
    }

    applicationList(reqData)
      .then((res) => {
        setList(res.data);
        setTotal(res.count);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">{props.labelName}</span>
        <div className="flex gap-2">
          {searchShow ? (
            <Button
              icon="pi pi-times"
              severity="help"
              label="Hide"
              onClick={() => {
                setSearchShow(!searchShow);
              }}
            />
          ) : (
            <Button
              label="Search"
              icon="pi pi-search"
              onClick={() => {
                setSearchShow(!searchShow);
              }}
              severity="secondary"
            />
          )}
          {props.show && (
            <Button
              label="Add Application"
              icon="pi pi-plus"
              onClick={() => {
                dispatch(setAddLoan({ type: "add" }));
                setVisible(true);
              }}
            />
          )}
        </div>
      </div>
    );
  };
  const actionBodyTemplate = (item) => {
    return (
      <>
        <Button
          icon="pi pi-ellipsis-v"
          rounded
          text
          aria-label="Filter"
          aria-controls="popup_menu_right"
          aria-haspopup
          onClick={(event) => {
            menuRef.current.toggle(event);
            setSelectedItem(item);
          }}
        />
      </>
    );
  };

  const handelLoanNavigation = (item) => {
    dispatch(
      setAddLoan({
        ...loanDetails,
        loanType: { ...item, country: selectCountry },
      })
    );
    navigate(AddLoanPath(item.entity));
  };

  const handelSubmit = () => {
    // setLoading(true);
    loanTypeDetails(selectCountry);
  };

  const branchTemplate = (item) => {
    return (
      <div>
        {item.branchDetails.name} ({item.branchDetails.code})
      </div>
    );
  };

  const statusTemplate = (item) => {
    const { label, severity } = LoantatusSeverityColor(item.status);
    return (
      <Tag severity={severity} value={label} style={{ fontSize: "10px" }} />
    );
  };

  const menuTemplate = [
    {
      //   label: "Profile",
      items: [
        {
          label: "Edit Application",
          command: () => {
            navigate(EditLoanPath(selectedItem.loanDetails.entity));
            dispatch(
              setAddLoan({
                type: "edit",
                loanType: {},
                loanId: selectedItem._id,
                data: {},
              })
            );
          },
        },
        {
          label: "Status Change",
          visible: selectedItem.status !== LoanApplicationStepsEnum.INCOMPLETED,
          command: () => {
            setStatusVisible(true);
          },
        },
        {
          label: "Application Delete",
          command: () => {
            confirm();
          },
        },
      ],
    },
  ];

  const accept = () => {
    setLoading(true);
    setLoading(true);
    applicationDelete({ _id: selectedItem._id })
      .then((res) => {
        Swal.fire({
          title: res.message,
          icon: "success",
        });
        setLoading(false);

        getApplicationList();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const reject = () => {};
  const confirm = () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => accept(),
      reject,
    });
  };

  const handelStatusChange = (values) => {
    setLoading(true);
    applicationUpdate({
      _id: selectedItem._id,
      status: values.status,
      remark: values.remark,
      interestRate: values.interestRate,
      emiDate: values.emiDate,
      transactionNumber: values.transactionNumber,
      applicationType: "status",
    })
      .then((res) => {
        Swal.fire({
          title: res.message,
          icon: "success",
        });
        setLoading(false);
        setStatusVisible(false);
        getApplicationList();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onSort = (e) => {
    setLoading(true);
    const { sortField, sortOrder } = e;
    dispatch(
      setSearch({
        ...searchKey,
        sortOrder: sortOrder,
        sortField: sortField,
      })
    );

    setList([]);
  };

  const rowNumberTemplate = (rowData, rowIndex) => {
    return (searchKey.pageNumber - 1) * searchKey.rows + rowIndex.rowIndex + 1;
  };
  return (
    <>
      {loading && <Loader />}
      <ConfirmDialog />
      <Menu
        model={menuTemplate}
        popup
        ref={menuRef}
        id="popup_menu_right"
        popupAlignment="right"
      />

      {searchShow && <LoanSearch />}
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3 mb-6">
        <DataTable
          value={list}
          header={header}
          // tableStyle={{ minWidth: "60rem" }}
          dataKey="_id"
          emptyMessage="No data found."
          filterDisplay="row"
          onSort={onSort}
          sortOrder={searchKey.sortOrder}
          sortField={searchKey.sortField}
        >
          <Column field="" header="SLNo." body={rowNumberTemplate} />
          <Column field="applicationNumber" header="Application Number" />
          <Column field="name" header="Name" sortable />
          <Column field="mobile" header="Mobile" sortable />
          <Column
            field="loanDetails.name"
            header="Type"
            sortable
            sortField="loanDetails.name"
          />
          <Column field="loanAmount" header="Amount" />
          <Column
            field="branchDetails.name"
            header="Branch"
            body={branchTemplate}
            sortable
            sortField="branchDetails.name"
          />
          <Column field="status" header="Status" body={statusTemplate} />
          <Column field="remark" header="Remark" />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
        <CPaginator totalRecords={total} />
      </div>
      <Dialog
        header={"Status Change"}
        visible={statusVisible}
        style={{ width: "50vw" }}
        onHide={() => {
          setStatusVisible(false);
        }}
      >
        <Formik
          onSubmit={handelStatusChange}
          initialValues={{
            status: "",
            remark: "",
            interestRate: "",
            emiDate: "",
            transactionNumber: "",
          }}
          validationSchema={ApplicationStatusSchema}
        >
          {({ handleSubmit, values }) => (
            <Form onSubmit={handleSubmit}>
              <div className="border-2 border-dashed surface-border border-round surface-ground  font-medium">
                <div className="grid p-3">
                  <div className="col-12 md:col-12">
                    <Field
                      label="Status"
                      component={DropdownField}
                      name="status"
                      options={LoanApplicationSteps}
                      filter
                    />
                  </div>
                  {values.status === LoanApplicationStepsEnum.DISBURSED && (
                    <>
                      <div className="col-12 md:col-6">
                        <Field
                          label="EMI Date"
                          component={DateField}
                          name="emiDate"
                        />
                      </div>

                      <div className="col-12 md:col-6">
                        <Field
                          label="Interest Rate/Month"
                          component={InputField}
                          name="interestRate"
                        />
                        {values.interestRate && (
                          <span
                            className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer"
                            onClick={() =>
                              navigate("/emi/calculator", {
                                state: {
                                  data: {
                                    loanAmount: selectedItem.loanAmount,
                                    loanTenure: selectedItem.loanTenure,
                                    interestRate: values.interestRate,
                                  },
                                },
                              })
                            }
                          >
                            Check EMI Details?
                          </span>
                        )}
                      </div>
                      <div className="col-12 md:col-12">
                        <Field
                          label="Transaction Number"
                          component={InputField}
                          name="transactionNumber"
                        />
                      </div>
                    </>
                  )}

                  <div className="col-12 md:col-12">
                    <Field
                      label="Remark"
                      component={TextAreaInputField}
                      rows={2}
                      cols={15}
                      name="remark"
                    />
                  </div>
                  <div className="col-12 md:col-12 ">
                    <Button
                      label="Submit"
                      type="submit"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Dialog
        header={
          actionType === "loanType" ? "Select Loan Type" : "Select Country"
        }
        visible={visible}
        style={{ width: actionType === "loanType" ? "50vw" : "25vw" }}
        onHide={() => {
          setVisible(false);
          setLoanTypeOption([]);
          setActionType("country");
        }}
      >
        <div className="surface-0">
          <div className="grid">
            {actionType === "loanType" ? (
              <>
                {loanTypeOption.length > 0 ? (
                  loanTypeOption.map((item, index) => {
                    return (
                      <div
                        className="col-12 md:col-3 mb-2 px-3 text-center"
                        key={index}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          handelLoanNavigation(item);
                        }}
                      >
                        <span
                          className="p-3 shadow-2 mb-3 inline-block"
                          style={{ borderRadius: "10px" }}
                        >
                          <i
                            className={`pi ${item.icon} text-4xl text-blue-500`}
                          ></i>
                        </span>
                        <div className="text-900 text-xl mb-3 font-medium">
                          {item.name}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12 m-2 px-3 text-center">
                    No loan availbale for this country
                  </div>
                )}
              </>
            ) : (
              <>
                {" "}
                <div className="col-12 md:col-12 m-2 ">
                  <Dropdown
                    filter
                    value={selectCountry}
                    onChange={(e) => setSelectCountry(e.value)}
                    options={countryData}
                    placeholder="Select a country"
                    className="w-full md:w-18rem"
                  />
                </div>
                <div className="col-12 md:col-12 m-2 ">
                  <Button
                    label="Submit"
                    className="w-full md:w-18rem"
                    onClick={handelSubmit}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default LoanList;
