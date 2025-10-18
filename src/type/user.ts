
export interface UserResponse {
  userId: string;
  username: string;
  email: string;
  status: string;
  avatarUrl: string | null;
}

export interface UserSuccessResponse {
  success: true;
  message: string;
  data: UserResponse;
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