import { useEffect, useState } from "react";
import { getLoanApplicationView } from "../Loan/LoanService";
import { useParams } from "react-router-dom";
import Loader from "../../../component/Loader";
import moment from "moment";
import { Currency } from "../../../component/FieldType";

const ApplicationView = () => {
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
  return (
    <>
      {loading && <Loader />}
      <div className="surface-0 p-1 mb-5">
        <ul className="list-none p-0 m-0">
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
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
              </div>
            </div>
          </li>

          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
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
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
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
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
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
              </div>
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
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
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ApplicationView;
