import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  
  responsive: true,
  plugins: {
    legend: {
      position: 'top' ,
    },
  },
  scales: {
    y: {
        title: {
          display: true,
          text: 'USDT',
        },
        /* ticks: {
            // Include a dollar sign in the ticks
            callback: function(value, index, ticks) {
                return '$' + value;
            }
        } */
    },
    x: {
      title: {
        display: true,
        text: 'Time',
      },
    }
}
};



export function Chart(props) {
  const { times, profit } = props;
  const labels = times;

  console.log(profit);

   const data = {
   labels,
   datasets: [
    {
      label: 'Profits',
      data: profit,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

  return <div style={{ width: '95%'}}>  <Line options={options} data={data} {...props}/> </div>
 
}
