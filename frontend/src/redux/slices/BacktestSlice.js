import { createSlice } from "@reduxjs/toolkit";
import {
  backtestAction,
  getEvolutionB100Portef,
  getPortef,
} from "../actions/BacktestActions";

const initData = {
  df_contrib: [],
  df_div: [],
  Rel_div: [],
  qte_div: [],
  quantite_av: [],
  quantite_ap: [],
  div_ord: [],
  div_exc: [],
  portef_ap: [],
  portef_av: [],
  valo_ap: [],
  valo_av: [],
  operation_mnt: [],
  operation_qte: [],
  poids_ap: [],
  poids_av: [],
};

const backtestSlice = createSlice({
  name: "backtest",
  initialState: {
    data: {
      loading: false,
      error: null,
      data: [],
      ...initData,
    },
    evolutionB100Ptfs: {
      data: {
        ptfsData: [],
        ptfsContrib: [],
        df_rendement: [],
        df_poids: [],
      },
      loading: false,
      error: null,
    },
    backtestData: {
      loading: false,
      error: null,
      data: {
        cumulative: [],
        eoy: [],
        eoyTable: [],
        distributionMonthly: [],
        rollingBeta: [],
        rollingVolat: [],
        rollingSharpe: [],
        rollingSortino: [],
        worstDrawdowns: [],
        monthlyReturns: [],
        monthlyRelReturns: [],
        quantiles: [],
        dailyReturns: [],
        keyPerf: [],
        underwater: [],
      },
    },
    selectedPtf: "",
    ptfToBacktest: {},
  },
  reducers: {
    setSelectedPtf: (state, { payload }) => {
      state.selectedPtf = payload;
    },
    setPtfToBacktest: (state, { payload }) => {
      state.ptfToBacktest = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPortef.pending, ({ data }) => {
      data.loading = true;
    });
    builder.addCase(getPortef.fulfilled, ({ data }, { payload }) => {
      data.loading = false;
      data.data = payload;
      data.df_contrib = payload.df_contrib;
      data.df_div = payload.df_div;
      data.Rel_div = payload.Rel_div;
      data.qte_div = payload.qte_div;
      data.quantite_av = payload.quantite_av;
      data.quantite_ap = payload.quantite_ap;
      data.div_ord = payload.div_ord;
      data.div_exc = payload.div_exc;
      data.portef_ap = payload.portef_ap;
      data.portef_av = payload.portef_av;
      data.valo_ap = payload.valo_ap;
      data.valo_av = payload.valo_av;
      data.operation_mnt = payload.operation_mnt;
      data.operation_qte = payload.operation_qte;
      data.poids_ap = payload.poids_ap;
      data.poids_av = payload.poids_av;
    });
    builder.addCase(getPortef.rejected, ({ data }, { payload }) => {
      data.loading = false;
      data.data = initData;
      data.error = payload;
    });

    // GEt Evolution B100 ptfs
    builder.addCase(getEvolutionB100Portef.pending, ({ evolutionB100Ptfs }) => {
      evolutionB100Ptfs.loading = true;
    });
    builder.addCase(
      getEvolutionB100Portef.fulfilled,
      ({ evolutionB100Ptfs }, { payload }) => {
        evolutionB100Ptfs.loading = false;
        evolutionB100Ptfs.data.ptfsData = payload.ptfsData;
        evolutionB100Ptfs.data.ptfsContrib = payload.ptfsContrib;
        evolutionB100Ptfs.data.df_rendement = payload.df_rendement;
        evolutionB100Ptfs.data.df_poids = payload.df_poids;
      }
    );
    builder.addCase(
      getEvolutionB100Portef.rejected,
      ({ evolutionB100Ptfs }, { payload }) => {
        evolutionB100Ptfs.loading = false;
        evolutionB100Ptfs.data = {
          ptfsData: [],
          ptfsContrib: [],
          df_rendement: [],
          df_poids: [],
        };
        evolutionB100Ptfs.error = payload;
      }
    );

    // Get BacktestData
    builder.addCase(backtestAction.pending, ({ backtestData }) => {
      backtestData.loading = true;
    });
    builder.addCase(
      backtestAction.fulfilled,
      ({ backtestData }, { payload }) => {
        backtestData.loading = false;
        backtestData.data.cumulative = payload.cumulative;
        backtestData.data.eoy = payload.eoy;
        backtestData.data.distributionMonthly = payload.distributionMonthly;
        backtestData.data.rollingBeta = payload.rollingBeta;
        backtestData.data.rollingVolat = payload.rollingVolat;
        backtestData.data.rollingSharpe = payload.rollingSharpe;
        backtestData.data.rollingSortino = payload.rollingSortino;
        backtestData.data.worstDrawdowns = payload.worstDrawdowns;
        backtestData.data.monthlyReturns = payload.monthlyReturns;
        backtestData.data.monthlyRelReturns = payload.monthlyRelReturns;
        backtestData.data.quantiles = payload.quantiles;
        backtestData.data.eoyTable = payload.eoyTable;
        backtestData.data.dailyReturns = payload.dailyReturns;
        backtestData.data.keyPerf = payload.keyPerf;
        backtestData.data.underwater = payload.underwater;
      }
    );
    builder.addCase(
      backtestAction.rejected,
      ({ backtestData }, { payload }) => {
        backtestData.loading = false;
        backtestData.data.cumulative = [];
        backtestData.data.eoy = [];
        backtestData.data.distributionMonthly = [];
        backtestData.data.rollingBeta = [];
        backtestData.data.rollingVolat = [];
        backtestData.data.rollingSharpe = [];
        backtestData.data.rollingSortino = [];
        backtestData.data.worstDrawdowns = [];
        backtestData.data.monthlyReturns = [];
        backtestData.data.quantiles = [];
        backtestData.data.eoyTable = [];
        backtestData.data.dailyReturns = [];
        backtestData.data.monthlyRelReturns = [];
        backtestData.data.keyPerf = [];
        backtestData.data.underwater = [];
        backtestData.error = payload;
      }
    );
  },
});

export const { setSelectedPtf, setPtfToBacktest } = backtestSlice.actions;
export default backtestSlice.reducer;
