import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAddUser } from "../../../store/reducer/AddUserReducer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
        <DataTable
          value={[]}
          header={header}
          tableStyle={{ minWidth: "60rem" }}
        >
          <Column field="companyName" header="SlNo." />
          <Column field="companyName" header="EmployeeId" />
          <Column field="companyName" header="Name" />
          <Column field="position" header="Username" />
          <Column field="startingYear" header="Position" />
          <Column field="endingYear" header="Status" />
          <Column field="endingYear" header="Branch" />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </div>
    </>
  );
};

export default EmployeeList;
