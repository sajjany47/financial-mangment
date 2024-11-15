/* eslint-disable no-prototype-builtins */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Loader from "../../../component/Loader";
import { DataTable } from "primereact/datatable";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../../../store/reducer/searchReducer";
import { Column } from "primereact/column";
import CPaginator from "../../../component/CPaginator";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Menu } from "primereact/menu";
import {
  BranchAgentList,
  datatable,
  RemarkAndAgentUpdate,
} from "./ManageService";
import LoanSearch from "../Loan/LoanSearch";
import { Position } from "../../../shared/Config";
import { Dialog } from "primereact/dialog";
import moment from "moment";
import { Currency } from "../../../component/FieldType";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import Swal from "sweetalert2";
import { InputTextarea } from "primereact/inputtextarea";
import { capitalizeFirstLetter } from "../../../shared/constant";
import { useNavigate } from "react-router-dom";

const ManagementList = (props) => {
  const menuRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.user.user.data);
  const searchKey = useSelector((state) => state?.search?.value);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedItem, setSelectedItem] = useState({});
  const [searchShow, setSearchShow] = useState(false);
  const [emiDialoge, setEmiDialoge] = useState(false);
  const [emiData, setEmiData] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [selectAgent, setSelectAgent] = useState("");
  const [addRemark, setAddRemark] = useState("");
  const [actionType, setActionType] = useState("");
  const [visible, setVisible] = useState(false);

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
      reqData = {
        ...reqData,
        ...searchKey?.filterOptions,
      };
    }

    datatable(reqData)
      .then((res) => {
        setList(res.data);
        setTotal(res.total);
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
            navigate(`/loans/application-view/${selectedItem._id}`);
          },
        },
        {
          label: "Add Remark",
          visible: props.type !== "closedLoan",
          command: () => {
            setActionType("remark");
            setVisible(true);
          },
        },
        {
          label: "Loan Payment",
          visible: props.type !== "closedLoan",
          command: () => {
            navigate(`/loans/payment/${selectedItem._id}`);
          },
        },
        {
          label: "Assign Agent",
          visible:
            props.type === "delinquentLoan" &&
            (userDetails.position === Position.ADMIN ||
              userDetails.position === Position.SM ||
              userDetails.position === Position.CM ||
              userDetails.position === Position.BM),
          command: () => {
            setActionType("agent");
            branchAgentList(selectedItem.branchDetails._id);
            setVisible(true);
          },
        },
      ],
    },
  ];
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

  const emiTemplate = (rowData) => {
    return (
      <div
        className="surface-0"
        onClick={() => {
          setEmiDialoge(true);
          setEmiData(rowData.emiDetails);
        }}
        style={{ cursor: "pointer" }}
      >
        <div className="flex  justify-content-between">
          <div className="text-900 text-sm mb-1 font-medium">Paid EMI</div>
          <span className="text-700 line-height-3 text-primary">
            {rowData.paidEmi}
          </span>
        </div>
        <div className="flex  justify-content-between">
          <div className="text-900 text-sm mb-1 font-medium">Unpaid EMI</div>
          <span className="text-700 line-height-3 text-primary">
            {rowData.unpaidEmi}
          </span>
        </div>
        <div className="flex  justify-content-between">
          <div className="text-900 text-sm mb-1 font-medium">OverDue EMI</div>
          <span className="text-700 line-height-3 text-primary">
            {rowData.overDueEmi}
          </span>
        </div>

        {/* <div className="flex  justify-content-between">
          <div className="text-500 font-medium">Paid EMI</div>
          <div className="text-900 text-primary">{rowData.paidEmi}</div>
        </div>
        <div className="flex  justify-content-between">
          <div className="text-500 font-medium">Unpaid EMI</div>
          <div className="text-900 text-primary">{rowData.unpaidEmi}</div>
        </div>
        <div className="flex  justify-content-between">
          <div className="text-500 font-medium">OverDue EMI</div>
          <div className="text-900 text-primary">{rowData.overDueEmi}</div>
        </div> */}
      </div>
    );
  };

  const forecloseTemplate = (item) => {
    return (
      <>
        {item?.foreclosureAmount === "Not applicable"
          ? item?.foreclosureAmount
          : Currency(item?.foreclosureAmount)}
      </>
    );
  };
  const statusTemplate = (item) => {
    return (
      <>
        {item.isPaid ? (
          <Tag severity="success" value="Yes" rounded />
        ) : (
          <Tag severity="danger" value="No" rounded />
        )}
      </>
    );
  };

  const rowClass = (data) => {
    return {
      // "bg-primary": data.isPaid === false,
      "bg-teal-100 text-teal-900":
        data.isPaid && new Date(data.emiDate) <= new Date(data?.paidOn),
      "bg-red-100 text-red-900":
        new Date(data.emiDate) < new Date() && !data.isPaid,
      "surface-300 text-red-900":
        data.isPaid && new Date(data.emiDate) > new Date(data?.paidOn),
      // new Date(data.emiDate) > new Date(),
    };
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
      loanId: selectedItem._id,
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
        onClick={() => navigate("/remark/details", { state: { data: data } })}
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
          value={list}
          header={header}
          // tableStyle={{ minWidth: "60rem" }}
          dataKey="_id"
          emptyMessage="No data found."
          showGridlines
          onSort={onSort}
          sortOrder={searchKey.sortOrder}
          sortField={searchKey.sortField}
        >
          <Column field="" header="SLNo." body={rowNumberTemplate} />
          <Column field="applicationNumber" header="Application Number" />
          <Column field="name" header="Name" sortable />
          <Column field="mobile" header="Mobile" sortable />
          <Column field="" header="EMI Details" body={emiTemplate} />
          <Column
            field="branchDetails.name"
            header="Branch"
            body={(item) => (
              <>
                {item.branchDetails.name} ({item.branchDetails.code})
              </>
            )}
            sortable
            sortField="branchDetails.name"
          />
          {props.type === "delinquentLoan" && (
            <Column field="assignAgent" header="Assign Agent" />
          )}
          <Column field="remark" header="Remark" body={remarkTemplate} />

          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
        <CPaginator totalRecords={total} />
      </div>

      <Dialog
        header={"Emi Details"}
        visible={emiDialoge}
        style={{ width: "60vw" }}
        onHide={() => {
          setEmiDialoge(false);
          setEmiData([]);
        }}
      >
        <div className="font-medium mt-3 mb-6">
          <DataTable
            value={emiData}
            // tableStyle={{ minWidth: "60rem" }}
            dataKey="_id"
            emptyMessage="No data found."
            showGridlines
            scrollable
            scrollHeight="400px"
            style={{ minWidth: "55rem" }}
            rowClassName={rowClass}
          >
            <Column
              field="emiDate"
              header="Date"
              body={(item) => <>{moment(item?.emiDate).format("DD-MM-YYYY")}</>}
            />
            <Column
              field="emiAmount"
              header="EMI Amount"
              body={(item) => <>{Currency(item?.emiAmount)}</>}
            />
            <Column field="isPaid" header="Paid" body={statusTemplate} />
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
              body={(item) => <>{Currency(item?.remainingOutstanding)}</>}
            />
            <Column
              field="foreclosureAmount"
              header="Foreclosure"
              body={forecloseTemplate}
            />
          </DataTable>
        </div>
      </Dialog>

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

export default ManagementList;
