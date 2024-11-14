import { useEffect, useRef, useState } from "react";
import { getInvestorDetails } from "./FinanceService";
import { useParams } from "react-router-dom";
import Loader from "../../../component/Loader";
import { Divider } from "primereact/divider";
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
        <Divider align="center">
          <b>Personal Details</b>
        </Divider>
        <div className="grid">
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Name</div>
            <div className="font-light mb-1 text-600">{data?.name}</div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Mobile Number</div>
            <div className="font-light mb-1 text-600">{data?.mobile}</div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Email</div>
            <div className="font-light mb-1 text-600">{data?.email}</div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">DOB</div>
            <div className="font-light mb-1 text-600">
              {moment(data?.dob).format("Do MMM,YYYY")}
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Created By</div>
            <div className="font-light mb-1 text-600">
              {data?.createdBy?.name}
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Created At</div>
            <div className="font-light mb-1 text-600">
              {moment(data?.createdAt).format("Do MMM,YYYY HH:mm:ss")}
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Maturity Status</div>
            <div
              className={`font-light mb-1 text-600 text-white-700 ${
                data?.isMaturityCompleted ? "text-green-700" : "text-red-700"
              }`}
            >
              {data?.isMaturityCompleted ? "Completed" : "Not Completed"}
            </div>
          </div>

          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Status</div>
            <div
              className={`font-light mb-1 text-600 text-white-700 ${
                data?.isInvestorActive ? "text-green-700" : "text-red-700"
              }`}
            >
              {data?.isInvestorActive ? "Active" : "Inactive"}
            </div>
          </div>
        </div>
        <Divider align="center">
          <b>Investment Details</b>
        </Divider>
        <div className="grid">
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Investment Amount</div>
            <div className="font-light mb-1 text-600">
              {Currency(data?.investmentAmount)}
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Investment Type</div>
            <div className="font-light mb-1 text-600">
              {capitalizeFirstLetter(data?.investmentType)}
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Duration(Monthly)</div>
            <div className="font-light mb-1 text-600">{data?.duration}</div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">
              Interest Rate(Monthly)
            </div>
            <div className="font-light mb-1 text-600">
              {data?.interestRate}%
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Payout Frequency</div>
            <div className="font-light mb-1 text-600">
              {capitalizeFirstLetter(data?.payoutFrequency)}
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Payout Date</div>
            <div className="font-light mb-1 text-600">
              {moment(data?.payoutDate).format("Do")} of every month
            </div>
          </div>
        </div>

        <Divider align="center">
          <b>Document Details</b>
        </Divider>
        <div className="grid">
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Aadhar Number</div>
            <div className="font-light mb-1 text-600">{data?.aadharNumber}</div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Pan Number</div>
            <div className="font-light mb-1 text-600">{data?.panNumber}</div>
          </div>
        </div>
        <Divider align="center">
          <b>Account Details</b>
        </Divider>
        <div className="grid">
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Account Number</div>
            <div className="font-light mb-1 text-600">
              {data?.accountNumber}
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Account Name</div>
            <div className="font-light mb-1 text-600">{data?.accountName}</div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Bank Name</div>
            <div className="font-light mb-1 text-600">{data?.bankName}</div>
          </div>

          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">IFSC</div>
            <div className="font-light mb-1 text-600"> {data?.ifsc}</div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Bank Branch Name</div>
            <div className="font-light mb-1 text-600">
              {data?.bankBranchName}
            </div>
          </div>
        </div>
        <Divider align="center">
          <b>Transaction Details</b>
        </Divider>
        <div className="grid">
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Fully Paid</div>
            <div
              className={`font-light mb-1 text-600 text-white-700 ${
                data?.isFullyPaid ? "text-green-700" : "text-red-700"
              }`}
            >
              {data?.isFullyPaid ? "Yes" : "No"}
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">
              Transaction Number
            </div>
            <div className="font-light mb-1 text-600">
              {data?.transactionNumber}
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Paid On</div>
            <div className="font-light mb-1 text-600">
              {data?.paidOn
                ? moment(data?.paidOn).format("Do MMM,YYYY HH:mm")
                : ""}
            </div>
          </div>
        </div>
        <Divider align="center">
          <b>Plan Details</b>
        </Divider>
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
                  <>{moment(item?.payoutDate).format("Do")} of every Month</>
                )}
              />
              <Column
                field="updatedAt"
                header="Updated At"
                body={(item) => (
                  <>{moment(item?.updatedAt).format("Do MMM,YYYY HH:mm")}</>
                )}
              />
              <Column
                field="updatedBy"
                header=" Updated By"
                body={(item) => (
                  <> {`${item.updatedBy.name}(${item.updatedBy.username})`}</>
                )}
              />
            </DataTable>
          </div>
        </div>

        <Divider align="center">
          <b>Payout Schedule</b>
        </Divider>
        <div className="grid">
          <div className="col-12">
            <DataTable value={data?.payoutSchedule}>
              <Column
                field="payoutDate"
                header="Payout Date"
                body={(item) => (
                  <>{moment(item?.payoutDate).format("Do")} of every Month</>
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
              <Column field="transactionNumber" header="Transaction Number" />

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

        <Divider align="center">
          <b>Payout Reedem</b>
        </Divider>
        <div className="grid mb-5">
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
                      ? moment(item?.createdOn).format("Do MMM,YYYY HH:mm")
                      : ""}
                  </>
                )}
              />
              <Column
                field="isPaid"
                header="Paid Status"
                body={statusTemplate}
              />

              <Column field="transactionNumber" header="Transaction Number" />

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
                body={(item) => <> {Currency(item?.remainingInvestAmount)}</>}
              />
              <Column
                field="createdBy"
                header=" Created By"
                body={(item) => (
                  <>
                    {item?.createdBy
                      ? `${item?.createdBy?.name}(${item?.createdBy?.username})`
                      : ""}
                  </>
                )}
              />
            </DataTable>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorViewDetails;
