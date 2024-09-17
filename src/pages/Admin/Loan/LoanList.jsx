/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import Loader from "../../../component/Loader";
import { useDispatch } from "react-redux";
import { setAddLoan } from "../../../store/reducer/AddLoanReducer";

const LoanList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">{props.labelName}</span>
        {props.show && (
          <Button
            label="Add Application"
            icon="pi pi-plus"
            onClick={() => {
              navigate("/application/add");
              dispatch(setAddLoan({ type: "add" }));
            }}
          />
        )}
      </div>
    );
  };
  const actionBodyTemplate = () => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          text
          aria-label="Filter"
          onClick={() => {
            navigate("/employee/edit");
          }}
        />
      </>
    );
  };

  return (
    <>
      {loading && <Loader />}
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3">
        <DataTable
          value={list}
          header={header}
          // tableStyle={{ minWidth: "60rem" }}
          dataKey="_id"
          emptyMessage="No data found."
          filterDisplay="row"
        >
          <Column field="employeeId" header="Employe Id" />
          <Column field="name" header="Name" />
          <Column field="username" header="Username" />
          <Column field="position" header="Position" />
          <Column field="isActive" header="Status" />

          <Column field="branchCode" header="Branch Code" />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </div>
    </>
  );
};

export default LoanList;
