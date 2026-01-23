interface UserRegistration {
  login: string;
  username: string;
  password: string;
  email: string;
  phoneNumber?: string;
}

interface AuthData {
  login: string;
  password: string;
}

interface Profile {
  id: number;
  username: string;
  email: string;
  date: string;
  isBlocked: boolean;
  roles: Role[];
  phoneNumber?: string;
}

interface ProfileRequest {
  username: string;
  email: string;
  phoneNumber?: string;
}

interface PasswordRequest {
  password: string;
}

interface Token {
  accessToken: string;
  refreshToken: string;
}

interface TokenRequest {
  refreshToken: string | null;
}

type Role = "ADMIN" | "USER" | "MODERATOR";

export type {
  UserRegistration,
  AuthData,
  Profile,
  ProfileRequest,
  PasswordRequest,
  Token,
  TokenRequest,
  Role,
};
