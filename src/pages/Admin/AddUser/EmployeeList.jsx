import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAddUser } from "../../../store/reducer/AddUserReducer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { employeeDataTable } from "./AddUserService";
import Loader from "../../../component/Loader";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    getEmployeeList();
  }, []);

  const getEmployeeList = () => {
    setLoading(true);
    let reqData = {
      page: 1,
      limit: 10,
      isActive: true,
    };
    employeeDataTable(reqData)
      .then((res) => {
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
  const actionBodyTemplate = () => {
    return <Button icon="pi pi-pencil" rounded text aria-label="Filter" />;
  };
  return (
    <>
      {loading && <Loader />}
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
        <DataTable
          value={employeeList}
          header={header}
          tableStyle={{ minWidth: "60rem" }}
        >
          <Column field="companyName" header="SlNo." />
          <Column field="employeeId" header="EmployeeId" />
          <Column field="name" header="Name" />
          <Column field="username" header="Username" />
          <Column field="position" header="Position" />
          <Column field="isActive" header="Status" />
          <Column field="jobBranchName" header="Branch" />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </div>
    </>
  );
};

export default EmployeeList;
