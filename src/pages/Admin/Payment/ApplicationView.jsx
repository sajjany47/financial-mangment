import { useEffect, useState } from "react";
import { getLoanApplicationView } from "../Loan/LoanService";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";

import Loader from "../../../component/Loader";
import moment from "moment";

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
      <div className="surface-0 p-1">
        <ul className="list-none p-0 m-0">
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Basic Details</div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <strong>Name: </strong> {data?.name}
                </div>
                <div className="col-12 md:col-3">
                  <strong>Mobile: </strong> {data?.mobile}
                </div>
                <div className="col-12 md:col-3">
                  <strong>Email: </strong> {data?.email}
                </div>
                <div className="col-12 md:col-3 ">
                  <strong>DOB: </strong>{" "}
                  {moment(data?.dob).format("DD MMM,YYYY")}
                </div>
                <div className="col-12 md:col-3">
                  <strong>Father Name: </strong> {data?.fatherName}
                </div>
                <div className="col-12 md:col-3">
                  <strong>Mother Name: </strong> {data?.motherName}
                </div>
              </div>
            </div>
          </li>

          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">
              Communication Details
            </div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-12 text-center">
                  <spans className="p-tag">Permanent Address</spans>
                </div>

                <div className="col-12 md:col-3">
                  <strong>Country: </strong> {data?.permanentCountry}
                </div>
                <div className="col-12 md:col-3">
                  <strong>State: </strong> {data?.permanentState}
                </div>
                <div className="col-12 md:col-3">
                  <strong>City: </strong> {data?.permanentCity}
                </div>
                <div className="col-12 md:col-3 ">
                  <strong>House/Building Number: </strong>{" "}
                  {data?.permanentHouseOrBuildingNumber}
                </div>
                <div className="col-12 md:col-3">
                  <strong>Street Name: </strong> {data?.permanentStreet}
                </div>
                <div className="col-12 md:col-3">
                  <strong>Landmark: </strong> {data?.permanentLandmark}
                </div>
                <div className="col-12 md:col-3">
                  <strong>Pincode: </strong> {data?.permanentPincode}
                </div>
                <div className="col-12 md:col-12 text-center">
                  <spans className="p-tag">Residential Address</spans>
                </div>
                <div className="col-12 md:col-3">
                  <strong>Country: </strong> {data?.residenceCountry}
                </div>
                <div className="col-12 md:col-3">
                  <strong>State: </strong> {data?.residenceState}
                </div>
                <div className="col-12 md:col-3">
                  <strong>City: </strong> {data?.residenceCity}
                </div>
                <div className="col-12 md:col-3 ">
                  <strong>House/Building Number: </strong>{" "}
                  {data?.residenceHouseOrBuildingNumber}
                </div>
                <div className="col-12 md:col-3">
                  <strong>Street Name: </strong> {data?.residenceStreet}
                </div>
                <div className="col-12 md:col-3">
                  <strong>Landmark: </strong> {data?.residenceLandmark}
                </div>
                <div className="col-12 md:col-3">
                  <strong>Pincode: </strong> {data?.residencePincode}
                </div>
              </div>
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Work Details</div>
            <div className="text-500 w-full md:w-10 md:flex-order-0 flex-order-1">
              <div className="grid">
                <div className="col-12 md:col-3">
                  <strong>Name: </strong> {data?.name}
                </div>
                <div className="col-12 md:col-3">
                  <strong>Mobile: </strong> {data?.mobile}
                </div>
                <div className="col-12 md:col-3">
                  <strong>Email: </strong> {data?.email}
                </div>
                <div className="col-12 md:col-3 ">
                  <strong>DOB: </strong>{" "}
                  {moment(data?.dob).format("DD MMM,YYYY")}
                </div>
                <div className="col-12 md:col-3">
                  <strong>Father Name: </strong> {data?.fatherName}
                </div>
                <div className="col-12 md:col-3">
                  <strong>Mother Name: </strong> {data?.motherName}
                </div>
              </div>
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Plot</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
              A group of professional bank robbers start to feel the heat from
              police when they unknowingly leave a clue at their latest heist.
            </div>
            <div className="w-6 md:w-2 flex justify-content-end">
              <Button
                label="Edit"
                icon="pi pi-pencil"
                className="p-button-text"
              />
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ApplicationView;
