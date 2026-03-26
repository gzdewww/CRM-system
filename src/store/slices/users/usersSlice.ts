import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import {
  getProfile,
  removeAccessToken,
  signOut,
} from "../../../api/userAPI";
import { removeRefreshToken } from "../../../helpers/storeTokenLocal";
import type { Profile } from "../../../types/auth.types";
import { initialUserState } from "../../initialState";
import {
  addAsyncThunkCases,
  type ApiError,
  type AsyncParticle,
  createAsyncParticle,
} from "../../utils/asyncUtils";
import { refreshThunk } from "../auth/authSlice";

export interface UserState {
  profile: AsyncParticle<Profile>;
}

export const getProfileThunk = createAsyncThunk<Profile>(
  "user/getProfile",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      return await getProfile();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          const refreshResult = await dispatch(refreshThunk());
          if (refreshResult.type === "auth/refresh/fulfilled") {
            return await getProfile();
          } else {
            return rejectWithValue({
              message: "Сессия истекла",
              status: error.response?.status,
            });
          }
        } else {
          removeAccessToken();
          removeRefreshToken();
          return rejectWithValue({
            message: error.response?.data.message,
            status: error.response?.status,
          });
        }
      }
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      }
      return rejectWithValue(error as ApiError);
    }
  },
);

export const signOutThunk = createAsyncThunk<
  number,
  void,
  { rejectValue: ApiError }
>("user/signOut", async (_, { rejectWithValue }) => {
  try {
    return await signOut();
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        message: error.response?.data.message,
        status: error.response?.status,
      });
    }
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    }
    return rejectWithValue(error as ApiError);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncThunkCases(builder, getProfileThunk, "profile");
    builder.addCase(signOutThunk.fulfilled, (state) => {
      state.profile = createAsyncParticle<Profile>(null);
    });
  },
});

export default userSlice.reducer;
