export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  user: UserInfo;
}

export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  role: 'ADMIN' | 'USER';
}