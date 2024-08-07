import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { getLast7Days } from "../../lib/features";

ChartJS.register(
  Tooltip,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend
);

const lineChartLabels = getLast7Days();

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 80
};

const LineChart = ({ value = [] }) => {
  const data = {
    labels: lineChartLabels,
    datasets: [
      {
        data: value,
        label: "Messages",
        fill: true,
        backgroundColor: "#BEFFF7",
        borderColor: "#6499E9",
      },
    ],
  };

  return <Line data={data} options={lineChartOptions} />;
};

const DoughnutChart = ({ value, labels }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor: ["#BEFFF7", "#0d34be"],
        borderColor: ["#abb9ea", "#abb9ea" ],
        offset: 15
      },
    ],
  };

  return <Doughnut style={{ zIndex: 10 }} data={data} options={doughnutChartOptions} />;
};

export { DoughnutChart, LineChart };
