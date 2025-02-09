
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom', // Ensure this matches allowed values: 'top' | 'bottom' | 'left' | 'right' | 'center'
      },
      title: {
        display: true,
        text: 'Weekly Reading',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const data = {
    labels,
    datasets: [
      {
        label: "Time Reading",
        data: [23, 100, 300, 2, 23, 0, 12],
        borderColor: 'rgb(55, 162, 204)',
        backgroundColor: 'rgba(84, 96, 253, 0.74)',
      },
    //   {
    //     label: '2023 Sales',
    //     data: [45, 70, 65, 89, 75, 85],
    //     borderColor: 'rgb(255, 99, 132)',
    //     backgroundColor: 'rgba(255, 99, 132, 0.5)',
    //   }
    ],
  };

  return (
    <div className="w-full h-96 p-4">
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChart;
