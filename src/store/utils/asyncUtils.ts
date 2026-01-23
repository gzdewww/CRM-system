import type {
  ActionReducerMapBuilder,
  AsyncThunk,
  AsyncThunkConfig,
  Draft,
} from "@reduxjs/toolkit";

export type AsyncStatus = "idle" | "pending" | "fulfilled" | "rejected";

export interface ApiError {
  message: string;
  status?: number;
}

export interface AsyncParticle<T> {
  data: T | null;
  status: AsyncStatus;
  error: ApiError | null;
}

export interface AsyncDataStatus {
  hasError: boolean;
  isIdle: boolean;
  isLoading: boolean;
  isLoadingOrIdle: boolean;
  isLoaded: boolean;
  isLoadedOrError: boolean;
}

export const createAsyncParticle = <T>(
  initialData: T | null = null
): AsyncParticle<T> => ({
  data: initialData,
  status: "idle",
  error: null,
});

export const getAsyncDataStatus = (
  particle: AsyncParticle<unknown>
): AsyncDataStatus => ({
  hasError: particle.status === "rejected",
  isIdle: particle.status === "idle",
  isLoading: particle.status === "pending",
  isLoadingOrIdle: particle.status === "pending" || particle.status === "idle",
  isLoaded: particle.status === "fulfilled",
  isLoadedOrError:
    particle.status === "fulfilled" || particle.status === "rejected",
});

export interface AsyncRequestData<T> {
  data: T | null;
  error: ApiError | null;
  status: AsyncDataStatus;
}

export const getAsyncRequestData = <T>(
  particle: AsyncParticle<T>
): AsyncRequestData<T> => ({
  data: particle.data,
  error: particle.error,
  status: getAsyncDataStatus(particle),
});

export const addAsyncThunkCases = <
  State,
  Response,
  Request,
  Config extends AsyncThunkConfig = AsyncThunkConfig
>(
  builder: ActionReducerMapBuilder<State>,
  asyncThunk: AsyncThunk<Response, Request, Config>,
  key: keyof State | null,
  onFulfilled?: (state: Draft<State>, payload: Response) => void,
  onRejected?: (state: Draft<State>) => void
) => {
  // PENDING
  builder.addCase(asyncThunk.pending, (state) => {
    const typedState = state as Record<string, AsyncParticle<Response>>;

    typedState[String(key)].status = "pending";
    typedState[String(key)].error = null;
  });
  // FULFILLED
  builder.addCase(asyncThunk.fulfilled, (state, action) => {
    const typedState = state as Record<string, AsyncParticle<Response>>;

    typedState[String(key)].error = null;
    typedState[String(key)].data = action.payload;

    if (onFulfilled) onFulfilled(state, action.payload);
    typedState[String(key)].status = "fulfilled";
  });

  // REJECTED
  builder.addCase(asyncThunk.rejected, (state, action) => {
    const typedState = state as Record<string, AsyncParticle<Response>>;

    typedState[String(key)].error = action.payload as ApiError;
    
    if (onRejected) onRejected(state);
    typedState[String(key)].status = "rejected";
  });
};
