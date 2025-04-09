export interface UserLoginResponse {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  token?: string;
}