import { useEffect, useState } from "react";
import { getInvestorDetails } from "./FinanceService";
import { useParams } from "react-router-dom";
import Loader from "../../../component/Loader";
import moment from "moment";
import { Currency } from "../../../component/FieldType";
import { capitalizeFirstLetter } from "../../../shared/constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
// import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Tag } from "primereact/tag";

const InvestorViewDetails = () => {
  // const contentRef = useRef();
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

  const logoImage =
    "https://www.shutterstock.com/shutterstock/photos/1539151892/display_1500/stock-vector-software-testing-and-automation-logo-1539151892.jpg"; // Replace with Grow2Tech logo in base64 or URL
  const approvedSeal =
    "https://thumbs.dreamstime.com/b/vector-approved-stamp-isolated-white-29840749.jpg";
  const handleDownloadPdf = async () => {
    // const content = contentRef.current;
    // const pdf = new jsPDF("p", "mm", "a4"); // A4 size in portrait mode
    // const imgWidth = 210; // Width for A4 (in mm)
    // const pageHeight = 295; // Height for A4 (in mm)
    // const margin = 10; // Margin for the content

    // let position = margin;
    // const elements = Array.from(content.querySelectorAll(".pdf-content"));
    // for (const element of elements) {
    //   const canvas = await html2canvas(element); // Capture content as canvas
    //   const imgData = canvas.toDataURL("image/png"); // Convert canvas to an image
    //   const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    //   if (position + imgHeight > pageHeight - margin) {
    //     pdf.addPage(); // Add a new page if content doesn't fit
    //     position = margin; // Reset position for the new page
    //   }

    //   // Add image to PDF with margins
    //   pdf.addImage(
    //     imgData,
    //     "PNG",
    //     margin,
    //     position,
    //     imgWidth - margin * 2,
    //     imgHeight
    //   );

    //   position += imgHeight + margin; // Update position for the next element
    // }

    // pdf.save(`${data?.name} Investor.pdf`);

    const doc = new jsPDF();
    let y = 10;

    // Add company logo at the top center
    doc.addImage(logoImage, "PNG", 80, y, 50, 20); // Position and size as needed
    y += 30;
    // PDF Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 128);
    doc.text("Investor Details Report", 105, y, { align: "center" });
    y += 10;

    // Section: Personal Details
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 128);
    doc.text("Personal Details", 10, y);
    y += 8;

    const personalDetails = [
      ["Name", data.name, "DOB", moment(data?.dob).format("Do MMM,YYYY")],
      ["Mobile Number", data.mobile, "Created By", data?.createdBy?.name],
      [
        "Email",
        data.email,
        "Created At",
        moment(data?.createdAt).format("Do MMM,YYYY HH:mm:ss"),
      ],
      [
        "Maturity Status",
        data?.isMaturityCompleted ? "Yes" : "No",
        "Status",
        data?.isInvestorActive ? "Active" : "Inactive",
      ],
    ];

    personalDetails.forEach(([label1, value1, label2, value2]) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${label1}:`, 10, y);
      doc.text(`${value1}`, 50, y);
      if (label2) {
        doc.text(`${label2}:`, 105, y);
        doc.text(`${value2}`, 145, y);
      }
      y += 8;
    });

    //Section Investment Details
    y += 5;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 128);
    doc.text("Investment Details", 10, y);
    y += 8;
    const investmentDetails = [
      [
        "Investment Amount",
        `${data?.investmentAmount}`,
        "Investment Type",
        capitalizeFirstLetter(data?.investmentType),
      ],
      [
        "Duration(Monthly)",
        data?.duration,
        "Interest Rate(pm)",
        `${data?.interestRate}%`,
      ],
      [
        "Payout Frequency",
        capitalizeFirstLetter(data?.payoutFrequency),
        "Payout Date",
        `${moment(data?.payoutDate).format("Do")} of every month`,
      ],
    ];

    investmentDetails.forEach(([label1, value1, label2, value2]) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${label1}:`, 10, y);
      doc.text(`${value1}`, 50, y);
      if (label2) {
        doc.text(`${label2}:`, 105, y);
        doc.text(`${value2}`, 145, y);
      }
      y += 8;
    });

    //Section Document Details
    y += 5;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 128);
    doc.text("Document Details", 10, y);
    y += 8;
    const documentDetails = [
      ["Aadhar Number", `${data?.aadharNumber}`, "Pan Number", data?.panNumber],
    ];

    documentDetails.forEach(([label1, value1, label2, value2]) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${label1}:`, 10, y);
      doc.text(`${value1}`, 50, y);
      if (label2) {
        doc.text(`${label2}:`, 105, y);
        doc.text(`${value2}`, 145, y);
      }
      y += 8;
    });

    //Section Account Details
    y += 5;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 128);
    doc.text("Account Details", 10, y);
    y += 8;
    const accountDetails = [
      [
        "Account Number",
        `${data?.accountNumber}`,
        "Account Name",
        data?.accountName,
      ],
      ["Bank Name", `${data?.bankName}`, "IFSC", data?.ifsc],
      ["Bank Branch Name", `${data?.bankBranchName}`],
    ];

    accountDetails.forEach(([label1, value1, label2, value2]) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${label1}:`, 10, y);
      doc.text(`${value1}`, 50, y);
      if (label2) {
        doc.text(`${label2}:`, 105, y);
        doc.text(`${value2}`, 145, y);
      }
      y += 8;
    });

    //Section Transaction Details
    y += 5;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 128);
    doc.text("Transaction Details", 10, y);
    y += 8;
    const transactionDetails = [
      [
        "Fully Paid",
        data?.isFullyPaid ? "Yes" : "No",
        "Transaction Number",
        data?.transactionNumber ? data?.transactionNumber : "         -",
      ],
      [
        "Paid On",
        data?.paidOn ? moment(data?.paidOn).format("Do MMM,YYYY HH:mm") : "-",
      ],
    ];

    transactionDetails.forEach(([label1, value1, label2, value2]) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${label1}:`, 10, y);
      doc.text(`${value1}`, 50, y);
      if (label2) {
        doc.text(`${label2}:`, 105, y);
        doc.text(`${value2}`, 145, y);
      }
      y += 8;
    });

    // Section: Plan Details Table
    y += 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 128);
    doc.text("Plan Details", 10, y);
    y += 8;
    doc.autoTable({
      startY: y,
      head: [
        [
          "Investment Amount",
          "Type",
          "Duration",
          "Interest Rate",
          "Frequency",
          "Payout Date",
        ],
      ],
      body: data.planDetails.map((plan) => [
        plan.investmentAmount,
        `${plan.investmentType}`,
        `${plan.duration} months`,
        `${plan.interestRate}%`,
        `${capitalizeFirstLetter(plan?.payoutFrequency)}`,
        `${moment(plan?.payoutDate).format("Do")} of every Month`,
      ]),
      theme: "grid",
    });

    // Section: Payout Schedule Table
    y = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 128);
    doc.text("Payout Schedule", 10, y);
    y += 8;
    doc.autoTable({
      startY: y,
      head: [
        [
          "Payout Date",
          "Amount",
          "Is Paid",
          "Transaction Number",
          "Paid On",
          "Paid By",
        ],
      ],
      body: data.payoutSchedule.map((schedule) => [
        `${moment(schedule?.payoutDate).format("Do")} of every Month`,
        `${schedule.payoutAmount}`,
        schedule.isPaid ? "Yes" : "No",
        schedule.transactionNumber || "-",
        `${
          schedule?.paidOn
            ? moment(schedule?.paidOn).format("Do MMM,YYYY HH:mm")
            : "-"
        }`,
        `${
          schedule?.paidBy
            ? `${schedule?.paidBy?.name}(${schedule?.paidBy?.username})`
            : ""
        }`,
      ]),
      theme: "grid",
    });

    // Section: Payout Redeem Table
    y = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 128);
    doc.text("Payout Redeem", 10, y);
    y += 8;
    doc.autoTable({
      startY: y,
      head: [
        [
          "Redeem Date",
          "Redeem Amount",
          "Remaining Amount",
          "Is Paid",
          "Transaction Number",
          "Paid On",
          "Paid By",
        ],
      ],
      body: data.payoutReedem.map((redeem) => [
        `${moment(redeem?.reedemDate).format("Do MMM,YYYY")}`,
        `${redeem.reedemAmount}`,
        `${redeem.remainingInvestAmount}`,
        redeem.isPaid ? "Yes" : "No",
        redeem.transactionNumber || "-",
        `${
          redeem?.paidOn
            ? moment(redeem?.paidOn).format("Do MMM,YYYY HH:mm")
            : "-"
        }`,
        `${
          redeem?.paidBy
            ? `${redeem?.paidBy?.name}(${redeem?.paidBy?.username})`
            : "-"
        }`,
      ]),
      theme: "grid",
    });

    // Add approved seal with company name at the bottom
    y = doc.lastAutoTable.finalY + 20; // Position after the last table
    const sealWidth = 40; // Width of the seal
    const sealHeight = 40; // Height of the seal
    const sealX = 150; // X position for the seal
    const sealY = y; // Y position for the seal

    // Add the approved seal image
    doc.addImage(approvedSeal, "PNG", sealX, sealY, sealWidth, sealHeight);

    // Add the company name below the seal
    doc.setFontSize(12);
    doc.setTextColor(0, 128, 0);
    doc.text(
      "Testing Software Pvt Ltd",
      sealX + sealWidth / 2,
      sealY + sealHeight + 8,
      {
        align: "center",
      }
    );
    // Save the PDF
    doc.save("Investor_Details_Report.pdf");
  };

  const statusTemplate = (item) => {
    return (
      <>
        {item?.isPaid ? (
          <Tag severity="success" value="Yes" rounded />
        ) : (
          <Tag severity="danger" value="No" rounded />
        )}
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
        // ref={contentRef}
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

                  {data?.isMaturityCompleted ? (
                    <Tag severity="success" value="Completed" rounded />
                  ) : (
                    <Tag severity="danger" value="Not Completed" rounded />
                  )}
                </div>

                <div className="col-12 md:col-3">
                  <div className="view-app">Status</div>
                  {data?.isInvestorActive ? (
                    <Tag severity="success" value="Active" rounded />
                  ) : (
                    <Tag severity="danger" value="Inactive" rounded />
                  )}
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
                  {data?.isFullyPaid ? (
                    <Tag severity="success" value="Yes" rounded />
                  ) : (
                    <Tag severity="danger" value="No" rounded />
                  )}
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
                  <DataTable value={data?.planDetails} showGridlines>
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
                  <DataTable value={data?.payoutSchedule} showGridlines>
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
                  <DataTable value={data?.payoutReedem} showGridlines>
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
