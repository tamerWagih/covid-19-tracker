import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { numeral } from 'numeral';

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: 'index',
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.valu).format('+0,0');
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          format: 'MM/DD/YY',
          tooltipFormat: 'll',
        },
      },
    ],
    yAxes: [
      {
        grindLines: {
          displaye: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format('0a');
          },
        },
      },
    ],
  },
};

function LineGraph() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const chartData = builChartdData(data);
          setData(chartData);
        });
    };

    fetchData();
  }, []);

  const builChartdData = (data, casesType = 'casses') => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data[casesType]) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }

    return chartData;
  };
  return (
    <div>
      <h1>LineGraph</h1>
      <Line
        data={{
          datasets: [
            {
              backgroundColor: 'rgba(204, 16, 52, 0.5)',
              borderColor: '#cc1034',
              data: data,
            },
          ],
        }}
        options={options}
      />
    </div>
  );
}

export default LineGraph;