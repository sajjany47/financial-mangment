/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import Loader from "../../../../component/Loader";
import { insertInvestorExcel } from "../FinanceService";
import { Currency } from "../../../../component/FieldType";
import moment from "moment";

const InvestorPreview = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(props.data);
  }, [props]);
  const handelDelete = (item, index) => {
    const filterData = data.filter((elm, ind) => ind !== index.rowIndex);
    setData(filterData);
  };

  const actionBodyTemplate = (item, index) => {
    return (
      <>
        <Button
          icon="pi pi-trash"
          rounded
          text
          aria-label="Filter"
          aria-controls="popup_menu_right"
          aria-haspopup
          onClick={() => {
            handelDelete(item, index);
          }}
        />
      </>
    );
  };

  const handelSubmit = () => {
    setLoading(true);
    insertInvestorExcel({ data: data })
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        props.getErrorData("While uploading An error occurred");
      });
  };
  return (
    <>
      {loading && <Loader />}
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium p-1">
        <div className="card p-fluid">
          <DataTable
            value={data}
            dataKey="_id"
            emptyMessage="No data found."
            showGridlines
            scrollable
            scrollHeight="400px"
          >
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
                <>{moment(item?.payoutDate).format("Do")} every Month</>
              )}
            />
            <Column header="Action" body={actionBodyTemplate} />
          </DataTable>
        </div>
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
              label={"Submit & Next"}
              icon="pi pi-arrow-right"
              iconPos="right"
              disabled={data.length === 0 ? true : false}
              onClick={() => {
                handelSubmit();
                props.next();
              }}
              type="submit"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorPreview;
