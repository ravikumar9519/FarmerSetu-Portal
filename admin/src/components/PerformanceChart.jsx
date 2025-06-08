/* eslint-disable react/prop-types */
// src/components/admin/PerformanceChart.jsx
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const PerformanceChart = ({ completed = 0, cancelled = 0, total = 0 }) => {
  const pending = Math.max(total - completed - cancelled, 0)

  const data = {
    labels: ['Completed', 'Cancelled', 'Pending'],
    datasets: [
      {
        label: 'Appointments',
        data: [completed, cancelled, pending],
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
        borderWidth: 1,
      },
    ],
  }

  return <Pie data={data} />
}

export default PerformanceChart
