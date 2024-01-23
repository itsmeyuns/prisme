import React, { memo, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import moment from "moment";
import { defaultOptions } from "../../../utils/chart/defaultOptions";
import useChartTheme from "../../../hooks/useChartTheme";

const series = [
  { name: "DENOMINATION_OPCVM", data: "opc_b100" },
  { name: "Nom_Benchmark", data: "benc_b100" },
];

const objh = {
  f_vl: 207004.72550979865,
  rang_perf_1M: 1,
  rang_perf_3M: 1,
  DENOMINATION_OPCVM: "RMA EXPANSION",
  Nom_Benchmark: "MASI RENTABILITE BRUT",
  Nb: 89,
  ajust_b100: 100,
  q_95: 0,
  encours_OPC: 828053029.75,
  ord: 1,
  quart1: 0,
  quart2: 0,
  quartile: 1,
  mini: 99.99999999999999,
  quartile_graph_3M: 4,
  quart3: 1.4210854715202004e-14,
  q_05: 99.99999999999999,
  Rang: 3,
  quartile_perf_1S: 1,
  cat_b100: 100,
  rang_perf_1S: 3,
  VL: 207004.72550979865,
  maxi: 100.00000000000001,
  Date_VL: "2019-01-03T23:00:00.000+00:00",
  opc_b100: 100,
  benc_b100: 100,
  quartile_perf_3M: 1,
  quartile_perf_1M: 1,
};

const rangeOpts = {
  z: -1,
  tooltip: {
    show: false,
  },
  lineStyle: {
    opacity: 0,
  },
  emphasis: {
    disabled: true,
  },
  symbolSize: 0,
};

const PreQuantile = ({ data }) => {
  const theme = useChartTheme();
  const allValues = useMemo(
    () => series.map((serie) => data.map((item) => item[serie.data])).flat(),
    [data]
  );

  const rangeValues = {
    q_05: data.map((item) => item.q_05),
    quart1: data.map((item) => item.quart1),
    quart2: data.map((item) => item.quart2),
    quart3: data.map((item) => item.quart3),
    q_95: data.map((item) => item.q_95),
  };
  const yMin = Math.trunc(Math.min(...allValues, ...rangeValues.q_05));

  console.log("allValues", allValues, yMin);
  const legendData = useMemo(
    () => series.map((serie) => data[0][serie.name]),
    [series, data]
  );
  const quart1Values = Array.from(
    { length: rangeValues.q_05.length },
    (_, index) => rangeValues.q_05[index] + rangeValues.quart1[index]
  );
  const quart2Values = Array.from(
    { length: rangeValues.quart1.length },
    (_, index) => rangeValues.q_05[index] + rangeValues.quart2[index]
  );
  const quart3Values = Array.from(
    { length: rangeValues.quart2.length },
    (_, index) => rangeValues.q_05[index] + rangeValues.quart3[index]
  );
  const q_95Values = Array.from(
    { length: rangeValues.quart3.length },
    (_, index) => rangeValues.q_05[index] + rangeValues.q_95[index]
  );
  const baseSeries = series.map((serie) => ({
    name:
      serie.name === "ajust_b100"
        ? "Perf ajustée de la classe"
        : data[0][serie.name],
    type: "line",
    data: data.map((item) => item[serie.data]),
  }));
  const q_05 = useMemo(() => {
    return {
      name: "q_05",
      stack: "q_05",
      type: "line",
      symbol: "none",
      tooltip: {
        show: false,
      },
      lineStyle: {
        opacity: 0,
      },
      emphasis: {
        disabled: true,
      },
      symbolSize: 0,
      data: rangeValues.q_05,
    };
  }, [data]);
  const quart1 = useMemo(() => {
    return {
      name: "quart1",
      stack: "q_05",
      type: "line",
      data: rangeValues.quart1,
      areaStyle: {
        // color: "#8b8bc6",
        color: "#d25a5a",
        opacity: 1,
        origin: "start",
      },
      ...rangeOpts,
    };
  }, [data]);
  const quart2 = useMemo(() => {
    return {
      name: "quart2",
      stack: "q_05",
      type: "line",
      data: rangeValues.quart2,
      areaStyle: {
        color: "#4a4ac8",
        color: "#d43c3c",
        opacity: 1,
        origin: "start",
      },
      ...rangeOpts,
    };
  }, [data]);
  const quart3 = useMemo(() => {
    return {
      name: "quart3",
      stack: "q_05",
      type: "line",
      data: rangeValues.quart3,
      areaStyle: {
        color: "#5a5ad6",
        color: "#d51f1f",
        opacity: 1,
        origin: "start",
      },
      ...rangeOpts,
    };
  }, [data]);
  const q_95 = useMemo(() => {
    return {
      name: "q_95",
      stack: "q_05",
      type: "line",
      data: rangeValues.q_95,
      showInLegend: false,
      areaStyle: {
        color: "#5500ff",
        color: "#f90000",
        opacity: 1,
        origin: "start",
      },
      ...rangeOpts,
    };
  }, [data]);
  const seriesData = baseSeries.concat([q_05, quart1, quart2, quart3, q_95]);

  const options = useMemo(() => {
    return {
      title: {
        text: "",
        left: "center",
        ...theme.title,
      },
      grid: {
        right: "20%",
        top: "10%",
        // right: "3%",
        bottom: "15%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: true,
          },
          restore: {},
          saveAsImage: {},
          dataView: {},
        },
        top: "20px",
      },
      tooltip: {
        trigger: "axis",
        textStyle: {
          overflow: "breakAll",
          width: 40,
        },
        confine: true,
        valueFormatter: (value) => value?.toFixed(2),
      },
      xAxis: {
        type: "category",
        data: data.map((item) => moment(item.Date_VL).format("DD/MM/YYYY")),
        axisLabel: {
          ...theme.xAxis.nameTextStyle,
        },
        ...theme.xAxis,
      },
      legend: {
        data: legendData,
        type: "scroll",
        orient: "horizontal",
        zLevel: 23,
        width: "60%",
        left: "center",
        bottom: "9%",
        ...theme.legend,
      },
      yAxis: {
        type: "value",
        min: yMin,
        axisLabel: {
          ...theme.yAxis.nameTextStyle,
        },
        ...theme.yAxis,
      },
      series: seriesData,
      ...defaultOptions,
    };
  }, [defaultOptions, data, series, allValues, theme]);
  return (
    <>
      <ReactECharts
        option={options}
        style={{
          height: "500px",
          maxHeight: "600px",
        }}
      />
    </>
  );
};

export default memo(PreQuantile);
