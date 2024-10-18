/* eslint-disable no-prototype-builtins */
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";
import Loader from "../../../component/Loader";
import { Field, Form, Formik } from "formik";
import { DropdownField, InputField } from "../../../component/FieldType";
import { branchList } from "../Branch/BranchService";
import {
  applicationCreate,
  applicationDelete,
  applicationList,
  applicationUpdate,
} from "./LoanService";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { loanTypeGetList } from "../setting/SettingService";
import { LoanApplicationStepsEnum, Position } from "../../../shared/Config";
import CPaginator from "../../../component/CPaginator";
import { Menu } from "primereact/menu";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { setSearch } from "../../../store/reducer/searchReducer";
import LoanSearch from "./LoanSearch";

const leadSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required"),
  mobile: Yup.string().required("Mobile number is required"),
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
  const menuRef = useRef();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user?.user.data);
  const searchKey = useSelector((state) => state?.search?.value);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [branch, setBranch] = useState([]);
  const [actionType, setActionType] = useState("add");
  const [selectData, setSelectData] = useState({});
  const [loanTypeOption, setLoanTypeOption] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchShow, setSearchShow] = useState(false);

  useEffect(() => {
    if (searchKey?.page === "lead") {
      dispatch(setSearch({ ...searchKey }));
    } else {
      dispatch(
        setSearch({
          page: "lead",
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

  const initialValues =
    actionType === "add"
      ? {
          name: "",
          mobile: "",
          email: "",
          state: "",
          country: "",
          city: "",
          loanType: "",
          loanAmount: "",
          loanTenure: "",
          monthlyIncome: "",
          branch:
            userDetails.position === Position.ADMIN ||
            userDetails.position === Position.SM ||
            userDetails.position === Position.CM
              ? ""
              : userDetails.branch,
          userType: userDetails.position,
          applicationType: "lead",
        }
      : {
          name: selectData.name,
          mobile: selectData.mobile,
          email: selectData.email,
          state: selectData.state,
          country: selectData.country,
          city: selectData.city,
          loanType: selectData.loanType,
          loanAmount: selectData.loanAmount,
          loanTenure: selectData.loanTenure,
          monthlyIncome: selectData.monthlyIncome,
          branch: selectData.branch,
          userType: userDetails.position,
          applicationType: "lead",
        };
  useEffect(() => {
    getBranchList({});
    getLeadList();
    getLoanTypeList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);
  const getLoanTypeList = () => {
    loanTypeGetList(
      userDetails.position === Position.ADMIN
        ? {}
        : { country: userDetails.country }
    )
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
    let reqData = {
      page: searchKey?.pageNumber,
      limit: searchKey?.rows,
      sort:
        searchKey.hasOwnProperty("sortField") &&
        searchKey.hasOwnProperty("sortOrder")
          ? { [searchKey.sortField]: searchKey.sortOrder }
          : { name: 1 },
      applicationStaus: "lead",
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

  const getBranchList = () => {
    const payload =
      userDetails.position === Position.ADMIN
        ? {}
        : userDetails.position === Position.SM
        ? { country: userDetails.country, state: userDetails.state }
        : {
            country: userDetails.country,
            state: userDetails.state,
            city: userDetails.city,
          };
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

  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">{"Lead List"}</span>
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
          <Button
            label="Add Lead"
            icon="pi pi-plus"
            onClick={() => {
              setActionType("add");
              setVisible(true);
            }}
          />
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
            setSelectData(item);
          }}
        />
      </>
    );
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
          getLeadList();
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  const accept = () => {
    setLoading(true);
    setLoading(true);
    applicationDelete({ _id: selectData._id })
      .then((res) => {
        Swal.fire({
          title: res.message,
          icon: "success",
        });
        setLoading(false);

        getLeadList();
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
  const menuTemplate = [
    {
      //   label: "Profile",
      items: [
        {
          label: "Edit Lead",
          command: () => {
            setActionType("edit");
            setVisible(true);
          },
        },
        {
          label: "Convert To Application",

          command: () => {
            setLoading(true);
            applicationUpdate({
              _id: selectData._id,
              status: LoanApplicationStepsEnum.INCOMPLETED,
              applicationType: "status",
              remark: `Lead converted by ${userDetails.username}`,
              loanAllotAgent: true,
            })
              .then((res) => {
                Swal.fire({
                  title: res.message,
                  icon: "success",
                });
                setLoading(false);
                getLeadList();
              })
              .catch(() => {
                setLoading(false);
              });
          },
        },
        {
          label: "Lead Delete",
          command: () => {
            confirm();
          },
        },
      ],
    },
  ];

  const branchTemplate = (item) => {
    return (
      <div>
        {item.branchDetails.name} ({item.branchDetails.code})
      </div>
    );
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
      {searchShow && <LoanSearch />}
      <ConfirmDialog />
      <Menu
        model={menuTemplate}
        popup
        ref={menuRef}
        id="popup_menu_right"
        popupAlignment="right"
      />
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
          <Column field="applicationNumber" header="Lead Number" />
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
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
        <CPaginator totalRecords={total} />
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
          {({ handleSubmit }) => (
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
                        keyfilter="money"
                      />
                    </div>
                    <div className="col-12 md:col-4">
                      <Field
                        label="Loan Tenure (In months)"
                        component={InputField}
                        name="loanTenure"
                        keyfilter="int"
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
