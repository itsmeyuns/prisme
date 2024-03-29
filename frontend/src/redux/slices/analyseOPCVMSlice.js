import { createSlice } from "@reduxjs/toolkit";
import { getAnalyse } from "../actions/AnalyseOPCVMActions";

const initialState = {
  data: {
    analyseQuatile: [],
    performance: [],
    classementPerformance: [],
    barometreQuantalys: [],
    loeilExpert: [],
    indicateursRisque: [],
    fondsVersusCat1: [],
    fondsVersusCat2: [],
    fondsVersusCat3: [],
    indicateursPerfRisque: [],
    analyseLipper1: [],
    analyseLipper2: [],
  },
  loading: false,
  error: null,
};

const analyseOPCVMSlice = createSlice({
  name: "analyseOPCVM",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getAnalyse.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAnalyse.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data.analyseQuatile = payload.analyseQuatile;
      state.data.performance = payload.performance;
      state.data.classementPerformance = payload.classementPerformance;
      state.data.barometreQuantalys = payload.barometreQuantalys;
      state.data.indicateursRisque = payload.indicateursRisque;
      state.data.loeilExpert = payload.loeilExpert;
      state.data.fondsVersusCat1 = payload.fondsVersusCat1;
      state.data.fondsVersusCat2 = payload.fondsVersusCat2;
      state.data.fondsVersusCat3 = payload.fondsVersusCat3;
      state.data.indicateursPerfRisque = payload.indicateursPerfRisque;
      state.data.analyseLipper1 = payload.analyseLipper1;
      state.data.analyseLipper2 = payload.analyseLipper2;
    });
    builder.addCase(getAnalyse.rejected, (state, payload) => {
      state.loading = false;
      state.data = { ...initialState.data };
      state.error = payload;
    });
  },
});

export default analyseOPCVMSlice.reducer;
