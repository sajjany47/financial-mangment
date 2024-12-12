import { useEffect, useState } from "react";
import { getDetails } from "../Employee/AddUserService";
import Loader from "../../../component/Loader";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../../shared/constant";
import { Card } from "primereact/card";

const Profile = () => {
  const userDetails = useSelector((state) => state.user?.user.data);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDetails(userDetails._id)
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
            src={`path_to_images/${data.userImage}`}
            alt="User Profile"
            className="border-circle shadow-2 w-12rem h-12rem"
          />
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {data.name}
            </h1>
            <h3 className="text-xl text-primary mb-2 capitalize">
              {data.position}
            </h3>
            <p className="text-sm text-gray-600">
              Employee ID: {data.employeeId}
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <Card title="Basic Information" className="mb-4">
          <div className="grid">
            <div className="col-12 md:col-6">
              <p className="mb-1 font-semibold">Username:</p>
              <p className="text-gray-800">{data.username}</p>
            </div>
            <div className="col-12 md:col-6">
              <p className="mb-1 font-semibold">Mobile:</p>
              <p className="text-gray-800">{data.mobile}</p>
            </div>
            <div className="col-12 md:col-6">
              <p className="mb-1 font-semibold">Email:</p>
              <p className="text-gray-800">{data.email}</p>
            </div>
            <div className="col-12 md:col-6">
              <p className="mb-1 font-semibold">Date of Birth:</p>
              <p className="text-gray-800">
                {new Date(data.dob).toLocaleDateString()}
              </p>
            </div>
            <div className="col-12">
              <p className="mb-1 font-semibold">Address:</p>
              <p className="text-gray-800">{data.address || "N/A"}</p>
            </div>
          </div>
        </Card>

        {/* Permanent Address */}
        <Card title="Permanent Address" className="mb-4">
          <p className="text-gray-800">
            {`${data.permanentHouseOrBuildingNumber}, ${data.permanentStreet}, ${data.permanentLandmark}, ${data.permanentCity}, ${data.permanentState}, ${data.permanentCountry} - ${data.permanentPincode}`}
          </p>
        </Card>

        {/* Residence Address */}
        <Card title="Residence Address" className="mb-4">
          <p className="text-gray-800">
            {`${data.residenceHouseOrBuildingNumber}, ${data.residenceStreet}, ${data.residenceLandmark}, ${data.residenceCity}, ${data.residenceState}, ${data.residenceCountry} - ${data.residencePincode}`}
          </p>
        </Card>

        {/* Education */}
        <Card title="Education" className="mb-4">
          {data?.education?.map((edu, index) => (
            <div key={edu._id} className="mb-3">
              <p className="mb-1 font-semibold">Board Name: {edu.boardName}</p>
              <p className="mb-1">Passing Year: {edu.passingYear}</p>
              <p className="mb-1">Marks Percentage: {edu.marksPercentage}%</p>
              <a
                href={`path_to_images/${edu.resultImage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                View Result
              </a>
            </div>
          ))}
        </Card>

        {/* Work Details */}
        <Card title="Work Details" className="mb-4">
          {data?.workDetail?.map((work, index) => (
            <div key={work._id} className="mb-3">
              <p className="mb-1 font-semibold">
                Company Name: {work.companyName}
              </p>
              <p className="mb-1">Position: {work.position}</p>
              <p className="mb-1">
                Duration: {new Date(work.startingYear).toLocaleDateString()} -{" "}
                {new Date(work.endingYear).toLocaleDateString()}
              </p>
              <div className="flex flex-column gap-2">
                <a
                  href={`path_to_images/${work.experienceLetter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  Experience Letter
                </a>
                <a
                  href={`path_to_images/${work.relievingLetter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  Relieving Letter
                </a>
                <a
                  href={`path_to_images/${work.appointmentLetter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  Appointment Letter
                </a>
                <a
                  href={`path_to_images/${work.salarySlip}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  Salary Slip
                </a>
              </div>
            </div>
          ))}
        </Card>

        {/* Bank Details */}
        <Card title="Bank Details" className="mb-4">
          <div className="grid">
            <div className="col-12 md:col-6">
              <p className="mb-1 font-semibold">Account Number:</p>
              <p className="text-gray-800">{data.accountNumber}</p>
            </div>
            <div className="col-12 md:col-6">
              <p className="mb-1 font-semibold">Bank Name:</p>
              <p className="text-gray-800">{data.bankName}</p>
            </div>
            <div className="col-12 md:col-6">
              <p className="mb-1 font-semibold">IFSC Code:</p>
              <p className="text-gray-800">{data.ifsc}</p>
            </div>
            <div className="col-12 md:col-6">
              <p className="mb-1 font-semibold">Branch Name:</p>
              <p className="text-gray-800">{data.bankBranchName}</p>
            </div>
          </div>
        </Card>

        {/* Documents */}
        <Card title="Documents" className="mb-4">
          <div className="grid">
            <div className="col-12 md:col-6">
              <p className="mb-1 font-semibold">Aadhar:</p>
              <a
                href={`path_to_images/${data.aadharImage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                View Aadhar
              </a>
            </div>
            <div className="col-12 md:col-6">
              <p className="mb-1 font-semibold">PAN:</p>
              <a
                href={`path_to_images/${data.panImage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                View PAN
              </a>
            </div>
            <div className="col-12 md:col-6">
              <p className="mb-1 font-semibold">Passport:</p>
              <a
                href={`path_to_images/${data.passportImage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                View Passport
              </a>
            </div>
            <div className="col-12 md:col-6">
              <p className="mb-1 font-semibold">Voter ID:</p>
              <a
                href={`path_to_images/${data.voterImage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                View Voter ID
              </a>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Profile;
