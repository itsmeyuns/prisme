import React, { memo, useMemo, useRef, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import {
  defaultOptions,
  getExportToExcelFeature,
  getFullscreenFeature,
} from "../../../utils/chart/defaultOptions";
import useChartTheme from "../../../hooks/useChartTheme";
import useSeriesSelector from "../../../hooks/useSeriesSelector";
import { Box } from "@mui/material";
import SaveToExcel from "../../SaveToExcel";

const initSaveToExcel = {
  show: false,
  data: [],
  fileName: new Date().getTime(),
};

const LineChart = ({
  options,
  style,
  showSeriesSelector,
  saveToExcel = initSaveToExcel,
}) => {
  console.log(
    "LineChart baseoptions",
    options,
    saveToExcel,
    saveToExcel.fileName ? saveToExcel.fileName : initSaveToExcel.fileName
  );
  const chart = useRef(null);
  const myFullscreen = getFullscreenFeature(chart);
  const myExportToExcel = getExportToExcelFeature(saveToExcel);
  const theme = useChartTheme();
  const { show, data, fileName } = saveToExcel;
  console.log("render LineChart");
  const {
    title,
    grid,
    tooltip,
    xAxis,
    series,
    yAxis,
    legend,
    seriesNames: { seriesList = [], init = seriesList } = {},
    ...rest
  } = options;
  const { SeriesSelector, selectedLegend } = useSeriesSelector(
    seriesList,
    init
  );
  const {
    dataZoom: zoom,
    toolbox: {
      feature: { saveAsImage, dataZoom, restore, dataView },
    },
  } = defaultOptions;
  const baseOptions = useMemo(() => {
    return {
      title: {
        ...(title ?? {}),
        ...theme.title,
      },
      xAxis: Array.isArray(xAxis)
        ? yAxis.map((config) => ({
            ...(config ?? {}),
            axisLabel: {
              hideOverlap: true,
              ...config?.axisLabel,
              ...theme.xAxis.nameTextStyle,
            },
            ...theme.xAxis,
          }))
        : {
            ...(xAxis ?? {}),
            axisLabel: {
              hideOverlap: true,
              ...xAxis?.axisLabel,
              ...theme.xAxis.nameTextStyle,
            },
            ...theme.xAxis,
          },
      yAxis: Array.isArray(yAxis)
        ? yAxis.map((config) => ({
            ...config,
            type: "value",
            axisLabel: {
              hideOverlap: true,
              ...config?.axisLabel,
              ...theme.yAxis.nameTextStyle,
            },
            min: function (value) {
              return value?.min?.toFixed(2);
            },
            max: function (value) {
              return value?.max?.toFixed(2);
            },
            ...theme.yAxis,
          }))
        : {
            type: "value",
            ...(yAxis ?? {}),
            axisLabel: {
              hideOverlap: true,
              ...yAxis?.axisLabel,
              ...theme.yAxis.nameTextStyle,
            },
            min: function (value) {
              return value?.min?.toFixed(2);
            },
            max: function (value) {
              return value?.max?.toFixed(2);
            },
            ...theme.yAxis,
          },
      legend: {
        orient: "horizontal",
        zLevel: 23,
        width: "70%",
        bottom: "9%",
        type: "scroll",
        textStyle: {
          width: 150,
          rich: {
            fw600: {
              fontWeight: 600,
            },
          },
        },
        selected: selectedLegend,
        ...(legend ?? {}),
        ...theme.legend,
      },
      grid: {
        right: "100px",
        top: "10%",
        bottom: "15%",
        containLabel: true,
        ...(grid ?? {}),
      },
      tooltip: {
        trigger: "axis",
        textStyle: {
          overflow: "breakAll",
          width: 40,
        },
        confine: true,
        valueFormatter: (value) => value?.toFixed(2),
        ...(tooltip ?? {}),
      },
      toolbox: {
        feature: {
          myFullscreen,
          myExportToExcel,
          saveAsImage,
          dataView,
          dataZoom,
          restore,
        },
        top: "20px",
      },
      dataZoom: zoom,
      series,
      ...rest,
    };
  }, [series, selectedLegend, options, theme]);
  useEffect(() => {
    const chartInstance = chart.current.getEchartsInstance();
    chartInstance.dispatchAction({
      type: "showDataView",
    });
    // Perform any custom logic with the series data
    // console.log("Series Data:", seriesData);
    console.log("getEchartsInstance", chartInstance);
  }, []);
  const handleOpen = () => console.log("dataViewOpend");
  return (
    <Box className="relative">
      {/* {show && <SaveToExcel data={data} fileName={fileName} />} */}
      {showSeriesSelector && <SeriesSelector />}
      <ReactECharts
        option={baseOptions}
        key={JSON.stringify(baseOptions)}
        style={{
          minHeight: 500,
          ...style,
        }}
        ref={chart}
      />
    </Box>
  );
};

export default memo(LineChart);
