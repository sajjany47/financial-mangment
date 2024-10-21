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
            <div className="text-500 w-full md:w-8 md:flex-order-0 flex-order-1">
              <div className="p-grid">
                <div className="p-col-12 p-md-4 m-1 ">
                  <strong>Name: </strong> {data?.name}
                </div>
                <div className="p-col-12 p-md-4 m-1 ">
                  <strong>Mobile: </strong> {data?.mobile}
                </div>
                <div className="p-col-12 p-md-4 m-1">
                  <strong>Email: </strong> {data?.email}
                </div>
                <div className="p-col-12 p-md-4 m-1">
                  <strong>DOB: </strong>{" "}
                  {moment(data?.dob).format("DD MMM,YYYY")}
                </div>
                <div className="p-col-12 p-md-4 m-1">
                  <strong>Father Name: </strong> {data?.fatherName}
                </div>
                <div className="p-col-12 p-md-4 m-1">
                  <strong>Mother Name: </strong> {data?.motherName}
                </div>
              </div>
            </div>
          </li>

          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Director</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              Michael Mann
            </div>
            <div className="w-6 md:w-2 flex justify-content-end">
              <Button
                label="Edit"
                icon="pi pi-pencil"
                className="p-button-text"
              />
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Actors</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              Robert De Niro, Al Pacino
            </div>
            <div className="w-6 md:w-2 flex justify-content-end">
              <Button
                label="Edit"
                icon="pi pi-pencil"
                className="p-button-text"
              />
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
