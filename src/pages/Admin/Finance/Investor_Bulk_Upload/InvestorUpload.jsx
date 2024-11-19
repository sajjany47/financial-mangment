/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { useState } from "react";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { downloadInvestorExcel, readInvestorExcel } from "../FinanceService";
import Loader from "../../../../component/Loader";

const InvestorUpload = (props) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [loanTypeOption, setLoanTypeOption] = useState([]);

  const handelDownload = async () => {
    setLoading(true);
    downloadInvestorExcel()
      .then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "Investor_Template.xlsx");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handelSubmit = () => {
    setLoading(true);
    readInvestorExcel({ files: file })
      .then((res) => {
        props.getData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        props.getErrorData("While uploading An error occurred");
        setLoading(false);
      });

    // setLoading(false);
  };
  return (
    <>
      {loading && <Loader />}
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium p-2">
        <ol className="list-group list-group-numbered">
          <li>
            Download the <code>.xlsx</code> format template provided beside.{" "}
            <i
              className="pi pi-file-excel"
              style={{
                marginRight: 5,
                fontSize: "20px",
                color: "green",
                cursor: "pointer",
              }}
              onClick={handelDownload}
            />
          </li>
          <li style={{ color: "red" }}>
            Date should be DD-MM-YYYY format (e.g. 10-05-1998).
          </li>
          <li>
            Fill in each column with the required information (e.g., Name,
            Phone,Email etc.).
          </li>
          <li>Ensure no fields are left blank unless specified as optional.</li>
          <li>
            Save the completed file in <code>.xlsx</code> format.
          </li>
          <li>
            Ensure all columns match the template exactly to avoid upload
            errors.
          </li>
        </ol>
        <FileUpload
          accept={".xlsx"}
          customUpload
          maxFileSize={10000000}
          emptyTemplate={
            <p className="m-0">Drag and drop files to here to upload.</p>
          }
          style={{ width: "100%", marginTop: "10px" }}
          onSelect={(e) => {
            setFile(e.files[0]);
          }}
        />
        <div className="flex pt-4 justify-content-end mb-3">
          <Button
            label={"Submit & Next"}
            icon="pi pi-arrow-right"
            iconPos="right"
            disabled={file === null ? true : false}
            onClick={() => {
              handelSubmit();
              props.next();
            }}
            type="submit"
          />
        </div>
      </div>
    </>
  );
};

export default InvestorUpload;
