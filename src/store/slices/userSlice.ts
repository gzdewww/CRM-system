import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { getProfile, signOut } from "../../api/user.api";
import type { Profile } from "../../types/auth.types";
import { refreshThunk } from "./authSlice";

export interface UserState {
  isLoading: boolean;
  profile: Profile | null;
}

const initialState: UserState = {
  isLoading: false,
  profile: null,
};

export const getProfileThunk = createAsyncThunk(
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
          }
        } else {
          return rejectWithValue(error.response?.status);
        }
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue(error);
    }
  }
);

export const signOutThunk = createAsyncThunk(
  "user/signOut",
  async (_, { rejectWithValue }) => {
    try {
      return await signOut();
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //GET PROFILE
    builder.addCase(getProfileThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProfileThunk.fulfilled, (state, action) => {
      state.profile = action.payload ?? null;
      state.isLoading = false;
    });
    builder.addCase(getProfileThunk.rejected, (state, action) => {
      state.profile = null;
      state.isLoading = false;

      console.log(action.payload);
    });

    //SIGN OUT
    builder.addCase(signOutThunk.fulfilled, (state) => {
      state.profile = null;
    });
  },
});

export default userSlice.reducer;
