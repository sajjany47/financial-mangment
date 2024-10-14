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
import { datatable } from "./ManageService";
import LoanSearch from "../Loan/LoanSearch";
import { Position } from "../../../shared/Config";

const ManagementList = (props) => {
  const menuRef = useRef();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.user.data);
  const searchKey = useSelector((state) => state?.search?.value);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
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
          command: () => {},
        },
        {
          label: "Assign Agent",
          visible:
            props.type === "delinquentLoan" &&
            (userDetails.position === Position.ADMIN ||
              userDetails.position === Position.SM ||
              userDetails.position === Position.CM ||
              userDetails.position === Position.BM),
          command: () => {},
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
      <div className="surface-0">
        <ul className="list-none p-0 m-0">
          <li className="flex align-items-center py-3 px-2 flex-wrap justify-content-between">
            <div className="text-500 w-6 md:w-2 font-medium">Paid EMI</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              {rowData.paidEmi}
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 flex-wrap justify-content-between">
            <div className="text-500 w-6 md:w-2 font-medium">Unpaid EMI</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              {rowData.unpaidEmi}
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 flex-wrap justify-content-between">
            <div className="text-500 w-6 md:w-2 font-medium">OverDue EMI</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              {rowData.overDueEmi}
            </div>
          </li>
        </ul>
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
          filterDisplay="row"
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
                {" "}
                {item.branchDetails.name} ({item.branchDetails.code})
              </>
            )}
            sortable
            sortField="branchDetails.name"
          />
          {props.type === "delinquentLoan" && (
            <>
              <Column field="mobile" header="Assign Agent" sortable />
              <Column field="remark" header="Remark" />
            </>
          )}

          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
        <CPaginator totalRecords={total} />
      </div>
    </>
  );
};

export default ManagementList;
