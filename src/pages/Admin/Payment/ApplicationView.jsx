import { useEffect, useRef, useState } from "react";
import { getLoanApplicationView } from "../Loan/LoanService";
import { useParams } from "react-router-dom";
import Loader from "../../../component/Loader";
import moment from "moment";
import { Currency } from "../../../component/FieldType";
import { Fragment } from "react";
import { capitalizeFirstLetter, FormatString } from "../../../shared/constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ApplicationView = () => {
  const contentRef = useRef();
  const id = useParams().id;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getLoanApplicationView(id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const forecloseTemplate = (item) => {
    return (
      <>
        {item?.foreclosureAmount === "Not applicable"
          ? item?.foreclosureAmount
          : Currency(item?.foreclosureAmount)}
      </>
    );
  };

  const statusTemplate = (item) => {
    return (
      <>
        <span
          style={{
            color: "white",
            backgroundColor: item.isPaid ? "green" : "red",
            padding: "5px",
            borderRadius: "17px",
            display: "inline-block",
          }}
        >
          {item.isPaid ? "Yes" : "No"}
        </span>
      </>
    );
  };

  const handleDownloadPdf = async () => {
    const content = contentRef.current;
    const pdf = new jsPDF("p", "mm", "a4"); // A4 size in portrait mode
    const imgWidth = 210; // Width for A4 (in mm)
    const pageHeight = 295; // Height for A4 (in mm)
    const margin = 10; // Margin for the content

    let position = margin;
    const elements = Array.from(content.querySelectorAll(".pdf-content"));
    for (const element of elements) {
      const canvas = await html2canvas(element); // Capture content as canvas
      const imgData = canvas.toDataURL("image/png"); // Convert canvas to an image
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      if (position + imgHeight > pageHeight - margin) {
        pdf.addPage(); // Add a new page if content doesn't fit
        position = margin; // Reset position for the new page
      }

      // Add image to PDF with margins
      pdf.addImage(
        imgData,
        "PNG",
        margin,
        position,
        imgWidth - margin * 2,
        imgHeight
      );

      position += imgHeight + margin; // Update position for the next element
    }

    pdf.save(`${data?.name}.pdf`);
  };
  return (
    <>
      {loading && <Loader />}
      <div className="flex justify-content-end mb-2">
        <Button
          icon="pi pi-file-pdf"
          label="Download PDF"
          onClick={handleDownloadPdf}
        />
      </div>

      <div
        className="surface-0 p-1 mb-5"
        ref={contentRef}
        style={{ padding: "20px", backgroundColor: "#f5f5f5" }}
      >
        <div className="font-medium text-3xl text-900 mb-3 pdf-content">
          Application Information
        </div>

        <ul className="list-none p-0 m-0">
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">Loan Details</div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <div className="view-app">Branch Name</div>
                  {data?.branch?.name} ({data?.branch?.code})
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Application Number</div>
                  {data?.applicationNumber}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Loan Amount</div>
                  {data?.loanAmount}
                </div>

                <div className="col-12 md:col-3">
                  <div className="view-app">Loan Type</div>
                  {data?.loanType?.name}
                </div>

                <div className="col-12 md:col-3">
                  <div className="view-app">Status</div>
                  {data?.status ? FormatString(data?.status) : ""}
                </div>
                {data?.status === "disbursed" && (
                  <>
                    <div className="col-12 md:col-3">
                      <div className="view-app">Disbursed Amount</div>
                      {data?.disbursment?.disbursedAmount}
                    </div>
                    <div className="col-12 md:col-3">
                      <div className="view-app">EMI Monthly</div>
                      {Currency(data?.EMIMonthly)}
                    </div>
                    <div className="col-12 md:col-3">
                      <div className="view-app">Interest Rate</div>
                      {data?.interestRate}%
                    </div>
                    <div className="col-12 md:col-3">
                      <div className="view-app">Transaction Number</div>
                      {data?.transactionNumber}
                    </div>
                    <div className="col-12 md:col-3">
                      <div className="view-app">Disbursed By</div>
                      {data?.disbursedBy?.name} ({data?.disbursedBy?.username})
                    </div>

                    <div className="col-12 md:col-3">
                      <div className="view-app">Loan Verified By</div>
                      {data?.loanVerifiedBy
                        ? `${data?.loanVerifiedBy?.name} (${data?.loanVerifiedBy?.username})`
                        : ""}
                    </div>
                    <div className="col-12 md:col-3">
                      <div className="view-app">Loan Status</div>

                      <span
                        style={{
                          color: "white",
                          backgroundColor: data?.isLoanActive ? "green" : "red",
                          padding: "5px",
                          borderRadius: "20px",
                          display: "inline-block",
                        }}
                      >
                        {data?.isLoanActive ? "Active" : "Close"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">Basic Details</div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <div className="view-app">Name</div>
                  {data?.name}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Mobile</div>
                  {data?.mobile}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Email</div>
                  {data?.email}
                </div>
                <div className="col-12 md:col-3 ">
                  <div className="view-app">Date Of Birth</div>
                  {moment(data?.dob).format("DD MMM,YYYY")}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Father Name</div>
                  {data?.fatherName}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Mother Name</div>
                  {data?.motherName}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Resisdence Type</div>
                  {capitalizeFirstLetter(data?.residenceType)}
                </div>
              </div>
            </div>
          </li>

          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">
              Permanent Address
            </div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <div className="view-app">Country</div>
                  {data?.permanentCountry}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">State</div>
                  {data?.permanentState}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">City</div>
                  {data?.permanentCity}
                </div>
                <div className="col-12 md:col-3 ">
                  <div className="view-app">House/Building Number</div>
                  {data?.permanentHouseOrBuildingNumber}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Street Name</div>
                  {data?.permanentStreet}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Landmark</div>
                  {data?.permanentLandmark}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Pincode</div>
                  {data?.permanentPincode}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Address Verified By</div>
                  {data?.addressVerifiedBy
                    ? `${data?.addressVerifiedBy?.name} (
                    ${data?.addressVerifiedBy?.username})`
                    : ""}
                </div>
              </div>
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">
              Residential Address
            </div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <div className="view-app">Country</div>
                  {data?.residenceCountry}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">State</div>
                  {data?.residenceState}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">City</div>
                  {data?.residenceCity}
                </div>
                <div className="col-12 md:col-3 ">
                  <div className="view-app">House/Building Number</div>
                  {data?.residenceHouseOrBuildingNumber}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Street Name</div>
                  {data?.residenceStreet}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Landmark</div>
                  {data?.residenceLandmark}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Pincode</div>
                  {data?.residencePincode}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Address Verified By</div>
                  {data?.addressVerifiedBy
                    ? `${data?.addressVerifiedBy?.name} (
                    ${data?.addressVerifiedBy?.username})`
                    : ""}
                </div>
              </div>
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">Work Details</div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <div className="view-app">Company Name</div>
                  {data?.companyOrBussinessName}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Position</div>
                  {data?.jobTitle}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Employment Type</div>
                  {data?.employmentType}
                </div>
                <div className="col-12 md:col-3 ">
                  <div className="view-app">Total Experience(In Months)</div>
                  {data?.yearsOfExperience}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Monthly Income</div>
                  {Currency(data?.monthlyIncome ? data?.monthlyIncome : 0)}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Work Verified By</div>
                  {data?.officeOrBussinessVerifiedBy
                    ? `${data?.officeOrBussinessVerifiedBy?.name} (
                    ${data?.officeOrBussinessVerifiedBy?.username})`
                    : ""}
                </div>
              </div>
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">Work Address</div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <div className="view-app">Country</div>
                  {data?.workCountry}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">State</div>
                  {data?.workState}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">City</div>
                  {data?.workCity}
                </div>
                <div className="col-12 md:col-3 ">
                  <div className="view-app">House/Building Number</div>
                  {data?.shopOrBuildingNumber}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Street Name</div>
                  {data?.workStreet}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Landmark</div>
                  {data?.workLandmark}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Pincode</div>
                  {data?.workPincode}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Work Verified By</div>
                  {data?.officeOrBussinessVerifiedBy
                    ? `${data?.officeOrBussinessVerifiedBy?.name} (
                    ${data?.officeOrBussinessVerifiedBy?.username})`
                    : ""}
                </div>
              </div>
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">
              Dcoument Details
            </div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                {data?.document?.map((item, index) => {
                  return (
                    <Fragment key={index}>
                      <div className="col-12 md:col-3">
                        <div className="view-app">Type</div>
                        {item.type}
                      </div>
                      <div className="col-12 md:col-3">
                        <div className="view-app">Document Name</div>
                        {item.documentType}
                      </div>
                      <div className="col-12 md:col-3">
                        <div className="view-app">Document Number</div>
                        {item.documentNumber}
                      </div>
                      <div className="col-12 md:col-3">
                        <div className="view-app">Document Verified By</div>
                        {data?.documentVerifiedBy
                          ? `${data?.documentVerifiedBy?.name} (${data?.documentVerifiedBy?.username})`
                          : ""}
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">
              Account Details
            </div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <div className="view-app">Account Number</div>
                  {data?.accountNumber}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Account Name</div>
                  {data?.accountName}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Bank Name</div>
                  {data?.bankName}
                </div>

                <div className="col-12 md:col-3">
                  <div className="view-app">IFSC</div>
                  {data?.ifsc}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Bank Branch Name</div>
                  {data?.bankBranchName}
                </div>
              </div>
            </div>
          </li>

          {data?.status === "disbursed" && (
            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
              <div className="text-500 w-6 md:w-2 font-medium">
                EMI Schedule
              </div>
              <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
                <div className="grid">
                  <div className="col-12">
                    <DataTable
                      value={data?.emiSchedule}
                      // scrollable
                      // scrollHeight="400px"
                      // style={{ minWidth: "55rem" }}
                    >
                      <Column
                        field="emiDate"
                        header="EMI Date"
                        body={(item) => (
                          <>{moment(item.emiDate).format("DD MMM, YYYY")}</>
                        )}
                      />
                      <Column
                        field="emiAmount"
                        header="EMI"
                        body={(item) => <> {Currency(item?.emiAmount)}</>}
                      />

                      <Column
                        field="interestPaid"
                        header="Interest Paid"
                        body={(item) => <>{Currency(item?.interestPaid)}</>}
                      />
                      <Column
                        field="principalPaid"
                        header=" Principle Paid"
                        body={(item) => <> {Currency(item?.principalPaid)}</>}
                      />
                      <Column
                        field="remainingOutstanding"
                        header="Outstanding"
                        body={(item) => (
                          <>{Currency(item?.remainingOutstanding)}</>
                        )}
                      />
                      <Column
                        field="foreclosureAmount"
                        header="Foreclosure"
                        body={forecloseTemplate}
                      />
                      <Column
                        field="isPaid"
                        header="Paid"
                        body={statusTemplate}
                      />
                    </DataTable>
                  </div>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default ApplicationView;
