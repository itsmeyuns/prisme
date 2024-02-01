import React, { memo, useMemo, useRef } from "react";
import ReactECharts from "echarts-for-react";
import useChartTheme from "../../../hooks/useChartTheme";
import { useSelector } from "react-redux";
import SaveToExcel from "../../SaveToExcel";
import { extractKeys } from "../../../utils/extractKeys";
import {
  defaultOptions,
  getFullscreenFeature,
} from "../../../utils/chart/defaultOptions";
import useSeriesSelector from "../../../hooks/useSeriesSelector";

const getOptions = (
  data,
  seriesNames,
  title,
  theme,
  selectedLegend = [],
  chartRef,
  ptf = ""
) => {
  const myFullscreen = getFullscreenFeature(chartRef);
  return {
    title: {
      text: title,
      left: "center",
      ...theme.title,
    },
    grid: {
      // right: "10%",
      top: "10%",
      // right: "3%",
      bottom: "15%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        myFullscreen,
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
      data: data.map((item) => item.seance),
      axisLabel: {
        ...theme.xAxis.nameTextStyle,
      },
      ...theme.xAxis,
    },
    legend: {
      // data: seriesNames,
      orient: "horizontal",
      zLevel: 23,
      width: "50%",
      left: "center",
      bottom: "9%",
      type: "scroll",
      selected: selectedLegend,
      ...theme.legend,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        ...theme.yAxis.nameTextStyle,
      },
      ...theme.yAxis,
    },
    series: seriesNames.map((seriesName) => ({
      name: seriesName === "returns_mv_cum" && ptf ? ptf : seriesName,
      type: "line",
      symbol: "none",
      data: data.map((item) => item[seriesName] * 100),
    })),
    ...defaultOptions,
  };
};
const simOpt = "SIM optimal";
const Cumualative = ({ data, forSIM }) => {
  const { selectedPtf } = useSelector((state) => state.backtest);
  console.log("render Cumualative", data, selectedPtf);
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const theme = useChartTheme();
  const seriesNames = useMemo(
    () =>
      extractKeys(data, ["seance", "returns_mv_cum"])
        .filter(
          (serie) => serie === selectedPtf || serie.startsWith("returns_mv_cum")
        )
        .map((item) =>
          item.startsWith("returns_mv_cum")
            ? item.replace(/^returns_mv_cum_/, "")
            : item
        ),
    [data]
  );

  const seriesNames2 = useMemo(() => {
    const originalArray = Object.keys(data[0]).filter(
      (key) => key !== "seance" && key !== selectedPtf
    );

    const index = originalArray.indexOf("returns_mv_cum");

    if (index !== -1) {
      originalArray.splice(index, 1); // Remove 'returns_mv_cum' from its current position
      originalArray.unshift("returns_mv_cum"); // Add 'returns_mv_cum' to the beginning
    }

    return originalArray;
  }, [data, selectedPtf]);
  console.log("seriesNames - 1", seriesNames, "seriesNames2", seriesNames2);
  const init = forSIM ? [seriesNames[0], simOpt] : seriesNames;
  console.log("cumlative init", init, forSIM);
  const { SeriesSelector, selectedLegend } = useSeriesSelector(
    seriesNames,
    init
  );
  const { SeriesSelector: SeriesSelector2, selectedLegend: selectedLegend2 } =
    useSeriesSelector(seriesNames, init);
  const options = useMemo(
    () =>
      getOptions(
        data,
        seriesNames,
        "Cumulative Returns vs Benchmark",
        theme,
        selectedLegend,
        chart1Ref
      ),
    [theme, data, selectedLegend, seriesNames]
  );
  const options2 = useMemo(
    () =>
      getOptions(
        data,
        seriesNames,
        "Cumulative Returns vs Benchmark (Log Scaled)",
        theme,
        selectedLegend2,
        chart2Ref,
        selectedPtf
      ),
    [theme, data, selectedLegend2, seriesNames, selectedPtf]
  );
  console.log(
    "getOptions",
    getOptions(data, seriesNames, "Cumulative Returns vs Benchmark", theme)
  );
  return (
    <>
      <div className="relative">
        <SaveToExcel data={data} fileName="Cumulative Returns vs Benchmark" />
        <SeriesSelector />
        <ReactECharts
          option={options}
          ref={chart1Ref}
          style={{
            minHeight: 500,
            margin: "15px 0",
          }}
        />
      </div>
      <div className="realative">
        <SeriesSelector2 />
        <ReactECharts
          ref={chart2Ref}
          option={options2}
          style={{
            minHeight: 500,
            margin: "15px 0",
          }}
        />
      </div>
    </>
  );
};

export default memo(Cumualative);
