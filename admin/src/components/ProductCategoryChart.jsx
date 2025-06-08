/* eslint-disable react/prop-types */
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

// Register components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Color generator
const generateColors = (count) => {
  const baseColors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
    "#9966FF", "#FF9F40", "#00B894", "#F368E0",
    "#6C5CE7", "#FAB1A0", "#81ECEC", "#74B9FF"
  ];
  return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
};

const ProductCategoryChart = ({ categoryData }) => {

  console.log("Category Data:", categoryData);
  
  if (!categoryData || categoryData.length === 0) {
    return <p className="text-sm text-center text-gray-500">No Data Available</p>;
  }
  console.log(categoryData);
  const labels = categoryData.map(item => item.category);
  const counts = categoryData.map(item => item.count);
  const colors = generateColors(labels.length);

  const data = {
    labels,
    datasets: [
      {
        label: "Products Sold",
        data: counts,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 12 },
        },
        title: {
          display: true,
          font: { size: 14, weight: "bold" }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Products Sold',
          font: { size: 14, weight: "bold" }
        }
      }
    },
  };

  return (
    <Bar data={data} options={options} />
  );
};

export default ProductCategoryChart;
