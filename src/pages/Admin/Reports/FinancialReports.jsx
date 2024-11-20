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
                  dataset={[
                    {
                      label: "Investors",
                      data: [65, 59, 80, 81, 56, 55, 40, 34, 76, 20, 47, 98],
                      backgroundColor: "#00C49A",
                      borderWidth: 1,
                      barThickness: 40,
                    },
                  ]}
                  label={MonthColors.map((item) => item.month)}
                />
              </div>
            </Card>
          </div>
          <div className="sm:col-12 md:col-12">
            <Card title="Investment Month Wise Report">
              <div style={{ height: "300px" }}>
                <BarChart
                  dataset={[
                    {
                      label: "Investment",
                      data: [
                        65000, 59000, 80000, 81000, 56000, 55000, 40000, 34000,
                        76000, 20000, 47000, 98000,
                      ],
                      backgroundColor: "#FF5E00",
                      borderWidth: 1,
                      barThickness: 40,
                    },
                    {
                      label: "Reedem",
                      data: [
                        6500, 5900, 8000, 8100, 5600, 5500, 4000, 3400, 7600,
                        2000, 4700, 9800,
                      ],
                      backgroundColor: "#8A2BE2",
                      borderWidth: 1,
                      barThickness: 40,
                    },
                  ]}
                  label={MonthColors.map((item) => item.month)}
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
