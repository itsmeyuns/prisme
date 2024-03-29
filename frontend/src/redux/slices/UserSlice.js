import { createSlice } from "@reduxjs/toolkit";
import {
  comparePortefeuilles,
  deletePortefeuilles,
  deleteUser,
  fetchUsers,
  getPortefeuilles,
  showUser,
  storeUser,
  updateProfile,
  updateUser,
} from "../actions/UserActions";

const initialState = {
  users: [],
  loading: false,
  error: null,
  userData: null,
  deleteState: {
    loading: false,
    error: null,
  },
  storeState: {
    loading: false,
    error: null,
  },
  updateState: {
    loading: false,
    error: null,
  },
  updateProfileState: {
    loading: false,
    error: null,
  },
  portefeuilles: {
    loading: false,
    error: null,
    data: [],
  },
  comparePortefeuilles: {
    loading: false,
    error: null,
    data: [],
  },
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    resetUpdateState: (state) => {
      state.updateState.loading = false;
      state.updateState.error = null;
    },
    resetStoreState: (state) => {
      state.storeState.loading = false;
      state.storeState.error = null;
    },
    resetUpdateProfileState: (state) => {
      state.updateProfileState.loading = false;
      state.updateProfileState.error = null;
    },
    setPortefeuilles: (state, { payload }) => {
      state.portefeuilles.data = payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.userData = null;
      state.users = action.payload || [];
    });
    builder.addCase(fetchUsers.rejected, (state, { payload }) => {
      state.loading = false;
      if (payload.status === 401) {
        state.error = payload.message;
        state.users = [];
      } else {
        state.error = payload;
      }
    });
    // Store User
    builder.addCase(storeUser.pending, ({ storeState }) => {
      storeState.loading = true;
      storeState.error = null;
    });
    builder.addCase(storeUser.fulfilled, (state, action) => {
      state.storeState.loading = false;
      state.users = [action.payload.user, ...state.users];
    });
    builder.addCase(storeUser.rejected, ({ storeState }, action) => {
      storeState.loading = false;
      console.log("gd", action);
      storeState.error = action.payload;
    });
    // Delete User
    builder.addCase(deleteUser.pending, (state) => {
      state.deleteState.loading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.deleteState.loading = false;
      state.deleteState.error = null;
      state.users = state.users.filter(
        (user) => user._id !== action.payload.id
      );
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.deleteState.loading = false;
      state.deleteState.error = action.payload;
    });
    // Update User
    builder.addCase(updateUser.pending, ({ updateState }) => {
      updateState.loading = true;
      updateState.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, { payload }) => {
      state.updateState.loading = false;
      state.users = state.users.map((user) => {
        if (user._id === payload.user._id) {
          return payload.user;
        }
        return user;
      });
    });
    builder.addCase(updateUser.rejected, ({ updateState }, action) => {
      updateState.loading = false;
      console.log("gd", action);
      updateState.error = action.payload;
    });
    // Show User
    builder.addCase(showUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(showUser.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.userData = action.payload;
    });
    builder.addCase(showUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Update profile
    builder.addCase(updateProfile.pending, ({ updateProfileState }) => {
      updateProfileState.loading = true;
    });
    builder.addCase(updateProfile.fulfilled, ({ updateProfileState }) => {
      updateProfileState.loading = false;
      updateProfileState.error = null;
    });
    builder.addCase(
      updateProfile.rejected,
      ({ updateProfileState }, action) => {
        updateProfileState.loading = false;
        console.log("update pro", action.payload);
        updateProfileState.error = action.payload;
      }
    );

    // GET Portefeuilles
    builder.addCase(getPortefeuilles.pending, ({ portefeuilles }) => {
      portefeuilles.loading = true;
    });
    builder.addCase(
      getPortefeuilles.fulfilled,
      ({ portefeuilles }, { payload }) => {
        portefeuilles.loading = false;
        portefeuilles.data = payload;
        portefeuilles.error = null;
      }
    );
    builder.addCase(
      getPortefeuilles.rejected,
      ({ portefeuilles }, { payload }) => {
        portefeuilles.loading = false;
        console.log("portefeuilles err payo", payload);
        portefeuilles.error = payload;
      }
    );
    // Delete Portefeuilles
    builder.addCase(deletePortefeuilles.pending, ({ portefeuilles }) => {
      portefeuilles.loading = true;
    });
    builder.addCase(
      deletePortefeuilles.fulfilled,
      ({ portefeuilles }, { payload }) => {
        portefeuilles.loading = false;
        portefeuilles.data = payload.portefeuilles;
        portefeuilles.error = null;
      }
    );
    builder.addCase(
      deletePortefeuilles.rejected,
      ({ portefeuilles }, { payload }) => {
        portefeuilles.loading = false;
        console.log("portefeuilles err payo", payload);
        portefeuilles.error = payload;
      }
    );
    // Compare Portefeuilles
    builder.addCase(
      comparePortefeuilles.pending,
      ({ comparePortefeuilles }) => {
        comparePortefeuilles.loading = true;
      }
    );
    builder.addCase(
      comparePortefeuilles.fulfilled,
      ({ comparePortefeuilles }, { payload }) => {
        comparePortefeuilles.loading = false;
        comparePortefeuilles.data = payload;
        comparePortefeuilles.error = null;
      }
    );
    builder.addCase(
      comparePortefeuilles.rejected,
      ({ comparePortefeuilles }, { payload }) => {
        comparePortefeuilles.loading = false;
        console.log("comparePortefeuilles err payo", payload);
        comparePortefeuilles.error = payload;
      }
    );
  },
});

export const {
  setUsers,
  resetUpdateState,
  resetStoreState,
  resetUpdateProfileState,
  setPortefeuilles,
} = userSlice.actions;
export default userSlice.reducer;
