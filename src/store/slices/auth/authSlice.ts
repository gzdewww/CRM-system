import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { refresh, signIn, signUp } from "../../../api/authAPI";
import {
  getRefreshToken,
  removeRefreshToken,
  setRefreshToken,
} from "../../../helpers/storeTokenLocal";
import type {
  AuthData,
  Profile,
  Token,
  UserRegistration,
} from "../../../types/auth.types";
import { initialAuthState } from "../../initialState";
import {
  addAsyncThunkCases,
  type ApiError,
  type AsyncParticle,
} from "../../utils/asyncUtils";
import {
  REFRESH_ERRORS,
  SIGN_IN_ERRORS,
  SIGN_UP_ERRORS,
} from "../../../constants/auth.const";
import { signOutThunk } from "../user/userSlice";
import { removeAccessToken, setAccessToken } from "../../../api/userAPI";

export interface AuthState {
  isAuth: AsyncParticle<boolean>;
  rememberMe: boolean;
}

export const signInThunk = createAsyncThunk<
  Token,
  AuthData,
  { rejectValue: ApiError }
>("auth/signIn", async (data: AuthData, { rejectWithValue }) => {
  try {
    return await signIn(data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: SIGN_IN_ERRORS[error.status as keyof typeof SIGN_IN_ERRORS],
        status: error.status,
      });
    }
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    }
    return rejectWithValue({ message: "Неизвестная ошибка" });
  }
});

export const signUpThunk = createAsyncThunk<
  Profile,
  UserRegistration,
  { rejectValue: ApiError }
>("auth/signUp", async (data: UserRegistration, { rejectWithValue }) => {
  try {
    return await signUp(data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: SIGN_UP_ERRORS[error.status as keyof typeof SIGN_UP_ERRORS],
        status: error.status,
      });
    }
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    }
    return rejectWithValue({ message: "Неизвестная ошибка" });
  }
});

export const refreshThunk = createAsyncThunk<
  Token,
  void,
  { rejectValue: ApiError }
>("auth/refresh", async (_, { rejectWithValue }) => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error();
    }

    return await refresh({ refreshToken });
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: REFRESH_ERRORS[error.status as keyof typeof REFRESH_ERRORS],
        status: error.status,
      });
    }
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    }
    return rejectWithValue({ message: "Неизвестная ошибка" });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
  },
  extraReducers: (builder) => {
    addAsyncThunkCases(builder, signInThunk, "isAuth", (state, payload) => {
      setAccessToken(payload.accessToken);
      setRefreshToken(payload.refreshToken, state.rememberMe);
    });
    addAsyncThunkCases(builder, signUpThunk, "isAuth");
    addAsyncThunkCases(
      builder,
      refreshThunk,
      "isAuth",
      (state, payload) => {
        setAccessToken(payload.accessToken);
        setRefreshToken(payload?.refreshToken, state.rememberMe);
      },
      () => {
        removeRefreshToken();
        removeAccessToken();
      }
    );

    builder.addCase(signOutThunk.fulfilled, (store) => {
      store.isAuth.data = false;
      removeAccessToken();
      removeRefreshToken();
    });
  },
});

export const { setRememberMe } = authSlice.actions;

export default authSlice.reducer;
