import type { Profile } from "../types/auth.types";
import type { MetaResponse, Todo, TodoInfo } from "../types/todo.types";
import type { AuthState } from "./slices/auth/authSlice";
import type { TodoState } from "./slices/todo/todoSlice";
import type { UserState } from "./slices/users/usersSlice";
import { createAsyncParticle } from "./utils/asyncUtils";

export const initialTodosState: TodoState = {
  todos: createAsyncParticle<MetaResponse<Todo, TodoInfo>>(null),
  activeTab: "all",
};

export const initialAuthState: AuthState = {
  isAuth: createAsyncParticle<boolean>(false),
  rememberMe: false,
};

export const initialUserState: UserState = {
  profile: createAsyncParticle<Profile>(null),
};
