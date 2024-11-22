import { useEffect, useState } from "react";
import Loader from "../../../component/Loader";
import { Calendar } from "primereact/calendar";
import PieChart from "../../../component/chart/PieChart";
import { ColorCode } from "../../../shared/Config";
import { Card } from "primereact/card";
import BarChart from "../../../component/chart/BarChart";
import moment from "moment";
import { FinanceYearReport } from "./ReportService";

const FinancialReports = () => {
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
    FinanceYearReport({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })
      .then((res) => {
        setData(res.data);
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
            {"Financial Reports"}
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
            <Card title="Investor Report">
              <div style={{ height: "300px" }}>
                <PieChart
                  label={[
                    "Total Investor",
                    "Active Investor",
                    "Newly Added Investors",
                  ]}
                  data={[
                    data?.investor?.totalInvestor,
                    data?.investor?.totalActiveInvestor,
                    data?.investor?.newInvestor,
                  ]}
                  color={[
                    ColorCode.GREEN,
                    ColorCode.RED_ORANGE,
                    ColorCode.CYAN,
                  ]}
                />
              </div>
            </Card>
          </div>
          <div className="sm:col-12 md:col-6">
            <Card title="Investment Report">
              <div style={{ height: "300px" }}>
                <PieChart
                  label={[
                    "Total Investment Amount",
                    "Reedem Amount",
                    "Remaining Amount",
                    "New Investment Amount",
                  ]}
                  data={[
                    data?.investment?.totalInvestment,
                    data?.investment?.reedemAmount,
                    data?.investment?.remainingInvestAmount,
                    data?.investment?.newInvestment,
                  ]}
                  color={[
                    ColorCode.MEDIUM_BLUE,
                    ColorCode.RED_ORANGE,
                    ColorCode.ORANGE,
                    ColorCode.GREEN,
                  ]}
                />
              </div>
            </Card>
          </div>
          <div className="sm:col-12 md:col-12">
            <Card title="Investment Month Wise Report">
              <div style={{ height: "400px" }}>
                <BarChart
                  dataset={[
                    {
                      label: "Investment",
                      data: data?.monthWiseInvestor?.map(
                        (item) => item.totalInvestAmount
                      ),
                      backgroundColor: ColorCode.CYAN,
                      borderWidth: 1,
                      barThickness: 50,
                    },
                  ]}
                  label={data?.monthWiseInvestor?.map((item) => item._id)}
                />
              </div>
            </Card>
          </div>
          <div className="sm:col-12 md:col-12">
            <Card title="Investor Month Wise Report">
              <div style={{ height: "400px" }}>
                <BarChart
                  dataset={[
                    {
                      label: "Investment",
                      data: data?.monthWiseInvestor?.map(
                        (item) => item.totalInvestorCount
                      ),
                      backgroundColor: ColorCode.GREEN,
                      borderWidth: 1,
                      barThickness: 50,
                    },
                  ]}
                  label={data?.monthWiseInvestor?.map((item) => item._id)}
                />
              </div>
            </Card>
          </div>
          <div className="sm:col-12 md:col-12">
            <Card title="Reedem Month Wise Report">
              <div style={{ height: "400px" }}>
                <BarChart
                  dataset={[
                    {
                      label: "Reedem",
                      data: data?.monthWiseReedem?.map(
                        (item) => item.totalReedemAmount
                      ),
                      backgroundColor: ColorCode.PINK,
                      borderWidth: 1,
                      barThickness: 50,
                    },
                  ]}
                  label={data?.monthWiseReedem?.map((item) => item._id)}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancialReports;
