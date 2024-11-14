/* eslint-disable no-prototype-builtins */

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../../../store/reducer/searchReducer";
import { financeReedemApply, InvestorDatatable } from "./FinanceService";
import { Button } from "primereact/button";
import Loader from "../../../component/Loader";
import { Menu } from "primereact/menu";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  Currency,
  DateField,
  DropdownField,
  InputField,
} from "../../../component/FieldType";
import moment from "moment";
import CPaginator from "../../../component/CPaginator";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { PayoutFrequencies } from "../../../shared/Config";
import { Tag } from "primereact/tag";
import FinanceSearch from "./FinanceSearch";

const validationSchema = Yup.object({
  investmentAmount: Yup.string().required("Investment Amount is required"),
  reedemAmount: Yup.string().required("Reedem amount is required"),
  reedemDate: Yup.date().required("Reedem date is required"),
  remainingInvestAmount: Yup.string().required(
    "Remaining invested amount is required"
  ),
  duration: Yup.string().when("remainingInvestAmount", {
    is: (values) => Number(values) !== 0,
    then: () => Yup.string().required("Duration is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  interestRate: Yup.string().when("remainingInvestAmount", {
    is: (values) => Number(values) !== 0,
    then: () => Yup.string().required("Interest Rate is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  payoutFrequency: Yup.string().when("remainingInvestAmount", {
    is: (values) => Number(values) !== 0,
    then: () => Yup.string().required("Payout frequency is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  payoutDate: Yup.string().when("remainingInvestAmount", {
    is: (values) => Number(values) !== 0,
    then: () => Yup.string().required("Payout date is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
});
const Investor = () => {
  const navigation = useNavigate();
  const menuRef = useRef();
  const dispatch = useDispatch();
  const searchKey = useSelector((state) => state?.search?.value);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchShow, setSearchShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchKey?.page === "investor") {
      dispatch(setSearch({ ...searchKey }));
    } else {
      dispatch(
        setSearch({
          page: "investor",
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
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);
  const getList = () => {
    setLoading(true);
    let reqData = {
      page: searchKey?.pageNumber,
      limit: searchKey?.rows,
      sort:
        searchKey.hasOwnProperty("sortField") &&
        searchKey.hasOwnProperty("sortOrder")
          ? { [searchKey.sortField]: searchKey.sortOrder }
          : { name: 1 },
    };
    if (Object.keys(searchKey?.filterOptions).length > 0) {
      reqData = { ...reqData, ...searchKey?.filterOptions };
    }

    InvestorDatatable(reqData)
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
        <span className="text-xl text-900 font-bold">{"Investor"}</span>
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
            label={"Add Investor"}
            icon="pi pi-plus"
            onClick={() => {
              navigation("/finance/investor/manage", {
                state: { type: "add" },
              });
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
            setSelectedItem(item);
          }}
        />
      </>
    );
  };
  const menuTemplate = [
    {
      //   label: "Profile",
      items: [
        {
          label: "Edit Details",
          command: () => {
            navigation("/finance/investor/manage", {
              state: { type: "edit", id: selectedItem._id },
            });
          },
        },
        {
          label: "Apply Reedem",
          command: () => {
            setVisible(true);
          },
        },
        {
          label: "View Details",
          command: () => {
            navigation(`/finance/investor-details/${selectedItem._id}`);
          },
        },
      ],
    },
  ];
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

  const handelSubmit = (values) => {
    setLoading(true);
    let reqData = {
      _id: selectedItem._id,
      investmentAmount: values.investmentAmount,
      reedemAmount: values.reedemAmount,
      reedemDate: values.reedemDate,
      remainingInvestAmount: values.remainingInvestAmount,
      duration:
        Number(values.remainingInvestAmount) === 0 ? null : values.duration,
      interestRate:
        Number(values.remainingInvestAmount) === 0 ? null : values.interestRate,
      payoutFrequency:
        Number(values.remainingInvestAmount) === 0
          ? null
          : values.payoutFrequency,
      payoutDate:
        Number(values.remainingInvestAmount) === 0 ? null : values.payoutDate,
    };

    financeReedemApply({
      ...reqData,
    })
      .then((res) => {
        setLoading(false);
        setVisible(false);
        Swal.fire({
          title: res.message,
          icon: "success",
        });
        getList();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const statusTemplate = (item) => {
    return (
      <>
        {item?.isInvestorActive ? (
          <Tag severity="success" value="Active" rounded />
        ) : (
          <Tag severity="danger" value="Inactive" rounded />
        )}
      </>
    );
  };
  return (
    <>
      {loading && <Loader />}
      <Menu
        model={menuTemplate}
        popup
        ref={menuRef}
        id="popup_menu_right"
        popupAlignment="right"
      />
      {searchShow && <FinanceSearch isActive={true} />}
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
          <Column field="name" header="Name" sortable />
          <Column field="mobile" header="Mobile" />
          <Column field="investmentType" header="Type" sortable />
          <Column
            field="investmentAmount"
            header="Amount"
            body={(item) => <>{Currency(item?.investmentAmount)}</>}
          />
          <Column field="interestRate" header="Interest(pm %)" />
          <Column field="payoutFrequency" header="Frequency" />

          <Column
            field="payoutDate"
            header="Payout Date"
            body={(item) => (
              <>{moment(item?.payoutDate).format("Do")} every Month</>
            )}
          />
          <Column body={statusTemplate} header="Status" />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
        <CPaginator totalRecords={total} />
      </div>

      <Dialog
        header={"Apply Reedem"}
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          setVisible(false);
        }}
      >
        <Formik
          initialValues={{
            investmentAmount: selectedItem.investmentAmount,
            reedemAmount: "",
            reedemDate: "",
            remainingInvestAmount: "",
            duration: selectedItem.duration,
            interestRate: selectedItem.interestRate,
            payoutFrequency: selectedItem.payoutFrequency,
            payoutDate: "",
          }}
          onSubmit={handelSubmit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex flex-column ">
                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                  <div className="grid p-3">
                    <div className="col-12 md:col-6">
                      <Field
                        label="Investment Amount"
                        component={InputField}
                        name="investmentAmount"
                        disabled
                      />
                    </div>
                    <div className="col-12 md:col-6">
                      <Field
                        label="Reedem Amount"
                        component={InputField}
                        name="reedemAmount"
                        keyfilter="money"
                        onChange={(e) => {
                          setFieldValue("reedemAmount", e.target.value);
                          setFieldValue(
                            "remainingInvestAmount",
                            Number(selectedItem.investmentAmount) -
                              Number(e.target.value)
                          );
                        }}
                      />
                    </div>
                    <div className="col-12 md:col-6">
                      <Field
                        label="Reedem Date"
                        component={DateField}
                        name="reedemDate"
                      />
                    </div>

                    <div className="col-12 md:col-6">
                      <Field
                        label="Remaining Invest Amount"
                        component={InputField}
                        name="remainingInvestAmount"
                        disabled
                      />
                    </div>
                    {values.remainingInvestAmount !== 0 && (
                      <>
                        <div className="col-12 md:col-6">
                          <Field
                            label="Duration (In months)"
                            component={InputField}
                            name="duration"
                            keyfilter="int"
                          />
                        </div>
                        <div className="col-12 md:col-6">
                          <Field
                            label="Interest Rate/Month"
                            component={InputField}
                            name="interestRate"
                          />
                        </div>
                        <div className="col-12 md:col-6">
                          <Field
                            label="Payout Frequency"
                            component={DropdownField}
                            options={PayoutFrequencies}
                            name="payoutFrequency"
                          />
                        </div>
                        <div className="col-12 md:col-6">
                          <Field
                            label="Payout Date"
                            component={DateField}
                            name="payoutDate"
                            dateFormat="dd"
                            view="date"
                          />
                        </div>
                      </>
                    )}

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

export default Investor;
