const REFRESH_TOKEN_KEY = "refreshToken";

const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

const setRefreshToken = (refreshToken: string, rememberMe: boolean): void => {
  if (!refreshToken) {
    return;
  }
  if (rememberMe) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const removeRefreshToken = (): void => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

const hasRefreshToken = (): boolean => !!getRefreshToken();

export {
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  hasRefreshToken,
};
