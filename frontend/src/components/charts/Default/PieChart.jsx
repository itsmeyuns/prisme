import React, { memo, useMemo, useRef } from "react";
import ReactECharts from "echarts-for-react";
import {
  defaultOptions,
  getFullscreenFeature,
  getExportToExcelFeature,
} from "../../../utils/chart/defaultOptions";
import useChartTheme from "../../../hooks/useChartTheme";
import useSeriesSelector from "../../../hooks/useSeriesSelector";
import { Box } from "@mui/material";
import SaveToExcel from "../../SaveToExcel";

export const pieWithLabels = {
  radius: ["10%", "70%"],
  // radius: "50%",
  avoidLabelOverlap: false,
  label: {
    // alignTo: "edge",
    show: true,
    formatter: function (params) {
      let name = params.name;
      const { value } = params;
      if (name.length > 5) {
        const newName = name.split(" ");

        name = newName.join(" \n");
      }
      return `${name}:${value.toFixed(2)}%`;
    },
    fontSize: 9,
    minMargin: 6,
    edgeDistance: 10,
    lineHeight: 15,
  },
  labelLine: {
    length: 10,
    length2: 0,
    maxSurfaceAngle: 500,
  },
  emphasis: {
    itemStyle: {
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowColor: "rgba(0, 0, 0, 0.5)",
    },
  },
};

const initSaveToExcel = {
  show: false,
  data: [],
  fileName: new Date().getTime(),
};

const PieChart = ({
  options,
  style,
  showSeriesSelector,
  saveToExcel = initSaveToExcel,
}) => {
  console.log("options", options, saveToExcel);
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
    series,
    legend,
    seriesNames: { seriesList = [], init = seriesList } = {},
    ...rest
  } = options;
  const { SeriesSelector, selectedLegend } = useSeriesSelector(
    seriesList,
    init
  );
  const {
    toolbox: {
      feature: { saveAsImage, dataView, restore },
    },
  } = defaultOptions;
  const baseOptions = useMemo(() => {
    return {
      title: {
        ...(title ?? {}),
        ...theme.title,
      },
      legend: {
        orient: "horizontal",
        zLevel: 23,
        width: "70%",
        type: "scroll",
        left: "center",
        bottom: "0",
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
        bottom: "10%",
        containLabel: true,
        ...(grid ?? {}),
      },
      tooltip: {
        trigger: "item",
        textStyle: {
          overflow: "breakAll",
          width: 40,
        },
        confine: true,
        valueFormatter: (value) => value?.toFixed(2) + "%",
        ...(tooltip ?? {}),
      },
      toolbox: {
        feature: {
          myFullscreen,
          myExportToExcel,
          restore,
          saveAsImage,
          dataView,
        },
        top: "20px",
      },
      series,
      ...rest,
    };
  }, [series, selectedLegend, options, theme]);

  return (
    <Box className="relative w-full">
      {/* {show && <SaveToExcel data={data} fileName={fileName} />} */}
      {showSeriesSelector && <SeriesSelector />}
      <ReactECharts
        option={baseOptions}
        key={JSON.stringify(baseOptions)}
        style={style}
        ref={chart}
      />
    </Box>
  );
};

export default memo(PieChart);
