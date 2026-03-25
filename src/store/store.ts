import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import todosReducer from "./slices/todo/todoSlice";
import userReducer from "./slices/users/usersSlice";
import adminReducer from "./slices/admin/adminSlice";

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    auth: authReducer,
    user: userReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
