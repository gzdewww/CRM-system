import { getRefreshToken, hasRefreshToken } from "../helpers/storeTokenLocal";
import type { Profile, Token } from "../types/auth.types";
import type { MetaResponse, Todo, TodoInfo } from "../types/todo.types";
import type { AuthState } from "./slices/auth/authSlice";
import type { TodoState } from "./slices/todo/todoSlice";
import type { UserState } from "./slices/user/userSlice";
import { createAsyncParticle } from "./utils/asyncUtils";

export const initialTodosState: TodoState = {
  todos: createAsyncParticle<MetaResponse<Todo, TodoInfo>>(null),
  activeTab: "all",
};

export const initialAuthState: AuthState = {
  isAuth: false,
  token: createAsyncParticle<Token>(
    hasRefreshToken()
      ? { accessToken: "", refreshToken: String(getRefreshToken()) }
      : null
  ),
  rememberMe: false,
};

export const initialUserState: UserState = {
  profile: createAsyncParticle<Profile>(null),
};
