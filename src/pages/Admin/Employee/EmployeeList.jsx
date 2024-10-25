/* eslint-disable no-prototype-builtins */
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAddUser } from "../../../store/reducer/AddUserReducer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useRef, useState } from "react";
import { employeeDataTable } from "./AddUserService";
import Loader from "../../../component/Loader";
import { Tag } from "primereact/tag";
import { RoleSeverityColor } from "../../../shared/Config";
import { setSearch } from "../../../store/reducer/searchReducer";
import CPaginator from "../../../component/CPaginator";
import EmployeeSearch from "./EmployeeSearch";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import PasswordChange from "../../../layout/PasswordChange";

const EmployeeList = () => {
  const menuRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchKey = useSelector((state) => state?.search?.value);
  const [loading, setLoading] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchShow, setSearchShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectData, setSelectData] = useState({});

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
            label="Add Employee"
            icon="pi pi-user-plus"
            onClick={() => {
              navigate("/employee/add");
              dispatch(setAddUser({ type: "add", role: "employee" }));
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

  const positionTemplate = (item) => {
    const { label, severity } = RoleSeverityColor(item.position);
    return <Tag severity={severity} value={label} rounded />;
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
  const menuTemplate = [
    {
      //   label: "Profile",
      items: [
        {
          label: "View Employee",
          command: () => {
            navigate(`/employee/view/${selectData._id}`);
          },
        },
        {
          label: "Edit Employee",
          command: () => {
            navigate("/employee/edit");
            dispatch(
              setAddUser({ type: "edit", role: "employee", id: selectData._id })
            );
          },
        },
        {
          label: "Change Password",

          command: () => {
            setVisible(true);
          },
        },
      ],
    },
  ];

  const dislogeClose = () => {
    setVisible(false);
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
      {searchShow && <EmployeeSearch />}
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3 mb-6">
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
          <Column field="employeeId" header="Employe ID" sortable />
          <Column field="name" header="Name" sortable />
          <Column field="username" header="Username" sortable />
          <Column
            field="position"
            header="Position"
            body={positionTemplate}
            sortable
          />
          <Column
            field="isActive"
            header="Status"
            body={statusTemplate}
            sortable
          />

          <Column field="branchCode" header="Branch Code" sortable />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
        <CPaginator totalRecords={totalCount} />
      </div>
      <Dialog
        header={"Reset Password"}
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => {
          setVisible(false);
        }}
      >
        <PasswordChange
          type={"employee"}
          id={selectData._id}
          dislogeClose={dislogeClose}
        />
      </Dialog>
    </>
  );
};

export default EmployeeList;
