import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { getAsyncRequestData } from "../../utils/asyncUtils";
import type { UserState } from "./usersSlice";

export const selectUserStore = (state: RootState): UserState => state.user;

export const selectProfile = createSelector(selectUserStore, (state) =>
  getAsyncRequestData(state.profile),
);