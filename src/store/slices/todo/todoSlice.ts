import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { getTodos } from "../../../api/todoAPI";
import type { MetaResponse, Todo, TodoInfo } from "../../../types/todo.types";
import { initialTodosState } from "../../initialState";
import {
  addAsyncThunkCases,
  type ApiError,
  type AsyncParticle,
} from "../../utils/asyncUtils";

export interface TodoState {
  todos: AsyncParticle<MetaResponse<Todo, TodoInfo>>;
  activeTab: keyof TodoInfo;
}

export const getTodosThunk = createAsyncThunk<
  MetaResponse<Todo, TodoInfo>,
  keyof TodoInfo,
  { rejectValue: ApiError }
>("todos/getTodos", async (activeTab, { rejectWithValue }) => {
  try {
    return await getTodos(activeTab);
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.message,
        status: error.status,
      });
    }
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    }
    return rejectWithValue({ message: "Неизвестная ошибка" });
  }
});

const todoSlice = createSlice({
  name: "todos",
  initialState: initialTodosState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<keyof TodoInfo>) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    addAsyncThunkCases(builder, getTodosThunk, "todos");
  },
});

export const { setActiveTab } = todoSlice.actions;

export default todoSlice.reducer;
