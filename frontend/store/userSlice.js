import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import endpoints from "./endpoints";

const initialState = {
  profile: null,
  account: null,
  loading: false,
  transactions: [],
  transactionForm: {
    amount: "",
    targetAccountNumber: "",
  },
  loadingTransfer: false,
  loadingTransactions: false,
  transferErrorMessage: "",
  modalOpen: false,
  transfersErrorMessage: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleTransferFormInput: (state, { payload: { field, value } }) => {
      state.transactionForm[field] = value;
    },
    resetTransferForm: (state, _action) => {
      state.transactionForm = initialState.transactionForm;
    },
    toggleModelOpen: (state, action) => {
      state.modalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.profile = action.payload.user;
      state.account = action.payload.accounts[0] ?? null;
      state.loading = false;
    });
    builder.addCase(getUserData.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(getUserData.rejected, (state, _action) => {
      state.loading = false;
      state.errorMessage = "Error de comunicacion, intente mas tarde";
    });

    builder.addCase(performTransaction.fulfilled, (state, _action) => {
      alert("Transferencia realizada con exito");
      console.log("_action in fulfilled", _action);
      state.loadingTransfer = false;
      state.modalOpen = false;
    });
    builder.addCase(performTransaction.pending, (state, _action) => {
      state.loadingTransfer = true;
    });
    builder.addCase(performTransaction.rejected, (state, action) => {
      console.log("_action in rejected", action);
      state.loadingTransfer = false;
      state.transferErrorMessage =
        action.payload || "Error de comunicación, intente más tarde";
    });

    builder.addCase(getTransactions.fulfilled, (state, action) => {
      state.transactions = action.payload ?? [];
      state.loadingTransactions = false;
    });
    builder.addCase(getTransactions.pending, (state, _action) => {
      state.loadingTransactions = true;
    });
    builder.addCase(getTransactions.rejected, (state, action) => {
      state.loadingTransactions = false;
      state.transfersErrorMessage =
        action.payload || "Error de comunicación, intente más tarde";
    });
  },
});

export const getUserData = createAsyncThunk(
  "user/getUserData",
  async (token) => {
    try {
      console.log("getUserData token", token);
      const response = await axios.post(
        endpoints.user,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("getUserData response", response);
      return response.data;
    } catch (error) {
      console.log("error.status in loginUser", JSON.stringify(error.status));
      return error;
    }
  }
);

export const performTransaction = createAsyncThunk(
  "auth/performTransaction",
  async ({ token, transferData }, { rejectWithValue }) => {
    try {
      console.log("transferData", transferData);
      const response = await axios.post(endpoints.transaction, transferData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("performTransaction response", JSON.stringify(response));
      return response.data;
    } catch (error) {
      console.log("error in performTransaction", error);

      // Check if the error contains a response with the message
      if (error.response) {
        const message = error.response.data?.message || "Error desconocido";
        return rejectWithValue(message); // Send the message to the rejected action
      }

      // Handle network or other errors
      return rejectWithValue("Error de comunicación, intente más tarde");
    }
  }
);

export const getTransactions = createAsyncThunk(
  "user/getTransactions",
  async (token) => {
    try {
      console.log("getTransactions token", token);
      const response = await axios.get(endpoints.transactions, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("getTransactions response", response);
      return response.data;
    } catch (error) {
      console.log("error.status in loginUser", JSON.stringify(error.status));
      return error;
    }
  }
);

export const { handleTransferFormInput, resetTransferForm, toggleModelOpen } =
  userSlice.actions;

export default userSlice.reducer;
