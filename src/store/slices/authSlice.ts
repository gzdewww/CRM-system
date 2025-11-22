import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { refresh, signIn, signUp } from "../../api/auth.api";
import { setAccessToken } from "../../api/user.api";
import {
  REFRESH_ERRORS,
  SIGN_IN_ERRORS,
  SIGN_UP_ERRORS,
} from "../../constants/auth.const";
import {
  getRefreshToken,
  hasRefreshToken,
  removeRefreshToken,
  setRefreshToken,
} from "../../helpers/storeTokenLocal";
import type { AuthData, Token, UserRegistration } from "../../types/auth.types";
import { signOutThunk } from "./userSlice";

export interface AuthState {
  isInitialized: boolean;
  isLoading: boolean;
  isAuth: boolean;
  token: Token | null;
  error: string | null;
  message: string | null;
  rememberMe: boolean;
}

const initialAuthState: AuthState = {
  isInitialized: false,
  isLoading: false,
  isAuth: false,
  token: hasRefreshToken()
    ? { accessToken: "", refreshToken: String(getRefreshToken()) }
    : null,
  error: null,
  message: null,
  rememberMe: false,
};

export const signInThunk = createAsyncThunk(
  "auth/signIn",
  async (data: AuthData, { rejectWithValue }) => {
    try {
      return await signIn(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.status);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue(error);
    }
  }
);

export const signUpThunk = createAsyncThunk(
  "auth/signUp",
  async (data: UserRegistration, { rejectWithValue }) => {
    try {
      return await signUp(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.status);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue(error);
    }
  }
);

export const refreshThunk = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error();
      }

      return await refresh({ refreshToken });
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.status);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
  },
  extraReducers: (builder) => {
    // SIGNIN
    builder.addCase(signInThunk.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(
      signInThunk.fulfilled,
      (state, action: PayloadAction<Token>) => {
        state.isAuth = true;
        state.token = action.payload ?? null;
        state.isLoading = false;
        state.isInitialized = true;
        state.error = "";

        setAccessToken(action.payload?.accessToken);
        setRefreshToken(action.payload?.refreshToken, state.rememberMe);
      }
    );
    builder.addCase(signInThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isInitialized = true;
      if (typeof action.payload === "number" && action.payload) {
        state.error =
          SIGN_IN_ERRORS[action.payload as keyof typeof SIGN_IN_ERRORS];
      } else {
        state.error = String(action.payload);
      }
    });

    // SIGNUP
    builder.addCase(signUpThunk.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(signUpThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.error = "";
      state.message = "Вы успешно зарегистрированы!";
    });
    builder.addCase(signUpThunk.rejected, (state, action) => {
      state.isLoading = false;
      if (typeof action.payload === "number" && action.payload) {
        state.error =
          SIGN_UP_ERRORS[action.payload as keyof typeof SIGN_UP_ERRORS];
      } else {
        state.error = String(action.payload);
      }
    });

    // REFRESH
    builder.addCase(refreshThunk.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(refreshThunk.fulfilled, (state, action) => {
      state.isAuth = true;
      state.token = action.payload ?? null;
      state.isLoading = false;
      state.isInitialized = true;
      state.error = "";

      setAccessToken(action.payload?.accessToken);
      setRefreshToken(action.payload?.refreshToken, state.rememberMe);
    });
    builder.addCase(refreshThunk.rejected, (state, action) => {
      state.isAuth = false;
      state.token = null;
      state.isLoading = false;
      state.isInitialized = true;
      if (typeof action.payload === "number" && action.payload) {
        state.error =
          REFRESH_ERRORS[action.payload as keyof typeof REFRESH_ERRORS];
      } else {
        state.error = String(action.payload);
      }

      removeRefreshToken();
    });

    // SIGN OUT
    builder.addCase(signOutThunk.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(signOutThunk.fulfilled, (state) => {
      state.isAuth = false;
      state.token = null;
      state.isInitialized = true;
      state.error = null;
      state.isLoading = false;

      removeRefreshToken();
    });
  },
});

export const { setRememberMe } = authSlice.actions;

export default authSlice.reducer;
