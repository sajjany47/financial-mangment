import { useEffect, useRef, useState } from "react";
import { getInvestorDetails } from "./FinanceService";
import { useParams } from "react-router-dom";
import Loader from "../../../component/Loader";
import { Divider } from "primereact/divider";
import moment from "moment";
import { Currency } from "../../../component/FieldType";

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
  console.log(data);
  return (
    <>
      {loading && <Loader />}
      <div
        className="surface-0 p-1 mb-5"
        ref={contentRef}
        style={{ padding: "20px", backgroundColor: "#f5f5f5" }}
      >
        <div className="font-medium text-3xl text-900 mb-3 pdf-content">
          Investor Information
        </div>
        <Divider
          // layout="horizontal"

          align="center"
        >
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
        <Divider
          // layout="horizontal"

          align="center"
        >
          <b>Investment Details</b>
        </Divider>
        <div className="grid">
          <div className="col-12 md:col-3">
            <div className="font-semibold mb-1 text-500">Investment Amount</div>
            <div className="font-light mb-1 text-600">
              {Currency(data?.investmentAmount)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorViewDetails;
