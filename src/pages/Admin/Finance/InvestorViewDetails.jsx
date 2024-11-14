import { useEffect, useRef, useState } from "react";
import { getInvestorDetails } from "./FinanceService";
import { useParams } from "react-router-dom";
import Loader from "../../../component/Loader";
import moment from "moment";
import { Currency } from "../../../component/FieldType";
import { capitalizeFirstLetter } from "../../../shared/constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const InvestorViewDetails = () => {
  const contentRef = useRef();
  const id = useParams().id;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getInvestorDetails(id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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

    pdf.save(`${data?.name} Investor.pdf`);
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
          Investor Information
        </div>
        <ul className="list-none p-0 m-0">
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">
              Personal Details
            </div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <div className="view-app">Name</div>
                  {data?.name}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app"> Mobile Number</div>
                  {data?.mobile}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app"> Email</div>
                  {data?.email}
                </div>

                <div className="col-12 md:col-3">
                  <div className="view-app">DOB</div>

                  {moment(data?.dob).format("Do MMM,YYYY")}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Created By</div>

                  {data?.createdBy?.name}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Created At</div>

                  {moment(data?.createdAt).format("Do MMM,YYYY HH:mm:ss")}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Maturity Status</div>
                  <span
                    style={{
                      color: "white",
                      backgroundColor: data?.isMaturityCompleted
                        ? "green"
                        : "red",
                      padding: "5px",
                      borderRadius: "20px",
                      display: "inline-block",
                    }}
                  >
                    {data?.isMaturityCompleted ? "Completed" : "Not Completed"}
                  </span>
                </div>

                <div className="col-12 md:col-3">
                  <div className="view-app">Status</div>
                  <span
                    style={{
                      color: "white",
                      backgroundColor: data?.isInvestorActive ? "green" : "red",
                      padding: "5px",
                      borderRadius: "20px",
                      display: "inline-block",
                    }}
                  >
                    {data?.isInvestorActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">
              Investment Details
            </div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <div className="view-app">Investment Amount</div>

                  {Currency(data?.investmentAmount)}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Investment Type</div>

                  {capitalizeFirstLetter(data?.investmentType)}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Duration(Monthly)</div>

                  {data?.duration}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Interest Rate(Monthly)</div>
                  {data?.interestRate}%
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Payout Frequency</div>

                  {capitalizeFirstLetter(data?.payoutFrequency)}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Payout Date</div>
                  {moment(data?.payoutDate).format("Do")} of every month
                </div>
              </div>
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">
              Document Details
            </div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <div className="view-app">Aadhar Number</div>

                  {data?.aadharNumber}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Pan Number</div>

                  {data?.panNumber}
                </div>
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

          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">
              Transaction Details
            </div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <div className="view-app">Fully Paid</div>
                  <span
                    style={{
                      color: "white",
                      backgroundColor: data?.isFullyPaid ? "green" : "red",
                      padding: "5px",
                      borderRadius: "20px",
                      display: "inline-block",
                    }}
                  >
                    {data?.isFullyPaid ? "Yes" : "No"}
                  </span>
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Transaction Number</div>

                  {data?.transactionNumber}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Paid On</div>

                  {data?.paidOn
                    ? moment(data?.paidOn).format("Do MMM,YYYY HH:mm")
                    : ""}
                </div>
              </div>
            </div>
          </li>

          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">Plan Details</div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12">
                  <DataTable value={data?.planDetails}>
                    <Column
                      field="investmentAmount"
                      header="Investment Amount"
                      body={(item) => <> {Currency(item?.investmentAmount)}</>}
                    />
                    <Column
                      field="investmentType"
                      header="Type"
                      body={(item) => (
                        <>{capitalizeFirstLetter(item?.investmentType)}</>
                      )}
                    />
                    <Column field="duration" header="Duration" />
                    <Column field="interestRate" header="Interest(pm %)" />
                    <Column
                      field="payoutFrequency"
                      header="Frequency"
                      body={(item) => (
                        <>{capitalizeFirstLetter(item?.payoutFrequency)}</>
                      )}
                    />

                    <Column
                      field="payoutDate"
                      header="Payout Date"
                      body={(item) => (
                        <>
                          {moment(item?.payoutDate).format("Do")} of every Month
                        </>
                      )}
                    />
                    <Column
                      field="updatedAt"
                      header="Updated At"
                      body={(item) => (
                        <>
                          {moment(item?.updatedAt).format("Do MMM,YYYY HH:mm")}
                        </>
                      )}
                    />
                    <Column
                      field="updatedBy"
                      header=" Updated By"
                      body={(item) => (
                        <>
                          {" "}
                          {`${item.updatedBy.name}(${item.updatedBy.username})`}
                        </>
                      )}
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          </li>

          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">
              Payout Schedule
            </div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12">
                  <DataTable value={data?.payoutSchedule}>
                    <Column
                      field="payoutDate"
                      header="Payout Date"
                      body={(item) => (
                        <>
                          {moment(item?.payoutDate).format("Do")} of every Month
                        </>
                      )}
                    />
                    <Column
                      field="payoutAmount"
                      header="Payout Amount"
                      body={(item) => <> {Currency(item?.payoutAmount)}</>}
                    />
                    <Column
                      field="isPaid"
                      header="Paid Status"
                      body={statusTemplate}
                    />
                    <Column
                      field="transactionNumber"
                      header="Transaction Number"
                    />

                    <Column
                      field="paidOn"
                      header="Paid On"
                      body={(item) => (
                        <>
                          {item?.paidOn
                            ? moment(item?.paidOn).format("Do MMM,YYYY HH:mm")
                            : ""}
                        </>
                      )}
                    />
                    <Column
                      field="paidBy"
                      header=" Paid By"
                      body={(item) => (
                        <>
                          {item?.paidBy
                            ? `${item?.paidBy?.name}(${item?.paidBy?.username})`
                            : ""}
                        </>
                      )}
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          </li>

          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">Payout Reedem</div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12">
                  <DataTable value={data?.payoutReedem}>
                    <Column
                      field="reedemDate"
                      header="Reedem Date"
                      body={(item) => (
                        <>{moment(item?.reedemDate).format("Do MMM,YYYY")} </>
                      )}
                    />
                    <Column
                      field="reedemAmount"
                      header="Reedem Amount"
                      body={(item) => <> {Currency(item?.reedemAmount)}</>}
                    />
                    <Column
                      field="createdOn"
                      header="Created On"
                      body={(item) => (
                        <>
                          {item?.createdOn
                            ? moment(item?.createdOn).format(
                                "Do MMM,YYYY HH:mm"
                              )
                            : ""}
                        </>
                      )}
                    />
                    <Column
                      field="isPaid"
                      header="Paid Status"
                      body={statusTemplate}
                    />

                    <Column
                      field="transactionNumber"
                      header="Transaction Number"
                    />

                    <Column
                      field="paidOn"
                      header="Paid On"
                      body={(item) => (
                        <>
                          {item?.paidOn
                            ? moment(item?.paidOn).format("Do MMM,YYYY HH:mm")
                            : ""}
                        </>
                      )}
                    />
                    <Column
                      field="paidBy"
                      header=" Paid By"
                      body={(item) => (
                        <>
                          {item?.paidBy
                            ? `${item?.paidBy?.name}(${item?.paidBy?.username})`
                            : ""}
                        </>
                      )}
                    />
                    <Column
                      field="remainingInvestAmount"
                      header="Remaining Invest Amount"
                      body={(item) => (
                        <> {Currency(item?.remainingInvestAmount)}</>
                      )}
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default InvestorViewDetails;
