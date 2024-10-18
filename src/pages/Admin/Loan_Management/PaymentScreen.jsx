/* eslint-disable react/prop-types */
import moment from "moment";
import { Currency } from "../../../component/FieldType";
import { Button } from "primereact/button";

const PaymentScreen = ({ data, clickData }) => {
  return (
    <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-1 mb-6 surface-0">
      <div className="grid">
        {data.map((item, index) => {
          const unpaidIndex = data.findIndex((emi) => !emi.isPaid);
          return (
            <div className="col-12 lg:col-4" key={item._id}>
              <div className="p-3 h-full">
                <div
                  className="shadow-2 p-3 h-full flex flex-column"
                  style={{ borderRadius: "6px" }}
                >
                  <div className="text-900 font-medium text-xl mb-2">
                    {moment(item.emiDate).format("DD MMM,YYYY")} ({index + 1}/
                    {data.length + 1} )
                  </div>
                  <div className="text-600">{Currency(item.emiAmount)}</div>
                  <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                  <div className="flex align-items-center">
                    <span className="font-bold text-2xl text-900">
                      {Currency(item.payableAmount)}
                    </span>
                    <span className="ml-2 font-medium text-600">
                      Payable Amount
                    </span>
                  </div>
                  <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                  <ul className="list-none p-0 m-0 flex-grow-1">
                    <li className="flex align-items-center mb-2 justify-content-between">
                      <span className="text-600 ">Principle Paid </span>
                      <span>{Currency(item.principalPaid)}</span>
                    </li>
                    <li className="flex align-items-center mb-2 justify-content-between">
                      <span className="text-600 ">Interest Paid </span>
                      <span>{Currency(item.interestPaid)}</span>
                    </li>
                    <li className="flex align-items-center mb-2 justify-content-between">
                      <span className="text-600 ">Overdue (In Days) </span>
                      <span>{item.overdueDays}</span>
                    </li>
                    <li className="flex align-items-center mb-2 justify-content-between">
                      <span className="text-600 ">Overdue Paid </span>
                      <span>{Currency(item.overdueAmount)}</span>
                    </li>
                    <li className="flex align-items-center mb-2 justify-content-between">
                      <span className="text-600 ">Remaining Outstanding </span>
                      <span>{Currency(item.remainingOutstanding)}</span>
                    </li>
                    <li className="flex align-items-center mb-2 justify-content-between">
                      <span className="text-600 ">Foreclosure Amount</span>
                      <span>
                        {item.foreclosureAmount === "Not applicable"
                          ? "Not applicable"
                          : Currency(item.foreclosureAmount)}
                      </span>
                    </li>
                  </ul>
                  <hr className="mb-3 mx-0 border-top-1 border-bottom-none border-300 mt-auto" />
                  <Button
                    label={item.isPaid ? "Paid" : "Pay Now"}
                    className="p-3 w-full mt-auto"
                    disabled={index !== unpaidIndex || item.isPaid}
                    severity={item.isPaid ? "success" : "primary"}
                    onClick={() => clickData(item)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentScreen;
