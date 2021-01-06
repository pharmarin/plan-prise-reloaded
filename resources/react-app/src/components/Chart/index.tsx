import React from 'react';
import { Line } from 'react-chartjs-2';

const Chart: React.FC<{ color: Colors; data: number[]; labels: string[] }> = ({
  color,
  data,
  labels,
}) => {
  const graphColor = (opacity: number) => {
    switch (color) {
      case 'pink':
        return `rgba(190, 24, 93, ${opacity})`;
      case 'blue':
      default:
        return `rgba(29, 78, 216, ${opacity})`;
    }
  };

  return (
    <Line
      data={(canvas) => {
        const context = (canvas as HTMLCanvasElement).getContext('2d');

        const gradient = context
          ? context.createLinearGradient(0, 0, 0, 100)
          : undefined;

        if (gradient) {
          gradient.addColorStop(0, graphColor(0.75));
          gradient.addColorStop(1, graphColor(0));
        }

        return {
          labels,
          datasets: [
            {
              backgroundColor: gradient,
              borderColor: graphColor(1),
              data,
            },
          ],
        };
      }}
      options={{
        legend: { display: false },
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: { display: false },
            },
          ],
          yAxes: [
            {
              gridLines: { display: false },
              ticks: { beginAtZero: true, maxTicksLimit: 5 },
            },
          ],
        },
        tooltips: {
          backgroundColor: '#FFF',
          bodyFontColor: graphColor(1),
          bodyFontSize: 14,
          callbacks: {
            title: function () {
              return '';
            },
            label: function () {
              return '';
            },
            afterLabel: function (tooltipItem, data) {
              return String(
                data?.datasets?.[tooltipItem?.datasetIndex || 0]?.data?.[
                  tooltipItem?.index || 0
                ] || ''
              );
            },
          },
          caretSize: 0,
          displayColors: false,
          position: 'nearest',
          titleFontSize: 16,
          xPadding: 10,
        },
      }}
      type="line"
    />
  );
};

export default Chart;
