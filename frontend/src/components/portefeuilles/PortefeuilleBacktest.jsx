import React, { memo, useEffect, useState } from "react";
import AccordionBox from "../AccordionBox";
import DateComponent from "../DateComponent";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { getIndices } from "../../redux/actions/DataActions";
import SelectIndices from "../Markowitz/SelectIndices";
import { notyf } from "../../utils/notyf";
import MainLoader from "../loaders/MainLoader";
import { Box, Button, TextField } from "@mui/material";
import {
  backtestAction,
  getEvolutionB100Portef,
} from "../../redux/actions/BacktestActions";
import EvolutionB100 from "../charts/EvolutionB100";
import ContribChart from "../charts/Backtest/ContribChart";
import Cumualative from "../charts/Backtest/Cumualative";
import EoyChart from "../charts/Backtest/EoyChart";
import DistrubitionMonthly from "../charts/Backtest/DistrubitionMonthly";
import Rolling from "../charts/Backtest/Rolling";
import WorstDrawDowns from "../charts/Backtest/WorstDrawDowns";
import MonthlyReturns from "../charts/Backtest/MonthlyReturns";
import Table from "../Table";
import {
  contribColumns,
  eoyColumns,
  generateKeyPerfColumns,
  worstDrawdownsColumns,
} from "./Tables/columns";
import DailyReturns from "../charts/Backtest/DailyReturns";
import Quantiles from "../charts/Backtest/Quantiles";
import Underwater from "../charts/Backtest/Underwater";
import Poids from "../charts/Backtest/Poids";
import PoidsDonut from "../charts/Backtest/PoidsDonut";

const opc = [
  "OPC ACTIONS FGP AJUSTE",
  "OPC DIVERSIFIE FGP AJUSTE",
  "OPC MONETAIRE FGP AJUSTE",
  "OPC OCT FGP AJUSTE",
  "OPC OMLT FGP AJUSTE",
];

const PortefeuilleBacktest = () => {
  const [dateDebut, setDateDebut] = useState(dayjs().subtract(5, "year"));
  const [dateFin, setDateFin] = useState(dayjs());
  const {
    evolutionB100Ptfs: { loading, data },
    backtestData: backData,
    selectedPtf,
    ptfToBacktest,
  } = useSelector((state) => state.backtest);
  const dispatch = useDispatch();
  const [indices, setIndices] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [selectedOPC, setSelectedOPC] = useState([]);
  const [rf, setRf] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    dispatch(getIndices())
      .unwrap()
      .then(({ data }) => {
        console.log("getIndices data", data);
        const indices = data
          .filter((item) => item.classe === "ACTIONS" || item.classe === "TAUX")
          .map((item) => item.NOM_INDICE);
        setIndices(indices);
      })
      .catch(() => notyf.error("Error fetch Indices"))
      .finally(() => setIsLoading(false));
  }, []);
  const handleBacktest = () => {
    console.log("ptfToBacktest", ptfToBacktest);
    setIsShow(false);
    dispatch(
      getEvolutionB100Portef({
        dateDebut,
        dateFin,
        list_indices: [...selectedIndices, ...selectedOPC],
      })
    )
      .unwrap()
      .then(() => dispatch(backtestAction({ rf })))
      .then(() => setIsShow(true))
      .catch((err) => {
        console.log("err", err);
        notyf.error("Error Evolution B100");
      });
  };
  const isDisabled =
    selectedIndices.length < 1 || selectedOPC.length < 1 || rf === "";
  const showLoading = isLoading || loading || backData.loading;
  console.log("backData.data.keyPerf", backData.data.keyPerf);
  // const keyPerfColumns = generateKeyPerfColumns([
  //   selectedPtf,
  //   ...selectedIndices,
  //   ...selectedOPC,
  // ]);
  const headers =
    backData.data.keyPerf.length > 0
      ? Object.keys(backData.data.keyPerf[0]).filter((ele) => ele !== "Metric")
      : [];
  console.log("headers is", headers);
  const keyPerfColumns = generateKeyPerfColumns(headers);

  return (
    <>
      <AccordionBox
        title="Backtest"
        isExpanded={true}
        detailsClass="flex flex-wrap gap-3 items-center"
      >
        <DateComponent
          date={dateDebut}
          setDate={setDateDebut}
          label="Date Début"
        />
        <DateComponent date={dateFin} setDate={setDateFin} label="Date Fin" />
        <SelectIndices
          indices={indices}
          selectedIndices={selectedIndices}
          setSelectedIndices={setSelectedIndices}
          label="Indices"
        />
        <SelectIndices
          indices={opc}
          selectedIndices={selectedOPC}
          setSelectedIndices={setSelectedOPC}
          label="OPC"
        />
        <TextField
          id="rf-dep"
          label="Risk Free Rate"
          type="number"
          size="small"
          value={rf}
          onChange={(event) => {
            setRf(event.target.value);
          }}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputProps: {
              min: 0,
            },
          }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={handleBacktest}
          disabled={isDisabled}
        >
          Backtester
        </Button>
      </AccordionBox>
      <Box
        className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12
        xl:grid-cols-12 gap-y-4 gap-x-12 mt-24 items-center"
      >
        <Box className="md:col-span-6 lg:col-span-6 xl:col-span-6">
          <Box>
            {!loading && isShow && data.ptfsData.length > 0 && (
              <>
                <EvolutionB100 data={data.ptfsData} isGrid />
              </>
            )}
          </Box>
          <Box>
            {!loading && isShow && data.df_poids.length > 0 && (
              <>
                <Poids data={data.df_poids} />
              </>
            )}
          </Box>
        </Box>
        <Box className="md:col-span-6 lg:col-span-6 xl:col-span-6">
          {!loading && isShow && data.ptfsContrib.length > 0 && (
            <ContribChart data={data.ptfsContrib} />
          )}
          {!loading && isShow && data.ptfsContrib.length > 0 && (
            <Box className="flex">
              <PoidsDonut
                data={data.ptfsContrib}
                field={"poids_initial"}
                title={"Poids initial"}
              />
              <PoidsDonut
                data={data.ptfsContrib}
                field={"poids_final"}
                title={"Poids final"}
              />
            </Box>
          )}
        </Box>
      </Box>

      {!loading && isShow && data.ptfsContrib.length > 0 && (
        <>
          <h3>Contribution {data.ptfsContrib[0].PTF}</h3>
          <Table
            columns={contribColumns}
            rows={data.ptfsContrib}
            pageSize={10}
            className="h-max"
          />
        </>
      )}
      <Box
        className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12
        xl:grid-cols-12 gap-y-4 gap-x-12 mt-24"
      >
        <Box className="md:col-span-7 lg:col-span-7 xl:col-span-7">
          {!backData.loading &&
            isShow &&
            backData.data.cumulative.length > 0 && (
              <>
                <Cumualative data={backData.data.cumulative} />
              </>
            )}
          {!backData.loading && isShow && backData.data.eoy.length > 0 && (
            <>
              <EoyChart data={backData.data.eoy} />
            </>
          )}
          {!backData.loading &&
            isShow &&
            backData.data.distributionMonthly.length > 0 && (
              <>
                <DistrubitionMonthly data={backData.data.distributionMonthly} />
              </>
            )}
          {!backData.loading &&
            isShow &&
            backData.data.dailyReturns.length > 0 && (
              <>
                <DailyReturns data={backData.data.dailyReturns} />
              </>
            )}
          {!backData.loading &&
            isShow &&
            backData.data.rollingBeta.length > 0 && (
              <>
                <Rolling
                  data={backData.data.rollingBeta}
                  title="Rolling Beta to Benchmark"
                />
              </>
            )}
          {!backData.loading &&
            isShow &&
            backData.data.rollingVolat.length > 0 && (
              <>
                <Rolling
                  data={backData.data.rollingVolat}
                  title="Rolling Volatility (6-Months)"
                />
              </>
            )}
          {!backData.loading &&
            isShow &&
            backData.data.rollingSharpe.length > 0 && (
              <>
                <Rolling
                  data={backData.data.rollingSharpe}
                  title="Rolling Sharp (6-Months)"
                />
              </>
            )}
          {!backData.loading &&
            isShow &&
            backData.data.rollingSortino.length > 0 && (
              <>
                <Rolling
                  data={backData.data.rollingSortino}
                  title="Rolling Sortino (6-Months)"
                />
              </>
            )}
          {!backData.loading &&
            isShow &&
            backData.data.worstDrawdowns.length > 0 && (
              <>
                <WorstDrawDowns
                  data={backData.data.worstDrawdowns}
                  evolution={backData.data.cumulative}
                />
              </>
            )}
          {!backData.loading &&
            isShow &&
            backData.data.underwater.length > 0 && (
              <>
                <Underwater data={backData.data.underwater} />
              </>
            )}
          {!backData.loading &&
            isShow &&
            backData.data.monthlyReturns.length > 0 && (
              <>
                <MonthlyReturns
                  data={backData.data.monthlyReturns}
                  title="Monthly Returns (%)"
                />
              </>
            )}
          {!backData.loading &&
            isShow &&
            backData.data.monthlyRelReturns.length > 0 && (
              <>
                <MonthlyReturns
                  data={backData.data.monthlyRelReturns}
                  title="Monthly Relative Returns (%)"
                />
              </>
            )}
          {!backData.loading &&
            isShow &&
            backData.data.quantiles.length > 0 && (
              <>
                <Quantiles data={backData.data.quantiles} />
              </>
            )}
        </Box>
        <Box className="md:col-span-5 lg:col-span-5 xl:col-span-5">
          {!backData.loading && isShow && backData.data.keyPerf.length > 0 && (
            <>
              <h3>Key Performance Metrics</h3>
              <Table
                columns={keyPerfColumns}
                rows={backData.data.keyPerf}
                pageSize={50}
                className="h-max"
              />
            </>
          )}
          {!backData.loading && false && backData.data.eoyTable.length > 0 && (
            <>
              <h3>EOY Returns vs Benchmark</h3>
              <Table
                columns={eoyColumns}
                rows={backData.data.eoyTable}
                className="h-max"
              />
            </>
          )}
          {!backData.loading &&
            isShow &&
            backData.data.worstDrawdowns.length > 0 && (
              <>
                <h3>Worst 10 Drawdowns</h3>
                <Table
                  columns={worstDrawdownsColumns}
                  rows={backData.data.worstDrawdowns}
                  className="h-max"
                />
              </>
            )}
        </Box>
      </Box>

      {showLoading && <MainLoader />}
    </>
  );
};

export default memo(PortefeuilleBacktest);
