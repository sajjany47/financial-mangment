/* eslint-disable react/prop-types */
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
const PieChart = (props) => {
  const data = {
    labels: props.label,
    datasets: [
      {
        data: props.data,
        backgroundColor: props.color,
        borderWidth: 1,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    aspectRatio: 1,
  };
  return (
    <>
      <Pie data={data} options={options} />
    </>
  );
};

export default PieChart;
