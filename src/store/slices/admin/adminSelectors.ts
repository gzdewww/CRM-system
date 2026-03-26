import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { getAsyncRequestData } from "../../utils/asyncUtils";

export const selectUsersStore = (state: RootState) => state.admin;

export const selectUsersData = createSelector(selectUsersStore, (state) =>
  getAsyncRequestData(state.usersData),
);

export const selectSelectedUser = createSelector(selectUsersStore, (state) =>
  getAsyncRequestData(state.selectedUser),
);
