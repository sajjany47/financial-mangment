/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import Loader from "../../../component/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoan } from "../../../store/reducer/AddLoanReducer";
import { Dialog } from "primereact/dialog";
import { LoanTypes } from "../../../shared/Config";

const LoanList = (props) => {
  const dispatch = useDispatch();
  const loanDetails = useSelector((state) => state.loan.addLoan);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setLoading(false);
    setList([]);
  }, []);

  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">{props.labelName}</span>
        {props.show && (
          <Button
            label="Add Application"
            icon="pi pi-plus"
            onClick={() => {
              // navigate("/application/add");
              dispatch(setAddLoan({ type: "add" }));
              setVisible(true);
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

  const handelLoanNavigation = (item) => {
    dispatch(setAddLoan({ ...loanDetails, loanType: item }));
    navigate(
      item.value === "personal_loan" ? "/application/personal-loan/add" : ""
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
          <Column field="applicationNumber" header="Application Number" />
          <Column field="name" header="Name" />
          <Column field="mobile" header="Mobile" />
          <Column field="loanType" header="Type" />
          <Column field="loanAmount" header="Amount" />
          <Column field="loanStatus" header="Status" />
          <Column field="branch" header="Branch" />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </div>

      <Dialog
        header={"Select Loan Type"}
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          setVisible(false);
        }}
      >
        <div className="surface-0 text-center">
          <div className="grid">
            {LoanTypes.map((item, index) => {
              return (
                <div
                  className="col-12 md:col-3 mb-2 px-3"
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handelLoanNavigation(item);
                  }}
                >
                  <span
                    className="p-3 shadow-2 mb-3 inline-block"
                    style={{ borderRadius: "10px" }}
                  >
                    <i className={`pi ${item.icon} text-4xl text-blue-500`}></i>
                  </span>
                  <div className="text-900 text-xl mb-3 font-medium">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default LoanList;
