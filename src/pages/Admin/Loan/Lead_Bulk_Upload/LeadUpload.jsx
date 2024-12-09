/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import Loader from "../../../../component/Loader";
import ExcelJS from "exceljs";
import { loanTypeList } from "../../Operation_Hub/OperationHubService";

const LeadUpload = (props) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [loanTypeOption, setLoanTypeOption] = useState([]);

  useEffect(() => {
    loanTypeDetails();
  }, []);

  const loanTypeDetails = () => {
    setLoading(true);

    loanTypeList()
      .then((res) => {
        setLoanTypeOption(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handelDownload = async () => {
    setLoading(true);
    const headers = [
      "NAME",
      "MOBILE",
      "EMAIL",
      "LOAN TYPE",
      "LOAN AMOUNT",
      "TENURE",
      "MONTHLY INCOME",
      "BRANCH CODE",
    ];

    const filterLoanType = loanTypeOption.filter(
      (item) => item.isActive === true
    );

    const loanTypes = filterLoanType.map((item) => item.name);

    async function createExcelWithDropdown() {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      // Add headers
      const headerRow = worksheet.addRow(headers);
      // Style headers
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFC000" }, // Background color (gold)
        };
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" }, // Font color (white)
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
      // Set column widths
      worksheet.columns = [
        { width: 30 }, // NAME
        { width: 20 }, // MOBILE
        { width: 20 }, // EMAIL
        { width: 30 }, // LOAN TYPE
        { width: 20 }, // LOAN AMOUNT
        { width: 10 }, // TENURE
        { width: 18 }, // MONTHLY INCOME
        { width: 20 }, // BRANCH CODE
      ];

      // Add dropdown (data validation) for the "Loan Type" column

      worksheet.dataValidations.add("D1:D1048576", {
        type: "list",
        allowBlank: false,
        formulae: [`"${loanTypes.join(",")}"`],
        showErrorMessage: true,
        errorTitle: "Invalid Input",
        error: "Please select a valid loan type from the dropdown.",
      });

      // Write workbook to buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Create a Blob and trigger download
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Lead.xlsx");
      setLoading(false);
    }

    // Call the function to generate and download the Excel file
    createExcelWithDropdown();
  };

  const handelSubmit = () => {
    setLoading(true);
    if (file) {
      const reader = new FileReader(); // Create a FileReader to read the file

      reader.onload = async (e) => {
        const buffer = e.target.result;
        const workbook = new ExcelJS.Workbook(); // Create a new ExcelJS workbook
        await workbook.xlsx.load(buffer); // Load the file data into the workbook

        // Assuming the first sheet is the one we want to read
        const worksheet = workbook.worksheets[0]; // Access the first sheet

        const jsonData = [];

        // Iterate over rows (starting from the second row to skip headers)
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            const rowData = {};
            row.eachCell((cell, colNumber) => {
              // Map each column header to its corresponding value
              const header = worksheet.getRow(1).getCell(colNumber).value;
              rowData[header] = cell.value;
            });
            jsonData.push(rowData); // Add the row data to the array
          }
        });
        const prepareData = jsonData.map((item) => {
          const findLoan = loanTypeOption.find(
            (elm) => elm.name === item["LOAN TYPE"]
          );
          return {
            name: item.NAME,
            mobile: item.MOBILE,
            email: item.EMAIL,
            loanType: { name: findLoan.name, _id: findLoan._id },
            loanAmount: item["LOAN AMOUNT"],
            loanTenure: item.TENURE,
            monthlyIncome: item["MONTHLY INCOME"],
            branch: item["BRANCH CODE"],
          };
        });

        props.getData(prepareData);
        setLoading(false);
        props.next(); // Set the parsed data into state
      };

      reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    }

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
          <li>
            Fill in each column with the required information (e.g., Name,
            Phone,Email,Branch Code,Loan etc.).
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
            }}
            type="submit"
          />
        </div>
      </div>
    </>
  );
};

export default LeadUpload;
