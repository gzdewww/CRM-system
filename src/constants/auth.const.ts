const SIGN_IN_ERRORS = {
  400: "Введены некорректные данные",
  401: "Неправильный логин или пароль",
  500: "Внутренняя ошибка сервера",
} as const;

const SIGN_UP_ERRORS = {
  400: "Введены некорректные данные",
  409: "Пользователь с такими данными уже существует",
  500: "Внутренняя ошибка сервера",
} as const;

const REFRESH_ERRORS = {
  400: "Ошибка обновления токена",
  401: "Необходима авторизация",
  500: "Внутренняя ошибка сервера",
} as const;

const LOGIN_VALIDATION = {
  min: 2,
  max: 64,
  pattern: /^[a-zA-Z0-9_.-]+$/,
} as const;

const PASSWORD_VALIDATION = {
  min: 6,
  max: 64,
} as const;

const USERNAME_VALIDATION = {
  min: 1,
  max: 60,
  pattern: /^[а-яА-Яa-zA-Z0-9_.-]+$/,
} as const;

const TEL_VALIDATION = {
  pattern: /^\+7\d{10}$/,
} as const;

export {
  SIGN_IN_ERRORS,
  SIGN_UP_ERRORS,
  REFRESH_ERRORS,
  LOGIN_VALIDATION,
  PASSWORD_VALIDATION,
  USERNAME_VALIDATION,
  TEL_VALIDATION,
};
