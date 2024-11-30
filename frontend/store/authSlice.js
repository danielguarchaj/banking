import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import endpoints from "./endpoints";

const initialState = {
  newAccount: {
    name: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
  },
  loginForm: {
    username: "",
    password: "",
  },
  token: "",
  loading: false,
  errorMessage: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleNewAccountFormInput: (state, { payload: { field, value } }) => {
      state.newAccount[field] = value;
    },
    handleLoginFormInput: (state, { payload: { field, value } }) => {
      state.loginForm[field] = value;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state, _action) => {
      state.newAccount = initialState.newAccount;
      state.loginForm = initialState.loginForm;
      state.token = initialState.token;
      state.loading = initialState.loading;
      state.errorMessage = initialState.errorMessage;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.token) {
        state.errorMessage = "";
        state.token = action.payload.token;
        return;
      }
      state.errorMessage =
        action.payload.message ?? "Error de comunicacion, intente mas tarde";
    });
    builder.addCase(loginUser.pending, (state, _action) => {
      state.loading = true;
      state.errorMessage = "";
    });
    builder.addCase(loginUser.rejected, (state, _action) => {
      state.loading = false;
      state.errorMessage = "Error de comunicacion, intente mas tarde";
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.token) {
        state.token = action.payload.token;
        state.errorMessage = "";
        return;
      }
      state.errorMessage =
        action.payload.message ?? "Error de comunicacion, intente mas tarde";
    });
    builder.addCase(registerUser.pending, (state, _action) => {
      state.loading = true;
      state.errorMessage = "";
    });
    builder.addCase(registerUser.rejected, (state, _action) => {
      state.loading = false;
      state.errorMessage = "Error de comunicacion, intente mas tarde";
    });
  },
});

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }) => {
    try {
      const response = await axios.post(endpoints.login, {
        username,
        password,
      });
      if (response.status === 200) {
        return response.data;
      }
      return { message: "Error en la peticion" };
    } catch (error) {
      console.log("error.status in loginUser", JSON.stringify(error.status));
      if (error.status === 401) {
        return { message: "Credenciales invalidas" };
      }
      return {
        message: "Error de comunicacion, intente mas tarde",
      };
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (newUser) => {
    try {
      console.log("newUser", newUser);
      const response = await axios.post(endpoints.register, newUser);
      console.log("registerUser", response);
      return response.data;
    } catch (error) {
      console.log("error.status in registerUser", JSON.stringify(error.status));
      if (error.status === 400) {
        return {
          message: "Ya existe un usuario registrado como " + newUser.username,
        };
      }
      return {
        message: "Error de comunicacion, intente mas tarde",
      };
    }
  }
);

export const {
  setLoginState,
  handleNewAccountFormInput,
  handleLoginFormInput,
  setToken,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
