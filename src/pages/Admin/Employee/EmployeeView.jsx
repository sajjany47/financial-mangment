import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmployeeApplicationView } from "./AddUserService";
import Loader from "../../../component/Loader";
import { Button } from "primereact/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";
import { capitalizeFirstLetter, SlashString } from "../../../shared/constant";

const EmployeeView = () => {
  const id = useParams().id;
  const contentRef = useRef();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getEmployeeApplicationView(id)
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
          Employee Information
        </div>
        <ul className="list-none p-0 m-0">
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">
              Emloyee Detail
            </div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <div className="view-app">Employee Id</div>
                  {data?.employeeId}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Username</div>
                  {data?.username}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Position</div>
                  {data?.position ? SlashString(data?.position) : ""}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Country</div>
                  {data?.country}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">State</div>
                  {data?.state}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">City</div>
                  {data?.city}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Branch Name</div>
                  {data?.branch?.name} ({data?.branch?.code})
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Status</div>
                  <span
                    style={{
                      color: "white",
                      backgroundColor: data?.isActive ? "green" : "red",
                      padding: "5px",
                      borderRadius: "20px",
                      display: "inline-block",
                    }}
                  >
                    {data?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
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
                  <div className="view-app">Resisdence Type</div>
                  {capitalizeFirstLetter(data?.residenceType)}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Fresher/Experience</div>
                  {capitalizeFirstLetter(data?.fresherOrExperience)}
                </div>

                <div className="col-12 md:col-3 ">
                  <div className="view-app">Created At</div>
                  {moment(data?.createdAt).format("DD MMM,YYYY HH:mm")}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Created By</div>
                  {data?.createdBy
                    ? `${data?.createdBy?.name} (${data?.createdBy?.username})`
                    : ""}
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
              </div>
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">
              Education Details
            </div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                {data?.education?.map((item, index) => {
                  return (
                    <Fragment key={index}>
                      <div className="col-12 md:col-3">
                        <div className="view-app">Board Name</div>
                        {item.boardName}
                      </div>
                      <div className="col-12 md:col-3">
                        <div className="view-app">Passing Year</div>
                        {item.passingYear}
                      </div>
                      <div className="col-12 md:col-3">
                        <div className="view-app">Marks(%)</div>
                        {item.marksPercentage}
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap pdf-content">
            <div className="text-500 w-6 md:w-2 font-medium">Work Details</div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                {data?.workDetail?.map((item, index) => {
                  return (
                    <Fragment key={index}>
                      <div className="col-12 md:col-3">
                        <div className="view-app">Company Name</div>
                        {item.companyName}
                      </div>
                      <div className="col-12 md:col-3">
                        <div className="view-app">Position</div>
                        {item.position}
                      </div>
                      <div className="col-12 md:col-3">
                        <div className="view-app">Starting Year</div>
                        {moment(item.startingYear).format("DD MMM,YYYY")}
                      </div>
                      <div className="col-12 md:col-3">
                        <div className="view-app">Ending Year</div>
                        {moment(item.endingYear).format("DD MMM,YYYY")}
                      </div>
                    </Fragment>
                  );
                })}
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
                <div className="col-12 md:col-3">
                  <div className="view-app">Voter Number</div>
                  {data?.voterNumber}
                </div>

                <div className="col-12 md:col-3">
                  <div className="view-app">Passport Number</div>
                  {data?.passportNumber}
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
                  <div className="view-app">UAN</div>
                  {data?.uan}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Account Number</div>
                  {data?.accountNumber}
                </div>
                <div className="col-12 md:col-3">
                  <div className="view-app">Account Name</div>
                  {data?.name}
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
        </ul>
      </div>
    </>
  );
};

export default EmployeeView;
