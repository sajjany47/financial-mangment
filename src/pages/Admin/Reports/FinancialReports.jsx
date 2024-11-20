import { useEffect, useState } from "react";
import Loader from "../../../component/Loader";
import { Calendar } from "primereact/calendar";
import PieChart from "../../../component/chart/PieChart";
import { ColorCode, MonthColors } from "../../../shared/Config";
import { Card } from "primereact/card";
import BarChart from "../../../component/chart/BarChart";
import moment from "moment";

const FinancialReports = () => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(null);

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

    setLoading(false);
  }, []);

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
              onChange={(e) => setDate(e.value)}
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
                  data={[40, 22, 12]}
                  color={[
                    ColorCode.DARK_BLUE,
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
                  ]}
                  data={[1600000, 600000, 1000000]}
                  color={[
                    ColorCode.MEDIUM_BLUE,
                    ColorCode.YELLOW,
                    ColorCode.ORANGE,
                  ]}
                />
              </div>
            </Card>
          </div>
          <div className="sm:col-12 md:col-12">
            <Card title="Investor Month Wise Report">
              <div style={{ height: "300px" }}>
                <BarChart
                  data={[65, 59, 80, 81, 56, 55, 40, 34, 76, 20, 47, 98]}
                  dataSetLabel="Newly Added Investors"
                  label={MonthColors.map((item) => item.month)}
                  color={"#00C49A"}
                />
              </div>
            </Card>
          </div>
          <div className="sm:col-12 md:col-12">
            <Card title="Investment Month Wise Report">
              <div style={{ height: "300px" }}>
                <BarChart
                  data={[
                    65000, 59000, 80000, 81000, 56000, 55000, 40000, 34000,
                    76000, 20000, 47000, 98000,
                  ]}
                  dataSetLabel="Newly Added Investment"
                  label={MonthColors.map((item) => item.month)}
                  color={"#FF5E00"}
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
