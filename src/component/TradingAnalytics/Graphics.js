import React from "react";
import { useState } from "react";
import Chart from "react-apexcharts";
const Graph = (props) => {
  const { graphData, name } = props;
  const [data, setData] = useState({
    series: [{ name: "sales", data: graphData }],
    options: {
      chart: {
        type: "bar",
        height: 380,
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        type: "category",
        title: {
          text: name,
        },
        group: {
          style: {
            fontSize: "10px",
            fontWeight: 700,
          },
        },
      },
      yaxis: [
        {
          title: {
            text: "No Of Trades",
          },
        },
      ],
      dataLabels: {
        enabled: false,
      },
      title: {},
    },
  });
  return (
    <>
      <Chart
        options={data.options}
        series={data.series}
        type="bar"
        height={368}
        width={515}
      />
    </>
  );
};

export default Graph;
