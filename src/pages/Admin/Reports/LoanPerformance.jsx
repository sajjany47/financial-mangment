import moment from "moment";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../../../component/Loader";
import { Calendar } from "primereact/calendar";
import { FinanceYearLoanReport } from "./ReportService";
import { Card } from "primereact/card";
import BarChart from "../../../component/chart/BarChart";
import { ColorCode } from "../../../shared/Config";
import PieChart from "../../../component/chart/PieChart";

const LoanPerformance = () => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(null);
  const [data, setData] = useState({});

  useEffect(() => {
    const currentDate = moment();
    let currentYear = currentDate.year();
    if (currentDate.month < 3) {
      currentYear -= 1;
    }
    const startOfFinancialYear = moment().year(currentYear).month(3).date(1);
    const endOfFinancialYear = moment()
      .year(currentYear + 1)
      .month(2)
      .date(31);
    setDate([new Date(startOfFinancialYear), new Date(endOfFinancialYear)]);
    reportData(new Date(startOfFinancialYear), new Date(endOfFinancialYear));
  }, []);

  const reportData = (startDate, endDate) => {
    setLoading(true);
    FinanceYearLoanReport({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })
      .then((res) => {
        const allMonths = new Set([
          ...res.data.monthWiseLead.map((item) => item._id),
          ...res.data.monthWiseLoan.map((item) => item._id),
        ]);
        const mergedData = Array.from(allMonths).map((month) => {
          const lead =
            res.data.monthWiseLead.find((item) => item._id === month)?.total ||
            0;
          const loan =
            res.data.monthWiseLoan.find((item) => item._id === month)?.total ||
            0;
          return {
            month,
            lead,
            loan,
          };
        });
        setData({ ...res.data, loanMonthWise: mergedData });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handelDateChange = (e) => {
    if (e[1] !== null) {
      reportData(new Date(e[0]), new Date(e[1]));
    }

    setDate(e);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="border-2 border-dashed surface-border border-round surface-ground font-medium mt-3 mb-6 p-3">
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
          <span className="text-xl text-900 font-bold">
            {"Loan Performance"}
          </span>
          <div className="flex gap-2">
            <Calendar
              value={date}
              onChange={(e) => {
                handelDateChange(e.value);
              }}
              view="month"
              dateFormat="mm/yy"
              selectionMode="range"
            />
          </div>
        </div>
        <div className="grid justify-content-around mt-4">
          <div className="sm:col-12 md:col-6">
            <Card title="Loan Performance">
              <div style={{ height: "300px" }}>
                <PieChart
                  label={[
                    "Total Lead",
                    "Approved Loan",
                    "Incompleted Loan",
                    "Rejected Loan",
                  ]}
                  data={[
                    data?.loan?.lead,
                    data?.loan?.approvedLoan,
                    data?.loan?.incompletedLoan,
                    data?.loan?.rejectLoan,
                  ]}
                  color={[
                    ColorCode.GREEN,
                    ColorCode.RED_ORANGE,
                    ColorCode.CYAN,
                    ColorCode.RED,
                  ]}
                />
              </div>
            </Card>
          </div>
          <div className="sm:col-12 md:col-6">
            <Card title="EMI Report">
              <div style={{ height: "300px" }}>
                <PieChart
                  label={[
                    "Total EMI",
                    "Paid EMI",
                    "Unpaid EMI",
                    "Defaulter EMI",
                  ]}
                  data={[
                    data?.emi?.totalEmi,
                    data?.emi?.paidEmi,
                    data?.emi?.unpaidEmi,
                    data?.emi?.defaultEmi,
                  ]}
                  color={[
                    ColorCode.MEDIUM_BLUE,
                    ColorCode.RED_ORANGE,
                    ColorCode.ORANGE,
                    ColorCode.RED,
                  ]}
                />
              </div>
            </Card>
          </div>
          <div className="sm:col-12 md:col-12">
            <Card title="Loan Performance Month Wise Report">
              <div style={{ height: "400px" }}>
                <BarChart
                  dataset={[
                    {
                      label: "Lead",
                      data: data?.loanMonthWise?.map((item) => item.lead),
                      backgroundColor: ColorCode.CYAN,
                      borderWidth: 1,
                      barThickness: 50,
                    },
                    {
                      label: "Loan",
                      data: data?.loanMonthWise?.map((item) => item.loan),
                      backgroundColor: ColorCode.DARK_BLUE,
                      borderWidth: 1,
                      barThickness: 50,
                    },
                  ]}
                  label={data?.loanMonthWise?.map((item) => item.month)}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoanPerformance;
