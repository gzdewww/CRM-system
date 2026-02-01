import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { UserState } from "./usersSlice";
import { getAsyncRequestData } from "../../utils/asyncUtils";

export const selectUserStore = (state: RootState): UserState => state.user;

export const selectProfile = createSelector(selectUserStore, (state) =>
  getAsyncRequestData(state.profile),
);
