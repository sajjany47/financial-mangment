/* eslint-disable react/prop-types */
import { Column } from "jspdf-autotable";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";

const LeadSubmit = (props) => {
  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Error List</span>
    </div>
  );
  return (
    <>
      {props?.errorData?.length > 0 ? (
        <div className="card p-fluid danger">
          <DataTable
            value={props.errorData}
            dataKey="_id"
            emptyMessage="No data found."
            showGridlines
            scrollable
            scrollHeight="400px"
            header={header}
          >
            <Column field="name" header="Name" />
            <Column field="mobile" header="Mobile" />
            <Column field="email" header="Email" />
            <Column field="loanType.name" header="Loan Type" />
            <Column field="loanAmount" header="Amount" />
            <Column field="loanTenure" header="Tenure" />
            <Column field="monthlyIncome" header="Monthly Income" />
            <Column field="branch" header="Branch" />
            {/* <Column header="Action" body={actionBodyTemplate} /> */}
          </DataTable>
        </div>
      ) : (
        <div className="border-2 border-dashed surface-border border-round surface-ground font-medium p-2 mt-6">
          <p className="text-center">
            <i
              className="pi pi-verified"
              style={{ fontSize: "30px", color: "green" }}
            />
          </p>

          <h3 className="text-center">Lead uploaded successfully</h3>
        </div>
      )}
      <div className="flex pt-4 justify-content-between mb-3">
        <Button
          label="Back"
          severity="secondary"
          icon="pi pi-arrow-left"
          // eslint-disable-next-line react/prop-types
          onClick={() => props.back()}
          type="button"
        />
        <div className="flex  justify-content-end gap-2">
          <Button
            label={"Submit"}
            iconPos="right"
            onClick={() => props.handelDialogeClose()}
            type="submit"
          />
        </div>
      </div>
    </>
  );
};

export default LeadSubmit;
