export interface User {
  userId: string;
  username: string;
  email: string;
  status: "ONLINE" | "OFFLINE";
  avatarUrl: string | null;
}

export interface UserSuccessResponse {
  success: true;
  message: string;
  data: User;
}

export interface UserErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}