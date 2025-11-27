import type { AuthState } from "./authSlice";
import { createSelector } from "@reduxjs/toolkit";
import { getAsyncRequestData } from "../../utils/asyncUtils";
import type { RootState } from "../../store";

export const selectAuthStore = (state: RootState): AuthState => state.auth;

export const selectToken = createSelector(selectAuthStore, (state) =>
  getAsyncRequestData(state.token)
);

export const selectIsAuth = createSelector(selectAuthStore, (state) => state.isAuth);
