/* eslint-disable no-prototype-builtins */

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../../../store/reducer/searchReducer";
import { financeDatatable } from "./FinanceService";
import { Button } from "primereact/button";
import Loader from "../../../component/Loader";
import { Menu } from "primereact/menu";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Currency } from "../../../component/FieldType";
import moment from "moment";
import CPaginator from "../../../component/CPaginator";
import { useNavigate } from "react-router-dom";

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

    financeDatatable(reqData)
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
          label: "Edit",
          command: () => {
            navigation("/finance/investor/manage", {
              state: { type: "edit", id: selectedItem._id },
            });
          },
        },
        {
          label: "Status Change",

          command: () => {},
        },
        {
          label: "View",
          command: () => {
            confirm();
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
              <>{moment(item?.payoutDate).format("Do")} of Month</>
            )}
          />
          <Column field="payoutStatus" header="Status" />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
        <CPaginator totalRecords={total} />
      </div>
    </>
  );
};

export default Investor;
