import React, { memo, useMemo, useRef } from "react";
import ReactECharts from "echarts-for-react";
import useChartTheme from "../../../hooks/useChartTheme";
import groupBy from "../../../utils/groupBy";
import { getFullscreenFeature } from "../../../utils/chart/defaultOptions.js";

function transformData(data, months) {
  const heatmapData = [];
  data.forEach((item) => {
    months.forEach((month) => {
      console.log("month", month);
      heatmapData.push([month, item.index, item[month].toFixed(2)]);
    });
  });
  return heatmapData;
}

const MonthlyReturns = ({ data, title }) => {
  const theme = useChartTheme();
  const chartRef = useRef(null);
  const myFullscreen = getFullscreenFeature(chartRef);
  const years = useMemo(
    () => [...new Set(data.map((item) => item.index))],
    [data]
  );
  const months = useMemo(
    () =>
      Object.keys(data[0]).filter(
        (key) => !["benchmark", "index"].includes(key)
      ),
    [data]
  );
  const grouped = useMemo(() => groupBy(data, "benchmark"), [data]);
  const keys = Object.keys(grouped);

  const heatmapData = useMemo(
    () => transformData(grouped[keys[0]], months),
    [grouped, months]
  );
  console.log("heatmapData", heatmapData, "grouped", grouped);
  console.log("MonthlyReturns rendred", months);
  const values = useMemo(
    () => heatmapData.map((item) => +item[2]),
    [heatmapData]
  );
  console.log(
    "MonthlyReturns values",
    Math.min(...values),
    Math.max(...values)
  );

  const options = useMemo(() => {
    return {
      title: {
        text: title,
        left: "center",
        ...theme.title,
      },
      tooltip: {
        // position: "top",
        formatter: function (params) {
          return `${params.value[0]} - ${params.value[1]} : <strong>${params.value[2]}%</strong>`;
        },
      },
      animation: false,
      xAxis: {
        type: "category",
        data: months,
        splitArea: {
          show: true,
        },
        axisLabel: {
          ...theme.xAxis.nameTextStyle,
        },
        ...theme.xAxis,
      },
      yAxis: {
        type: "category",
        data: years,
        splitArea: {
          show: true,
        },
        axisLabel: {
          ...theme.xAxis.nameTextStyle,
        },
        ...theme.yAxis,
      },
      visualMap: {
        min: Math.min(...values),
        max: Math.max(...values),
        calculable: true,
        orient: "vertical",
        right: "0",
        top: "20%",
        inRange: {
          color: [
            "#a50026",
            "#fecc7b",
            "#feea9b",
            "#fffebe",
            "#e8f59f",
            "#9bd469",
            "#0e8245",
          ],
        },
        ...theme.title,
      },
      toolbox: {
        feature: {
          myFullscreen,
          saveAsImage: {},
        },
        top: "20px",
      },
      series: [
        {
          name: "Heatmap Data",
          type: "heatmap",
          data: heatmapData,
          label: {
            show: true,
          },
        },
      ],
    };
  }, [heatmapData, theme, months, years, title, values]);
  return (
    <ReactECharts
      ref={chartRef}
      option={options}
      style={{
        height: 500,
      }}
    />
  );
};

export default memo(MonthlyReturns);
