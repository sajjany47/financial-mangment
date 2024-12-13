import { Fragment, useEffect, useState } from "react";
import { getEmployeeApplicationView } from "../Employee/AddUserService";
import Loader from "../../../component/Loader";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter, SlashString } from "../../../shared/constant";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";

const Profile = () => {
  const userDetails = useSelector((state) => state.user?.user.data);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getEmployeeApplicationView(userDetails._id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {loading && <Loader />}
      <div className="surface-section p-4">
        {/* Profile Section */}
        <div className="flex flex-column md:flex-row align-items-center gap-4 mb-4">
          <img
            src={data.userImageUrl}
            alt="User Profile"
            className="border-circle shadow-2 w-12rem h-12rem"
          />
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {data?.name}
            </h1>
            <h3 className="text-xl text-primary mb-2 capitalize">
              {data?.position ? SlashString(data?.position) : ""}
            </h3>
            <p className="text-sm text-gray-600">
              Employee ID: {data?.employeeId}
            </p>

            <p className="text-sm text-gray-600">
              Country: {data.country || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              State: {data.state || "N/A"}
            </p>
            <p className="text-sm text-gray-600">City: {data.city || "N/A"}</p>
            <p className="text-sm text-gray-600">
              Branch: {data?.branch?.name || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              Profile Verified:
              <Tag
                className="ml-1"
                severity={
                  data.isProfileVerified === "pending"
                    ? "warning"
                    : data.isProfileVerified === "verified"
                    ? "success"
                    : "danger"
                }
                value={capitalizeFirstLetter(data.isProfileVerified)}
                rounded
              />
            </p>
            <p className="text-sm text-gray-600">
              Profile Ratio: {data.profileRatio || "N/A"}%
            </p>
            <p className="text-sm text-gray-600">
              Active Status:{" "}
              {data.isActive ? (
                <Tag
                  severity="success"
                  value="Active"
                  rounded
                  className="ml-1"
                />
              ) : (
                <Tag
                  severity="danger"
                  value="Inactive"
                  rounded
                  className="ml-1"
                />
              )}
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <Card title="Basic Information" className="mb-4">
          <div className="grid">
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">Username:</p>
              <p className="text-gray-800">{data?.username}</p>
            </div>
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">Mobile:</p>
              <p className="text-gray-800">{data?.mobile}</p>
            </div>
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">Email:</p>
              <p className="text-gray-800">{data?.email}</p>
            </div>
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">Date of Birth:</p>
              <p className="text-gray-800">
                {new Date(data?.dob).toLocaleDateString()}
              </p>
            </div>
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">Type:</p>
              <p className="text-gray-800">
                {capitalizeFirstLetter(data?.fresherOrExperience)}
              </p>
            </div>
          </div>
        </Card>

        {/* Permanent Address */}
        <Card title="Permanent Address" className="mb-4">
          <p className="text-gray-800">
            {`${data?.permanentHouseOrBuildingNumber}, ${data?.permanentStreet}, ${data?.permanentLandmark}, ${data?.permanentCity}, ${data?.permanentState}, ${data?.permanentCountry} - ${data?.permanentPincode}`}
          </p>
        </Card>

        {/* Residence Address */}
        <Card title="Residence Address" className="mb-4">
          <p className="text-gray-800">
            {`${data?.residenceHouseOrBuildingNumber}, ${data?.residenceStreet}, ${data?.residenceLandmark}, ${data?.residenceCity}, ${data?.residenceState}, ${data?.residenceCountry} - ${data?.residencePincode}`}
          </p>
        </Card>

        {/* Education */}
        <Card title="Education" className="mb-4">
          {data?.education?.map((edu) => (
            <Fragment key={edu._id}>
              <div key={edu._id} className="mb-3">
                <p className="mb-1 font-semibold">
                  Board Name: {edu?.boardName}
                </p>
                <p className="mb-1">Passing Year: {edu?.passingYear}</p>
                <p className="mb-1">
                  Marks Percentage: {edu?.marksPercentage}%
                </p>
                <a
                  href={edu?.resultImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  View Result
                </a>
              </div>
              <Divider />
            </Fragment>
          ))}
        </Card>

        {/* Work Details */}
        <Card title="Work Details" className="mb-4">
          {data?.workDetail?.map((work) => (
            <Fragment key={work._id}>
              <div key={work._id} className="mb-3">
                <p className="mb-1 font-semibold">
                  Company Name: {work?.companyName}
                </p>
                <p className="mb-1">Position: {work?.position}</p>
                <p className="mb-1">
                  Duration:{" "}
                  {work.startingYear
                    ? new Date(work.startingYear).toLocaleDateString()
                    : ""}{" "}
                  -{" "}
                  {work.endingYear
                    ? new Date(work.endingYear).toLocaleDateString()
                    : ""}
                </p>
                <div className="flex flex-column gap-2">
                  <a
                    href={work?.experienceLetterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    Experience Letter
                  </a>
                  <a
                    href={work?.relievingLetterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    Relieving Letter
                  </a>
                  <a
                    href={work?.appointmentLetterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    Appointment Letter
                  </a>
                  <a
                    href={work?.salarySlipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    Salary Slip
                  </a>
                </div>
              </div>
              <Divider />
            </Fragment>
          ))}
        </Card>

        {/* Bank Details */}
        <Card title="Bank Details" className="mb-4">
          <div className="grid">
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">Account Number:</p>
              <p className="text-gray-800">{data?.accountNumber}</p>
            </div>
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">Bank Name:</p>
              <p className="text-gray-800">{data?.bankName}</p>
            </div>
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">IFSC Code:</p>
              <p className="text-gray-800">{data?.ifsc}</p>
            </div>
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">Branch Name:</p>
              <p className="text-gray-800">{data?.bankBranchName}</p>
            </div>
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">UAN:</p>
              <p className="text-gray-800">{data?.uan ? data?.uan : "N/A"}</p>
              {data?.uanImageUrl && (
                <a
                  href={data?.uanImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  View UAN
                </a>
              )}
            </div>
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">Passbook:</p>
              <a
                href={data?.passbookImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                View Passbook
              </a>
            </div>
          </div>
        </Card>

        {/* Documents */}
        <Card title="Documents" className="mb-4">
          <div className="grid">
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">Aadhar:</p>
              <p className="text-gray-800">
                {data?.aadharNumber ? data?.aadharNumber : "N/A"}
              </p>
              {data?.aadharImageUrl && (
                <a
                  href={data?.aadharImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  View Aadhar
                </a>
              )}
            </div>
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">PAN:</p>
              <p className="text-gray-800">
                {data?.panNumber ? data?.panNumber : "N/A"}
              </p>
              {data.panImageUrl && (
                <a
                  href={data.panImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  View PAN
                </a>
              )}
            </div>
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">Passport:</p>
              <p className="text-gray-800">
                {data.passportNumber ? data.passportNumber : "N/A"}
              </p>
              {data.passportImageUrl && (
                <a
                  href={data.passportImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  View Passport
                </a>
              )}
            </div>
            <div className="col-12 md:col-3">
              <p className="mb-1 font-semibold">Voter ID:</p>
              <p className="text-gray-800">
                {data.voterNumber ? data.voterNumber : "N/A"}
              </p>
              {data.voterImageUrl && (
                <a
                  href={data.voterImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  View Voter ID
                </a>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Profile;
