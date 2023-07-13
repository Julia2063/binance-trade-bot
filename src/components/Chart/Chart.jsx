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
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



const tooltipLine = {
  
  id: 'tooltipLine',
  beforeDraw: (chart) => {
    
    if(chart.tooltip._active && chart.tooltip._active.length) {
        const ctx = chart.ctx;
        ctx.save();
        const activePoint = chart.tooltip._active[0];
        ctx.beginPath();
        ctx.setLineDash([5, 7]);
        ctx.moveTo(activePoint.element.x, chart.chartArea.top);
        ctx.lineTo(activePoint.element.x, chart.chartArea.bottom);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#F3BA2F';
        ctx.stroke();
        ctx.restore();
        }
  }
};

const getRadius = {
 id: 'getRadius',
 afterDraw: (chart) => {

    if(chart.tooltip._active[0]) {
      const { ctx } = chart;
      ctx.save();
      const activePoint = chart.tooltip._active[0];
      const datapoint = activePoint.index;
      const datasetIndex = activePoint.datasetIndex;

      const xPoint = chart.getDatasetMeta(datasetIndex).data[datapoint].tooltipPosition().x;
      switch (true) {
        case chart.chartArea.right - xPoint < chart.tooltip.width :
          chart.options.plugins.tooltip.cornerRadius = {topLeft: 10, topRight: 10, bottomLeft: 10, bottomRight: 0};
          chart.options.plugins.tooltip.xAlign = 'right';
          chart.update();
          break;
         
        default: 
          chart.options.plugins.tooltip.cornerRadius = {topLeft: 10, topRight: 10, bottomRight: 10, bottomLeft: 0 };
          chart.options.plugins.tooltip.xAlign = 'left +';
          chart.update();
          break;
        }}}
};


export const options = {
 
  responsive: true,
  interaction: {
    intersect: false,
  },
  
  plugins: {
      title: {
      display: true,
      align: 'start',
      text: 'Statistics',
          color: '#F5F5F5',
          font: {
            size: 18,
            lineHeight: '27px',
            weight: 500,
            family: "DM Sans"
        }
    },
    legend: {
      align: 'end',
      labels: {
        usePointStyle: true,
        font: {
          size: 14,
          lineHeight: '21px',
          weight: 500,
          
      },
        color: 'white',
        boxWidth: 20,
        generateLabels: (chart) => {
          return chart.data.datasets.map((dataset, index) => ({
            text: dataset.label,
            fillStyle: dataset.backgroundColor,
            strokeStyle: dataset.borderColor,
            pointStyle: 'circle',

          }))
        }
      }
  },
  
    tooltip: {
  
      titleFont: {
        size: 12,
        lineHeight: '18px',
        weight: 400,
      },
      bodyFont: {
        size: 12,
        lineHeight: '18px',
        weight: 400,
      },
      position: "nearest",
      displayColors: false,
      backgroundColor: '#1D4927',
      caretSize: 0,
      yAlign: 'bottom',
      
  
      caretPadding: 10,
      padding: 10,
      colorBox: false,

      callbacks: {
        title: function(context) {
        
          return context[0].label.split(',').join(' ');
        },

        label: function(context) {
          return `$${context.formattedValue}`  ;
        }
    }
  }
  },
  scales: {
   
    y: {
     
        border: {
          display:true,
          color: '#fff',
          width: 10,
        },
      
        title: {
          display: true,
          position: 'top',
          
        },
        ticks: {
            color: '#F5F5F5',
            callback: function(value, index, ticks) {
              return value + '$' ;
            }
        },
        grid: {
        
            drawTicks: false,
            drawBorder : true,
         
            borderDash : [5,5],
            borderDashOffset : 2,
            borderWidth : 2,
        
            color: '#383838',
        }
    },
    x: {
     
      ticks: {
      
        color: '#F5F5F5',
        font: {
          size: 10,
          lineHeight: '14px',
          weight: 400,
      },
      
    },

    grid: {
      borderDash : [5,5],
      borderDashOffset : 2,
      borderWidth : 2,
      color: (ctx) => {
        
        if(ctx.index === 0 ) {
          return '#383838';
        } else {
          return 'transparent'
        }
      }
    }}
  }
};

export function Chart(props) {
  const { times, profit } = props;
  const labels = times.map(el =>  el.split(' '));

   const data = {
   labels,
   datasets: [
    {
      label: 'USDT',
      data: profit,
      borderColor: '#F3BA2F',
      backgroundColor: '#F3BA2F',
      pointStyleWidth: 10,
      tension: 0.5,
      borderWidth: 1,
     
      pointBackgroundColor: 'transparent',
      pointBorderColor: 'transparent',
      pointHoverBorderColor: '#FFF',
      pointHoverBackgroundColor: '#73BB82',
      
    },
  ],
};

  return <div style={{ width: '100%'}}>  <Line  id="myChart" plugins={[tooltipLine, getRadius]} options={options} data={data} {...props}/> </div>
 
}
