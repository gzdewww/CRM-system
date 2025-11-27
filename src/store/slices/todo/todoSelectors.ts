import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { getAsyncRequestData } from "../../utils/asyncUtils";
import type { TodoState } from "./todoSlice";

export const selectTodosStore = (state: RootState): TodoState => state.todos;

export const selectTodos = createSelector(selectTodosStore, (state) =>
  getAsyncRequestData(state.todos)
);

export const selectActiveTab = createSelector(
  selectTodosStore,
  (state) => state.activeTab
);
