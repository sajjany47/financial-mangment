/* eslint-disable no-prototype-builtins */
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAddUser } from "../../../store/reducer/AddUserReducer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { employeeDataTable } from "./AddUserService";
import Loader from "../../../component/Loader";
import { Tag } from "primereact/tag";
import {
  ActiveStatus,
  DropdownPosition,
  PAGE_ROW,
  PAGINATOR_DROPDOWN_OPTIONS,
  RoleSeverityColor,
} from "../../../shared/Config";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { setSearch } from "../../../store/reducer/searchReducer";
import { Paginator } from "primereact/paginator";
import { capitalizeFirstLetter } from "../../../shared/constant";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchKey = useSelector((state) => state?.search?.value);
  const [loading, setLoading] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (searchKey?.page === "employee") {
      dispatch(setSearch({ ...searchKey }));
    } else {
      dispatch(
        setSearch({
          page: "employee",
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
    getEmployeeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);

  const getEmployeeList = () => {
    const filters = searchKey?.filterOptions;
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

    if (Object.keys(filters).length > 0) {
      if (filters.hasOwnProperty("name") && filters.name !== "") {
        reqData.name = filters.name;
      }
      if (filters.hasOwnProperty("position") && filters.position !== "") {
        reqData.position = filters.position;
      }
      if (filters.hasOwnProperty("branchCode") && filters.branchCode !== "") {
        reqData.branchCode = filters.branchCode;
      }
      if (filters.hasOwnProperty("employeeId") && filters.employeeId !== "") {
        reqData.employeeId = filters.employeeId;
      }
      if (
        filters.hasOwnProperty("isActive") &&
        filters.isActive !== "" &&
        filters.isActive !== undefined
      ) {
        reqData.isActive = filters.isActive === "active" ? true : false;
      }
      if (
        filters.hasOwnProperty("username") &&
        filters.username !== "" &&
        filters.username !== undefined
      ) {
        reqData.username = filters.username;
      }
    }
    employeeDataTable(reqData)
      .then((res) => {
        setTotalCount(res.count);
        setEmployeeList(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">{"Employee List"}</span>
        <Button
          label="Add Employee"
          icon="pi pi-user-plus"
          onClick={() => {
            navigate("/employee/add");
            dispatch(setAddUser({ type: "add", role: "employee" }));
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
            navigate("/employee/edit");
            dispatch(
              setAddUser({ type: "edit", role: "employee", id: item._id })
            );
          }}
        />
      </>
    );
  };

  const positionTemplate = (item) => {
    const { label, severity } = RoleSeverityColor(item.position);
    return <Tag severity={severity} value={label} rounded />;
  };

  const statusTemplate = (item) => {
    return (
      <>
        {item.isActive ? (
          <Tag severity="success" value="Active" rounded />
        ) : (
          <Tag severity="danger" value="Inactive" rounded />
        )}
      </>
    );
  };

  const statusItemTemplate = (rowData, type) => {
    return (
      <>
        {type === "isActive" ? (
          <>
            {rowData.value === "active" ? (
              <Tag severity="success" value="Active" rounded />
            ) : (
              <Tag severity="danger" value="Inactive" rounded />
            )}
          </>
        ) : type === "position" ? (
          <Tag
            severity={RoleSeverityColor(rowData.value).severity}
            value={RoleSeverityColor(rowData.value).label}
            rounded
          />
        ) : (
          ""
        )}
      </>
    );
  };

  const dropdownFilterTemplate = (options) => {
    const filters = searchKey?.filterOptions;

    return (
      <>
        <Dropdown
          value={filters[options.field] || ""}
          onChange={(e) => onFilter(e, options.field)}
          options={
            options.field === "isActive"
              ? ActiveStatus
              : options.field === "position"
              ? DropdownPosition
              : []
          }
          // showFilterClear={true}

          showClear={filters[options?.field] !== undefined ? true : false}
          itemTemplate={(e) => statusItemTemplate(e, options.field)}
          placeholder={`${capitalizeFirstLetter(options.field)}`}
        />
      </>
    );
  };

  const inputFilterTemplate = (options) => {
    const filters = searchKey?.filterOptions;

    return (
      <>
        <InputText
          value={filters[options.field] || ""}
          onChange={(e) => onFilter(e, options.field)}
          placeholder={`${capitalizeFirstLetter(options.field)}`}
        />
      </>
    );
  };

  const onFilter = (event, field) => {
    let updatedFilters = { ...searchKey?.filterOptions };
    updatedFilters[field] = event.target.value;
    dispatch(
      setSearch({
        ...searchKey,
        pageNumber: 1,
        firstPage: 0,
        filterOptions: updatedFilters,
      })
    );
  };

  const onPageChange = (event) => {
    dispatch(
      setSearch({
        ...searchKey,
        pageNumber: Number(event.page) + 1,
        firstPage: event.first,
        rows: event.rows,
      })
    );
  };

  const paginatorTemplate = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      return (
        <>
          <span
            className="mx-1"
            style={{
              color: "var(--text-color)",
              userSelect: "none",
            }}
          >
            Items per page:{" "}
          </span>
          <Dropdown
            value={options.value}
            options={PAGINATOR_DROPDOWN_OPTIONS}
            onChange={options.onChange}
          />
        </>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} of {options.totalRecords}
        </span>
      );
    },
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

    setEmployeeList([]);
  };

  const rowNumberTemplate = (rowData, rowIndex) => {
    return (searchKey.pageNumber - 1) * searchKey.rows + rowIndex.rowIndex + 1;
  };

  return (
    <>
      {loading && <Loader />}
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
        <DataTable
          value={employeeList}
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
          <Column
            field="employeeId"
            header="Employe Id"
            sortable
            filter
            showFilterMenu={false}
            filterElement={inputFilterTemplate}
          />
          <Column
            field="name"
            header="Name"
            sortable
            filter
            showFilterMenu={false}
            filterElement={inputFilterTemplate}
          />
          <Column
            field="username"
            header="Username"
            sortable
            filter
            showFilterMenu={false}
            filterElement={inputFilterTemplate}
          />
          <Column
            field="position"
            header="Position"
            body={positionTemplate}
            sortable
            filter
            showFilterMenu={false}
            filterElement={dropdownFilterTemplate}
            // headerClassName="text-center"
            // bodyClassName="text-center"
            // alignHeader={"center"}
            // align={"center"}
          />
          <Column
            field="isActive"
            header="Status"
            body={statusTemplate}
            sortable
            filter
            showFilterMenu={false}
            filterElement={dropdownFilterTemplate}
            // headerClassName="text-center"
            // bodyClassName="text-center"
          />
          {/* <Column
            field="branch"
            header="Branch"
            sortable
            filter
            showFilterMenu={false}
          /> */}
          <Column
            field="branchCode"
            header="Branch Code"
            sortable
            filter
            showFilterMenu={false}
            filterElement={inputFilterTemplate}
            // headerClassName="text-center"
            // bodyClassName="text-center"
          />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
        <Paginator
          first={searchKey?.firstPage}
          rows={searchKey?.rows}
          totalRecords={totalCount}
          rowsPerPageOptions={PAGE_ROW}
          template={paginatorTemplate}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default EmployeeList;
