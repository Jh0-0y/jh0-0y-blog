export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  role: 'ADMIN' | 'USER';
}