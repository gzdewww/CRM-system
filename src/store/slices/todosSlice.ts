import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getTodos } from "../../api/todo.api";
import { TODO_INFO_DEFAULT_STATE } from "../../constants/todo.const";
import type { Todo, TodoInfo } from "../../types/todo.types";

export interface TodosState {
  isLoading: boolean;
  todos: Todo[];
  info: TodoInfo;
  activeTab: keyof TodoInfo;
}

const initialTodosState: TodosState = {
  isLoading: false,
  todos: [],
  info: { all: 0, inWork: 0, completed: 0 },
  activeTab: "all",
};

export const getTodosThunk = createAsyncThunk(
  "todos/getTodos",
  async (activeTab: keyof TodoInfo = "all", { rejectWithValue }) => {
    try {
      return await getTodos(activeTab);
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState: initialTodosState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<keyof TodoInfo>) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTodosThunk.fulfilled, (state, action) => {
      state.todos = action.payload?.data ?? [];
      state.info = action.payload?.info ?? TODO_INFO_DEFAULT_STATE;
      state.isLoading = false;
    });
    builder.addCase(getTodosThunk.rejected, (state) => {
      state.todos = [];
      state.info = TODO_INFO_DEFAULT_STATE;
      state.isLoading = false;
    });
    builder.addCase(getTodosThunk.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export const { setActiveTab } = todosSlice.actions;

export default todosSlice.reducer;
