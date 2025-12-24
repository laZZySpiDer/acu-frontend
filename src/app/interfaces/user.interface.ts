export interface UserLoginResponse {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  token?: string;
  phone?: string;
  address?: string;
  pincode?: string;
  landmark?: string;
  city?: string;
  state?: string;
  profile_avatar?: string;
  provider?: string;
  providers?: string[];
}