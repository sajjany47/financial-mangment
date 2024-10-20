/* eslint-disable no-prototype-builtins */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Menu } from "primereact/menu";
import { Dialog } from "primereact/dialog";
import moment from "moment";
import { Dropdown } from "primereact/dropdown";
import Swal from "sweetalert2";
import { InputTextarea } from "primereact/inputtextarea";
import { useNavigate } from "react-router-dom";
import { setSearch } from "../../../store/reducer/searchReducer";
import { Position } from "../../../shared/Config";
import { Currency } from "../../../component/FieldType";
import Loader from "../../../component/Loader";
import LoanSearch from "../Loan/LoanSearch";
import {
  BranchAgentList,
  PaidDetails,
  PaymentDetails,
  RemarkAndAgentUpdate,
} from "../Loan_Management/ManageService";
import { capitalizeFirstLetter } from "../../../shared/constant";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";

const PaymentList = (props) => {
  const menuRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.user.user.data);
  const searchKey = useSelector((state) => state?.search?.value);
  const [loading, setLoading] = useState(false);
  const [upcomingList, setUpcomingList] = useState([]);
  const [defaulterList, setDefaulterList] = useState([]);
  const [paidList, setPaidList] = useState([]);

  const [dUpcomingList, setDupcomingList] = useState([]);
  const [dDefaulterList, setDdefaulterList] = useState([]);
  const [DPaidList, setDpaidList] = useState([]);

  const [date, setDate] = useState([
    new Date(moment().startOf("month")),
    new Date(moment().endOf("month")),
  ]);
  const [selectedItem, setSelectedItem] = useState({});
  const [searchShow, setSearchShow] = useState(false);
  const [agentList, setAgentList] = useState([]);
  const [selectAgent, setSelectAgent] = useState("");
  const [addRemark, setAddRemark] = useState("");
  const [actionType, setActionType] = useState("");
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
    props.type === "history"
      ? LoanPaidList()
      : props.type === "upcoming" && date[1] !== null
      ? getApplicationList()
      : "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const branchAgentList = (branchId) => {
    BranchAgentList(branchId).then((res) => {
      setAgentList(
        res.data.map((item) => ({
          label: `${item.name} (${capitalizeFirstLetter(
            item.position.replace(/-/g, " ")
          )}-${item.branchDetails.code})`,
          value: item._id,
        }))
      );
    });
  };

  const getApplicationList = () => {
    setLoading(true);
    PaymentDetails(
      props.type === "upcoming" ? { startDate: date[0], endDate: date[1] } : {}
    )
      .then((res) => {
        const filterUpcomingList = res?.data.filter(
          (item) =>
            item.isPaid === false && new Date(item.emiDate) >= new Date()
        );
        setUpcomingList(filterUpcomingList);
        setDupcomingList(filterUpcomingList);

        const filterDefaulterList = res?.data.filter(
          (item) =>
            item.isPaid === false && new Date(item.emiDate) <= new Date()
        );
        setDefaulterList(filterDefaulterList);
        setDdefaulterList(filterDefaulterList);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const LoanPaidList = () => {
    setLoading(true);
    PaidDetails({})
      .then((res) => {
        setPaidList(res?.data);
        setDpaidList(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const menuTemplate = [
    {
      //   label: "Profile",
      items: [
        {
          label: "View Application",
          command: () => {
            console.log(selectedItem);
          },
        },
        {
          label: "Add Remark",
          visible: props.type !== "history",
          command: () => {
            setActionType("remark");
            setVisible(true);
          },
        },
        {
          label: "Loan Payment",
          visible: props.type !== "history",
          command: () => {
            navigate(`/loans/payment/${selectedItem.loanId}`);
          },
        },
        {
          label: "Assign Agent",
          visible:
            props.type === "defaulter" &&
            (userDetails.position === Position.ADMIN ||
              userDetails.position === Position.SM ||
              userDetails.position === Position.CM ||
              userDetails.position === Position.BM),
          command: () => {
            setActionType("agent");
            branchAgentList(selectedItem.branchId);
            setVisible(true);
          },
        },
      ],
    },
  ];
  const handelSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    const duplicateData =
      props.type === "upcoming"
        ? dUpcomingList
        : props.type === "history"
        ? DPaidList
        : props.type === "defaulter"
        ? dDefaulterList
        : [];
    const filteredData = duplicateData.filter((item) => {
      return Object.values(item).some((val) => {
        // Convert to string, check for the search term in any field
        return val.toString().toLowerCase().includes(value);
      });
    });
    props.type === "upcoming"
      ? setUpcomingList(filteredData)
      : props.type === "history"
      ? setPaidList(filteredData)
      : props.type === "defaulter"
      ? setDefaulterList(filteredData)
      : [];
  };
  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">{props.labelName}</span>
        <div className="flex gap-2">
          <InputText
            value={searchValue}
            onChange={handelSearch}
            placeholder="Search"
          />
          {props.type === "upcoming" && (
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value)}
              showButtonBar
              selectionMode="range"
              placeholder="Select Date"
            />
          )}

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

  const handelSubmit = () => {
    setLoading(true);
    let reqData =
      actionType === "agent"
        ? {
            assignAgent: selectAgent,
          }
        : { agentRemark: addRemark };

    RemarkAndAgentUpdate({
      ...reqData,
      type: actionType,
      loanId: selectedItem.loanId,
    })
      .then((res) => {
        setLoading(false);
        Swal.fire({ title: res.message, icon: "success" });
        setVisible(false);
        getApplicationList();
        setAddRemark("");
        setSelectAgent("");
        setActionType("");
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const remarkTemplate = (data) => {
    return (
      <div
        onClick={() =>
          navigate("/remark/details", { state: { data: { _id: data.loanId } } })
        }
        style={{ cursor: "pointer" }}
        className="hover:text-primary"
      >
        {data?.agentRemark ? data.agentRemark.length : null}
      </div>
    );
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
          value={
            props.type === "upcoming"
              ? upcomingList
              : props.type === "history"
              ? paidList
              : props.type === "defaulter"
              ? defaulterList
              : []
          }
          header={header}
          // tableStyle={{ minWidth: "60rem" }}
          dataKey="loanId"
          emptyMessage="No data found."
          filterDisplay="row"
        >
          {/* <Column field="" header="SLNo." body={rowNumberTemplate} /> */}
          <Column field="applicationNumber" header="Application Number" />
          <Column field="name" header="Name" sortable />
          <Column field="mobile" header="Mobile" sortable />
          <Column
            header="Branch"
            body={(item) => (
              <>
                {item.branchName} ({item.branchCode})
              </>
            )}
            sortable
            sortField="branchDetails.name"
          />
          <Column
            field="emiAmount"
            header="EMI"
            body={(item) => <> {Currency(item?.emiAmount)}</>}
          />
          <Column
            field="emiAmount"
            header="EMI Date"
            body={(item) => <>{moment(item.emiDate).format("DD MMM, YYYY")}</>}
          />

          {props.type === "defaulter" && (
            <Column field="overdueDays" header="Overdue Days" />
          )}
          <Column
            field="payableAmount"
            header="Payable Amount"
            body={(item) => (
              <>
                {" "}
                {Currency(
                  item?.payableAmount ? item?.payableAmount : item?.emiAmount
                )}
              </>
            )}
          />
          {props.type === "history" && (
            <Column field="transactionNumber" header="Transaction Number" />
          )}
          {props.type === "defaulter" && (
            <Column field="assignAgentUsername" header="Assign Agent" />
          )}
          {props.type === "defaulter" && (
            <Column field="remark" header="Remark" body={remarkTemplate} />
          )}

          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </div>

      <Dialog
        header={actionType === "agent" ? "Select Select Agent" : "Add Remark"}
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => {
          setVisible(false);
          setAddRemark("");
          setSelectAgent("");
          setActionType("");
        }}
      >
        <div className="surface-0">
          <div className="grid">
            {actionType === "agent" ? (
              <div className="col-12 md:col-12 m-2 ">
                <Dropdown
                  filter
                  value={selectAgent}
                  onChange={(e) => setSelectAgent(e.value)}
                  options={agentList}
                  placeholder="Select a agent"
                  className="w-full"
                />
              </div>
            ) : (
              <div className="col-12 md:col-12 m-2 ">
                <InputTextarea
                  value={addRemark}
                  onChange={(e) => setAddRemark(e.target.value)}
                  rows={5}
                  cols={30}
                  placeholder="Add Remark"
                  className="w-full"
                />
              </div>
            )}

            <div className="col-12 md:col-12 m-2 ">
              <Button
                label="Submit"
                className="w-full"
                onClick={handelSubmit}
                disabled={
                  actionType === "agent"
                    ? selectAgent === ""
                      ? true
                      : false
                    : addRemark !== ""
                    ? false
                    : true
                }
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default PaymentList;
