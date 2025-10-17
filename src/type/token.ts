import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface TokenRequest {
  email: string;
  password: string;
}
export interface TokenData {
  token: string;
  issuedAt: number;
  expiresAt: number;
  expiresIn: number;
  issuer: string;
  username: string;
}

export interface TokenSuccessResponse {
  success: true;
  message: string;
  data: TokenData;
}

export interface TokenErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
}


export interface ApiError<T = any> extends Error {
  config: AxiosRequestConfig;
  code?: string;
  request?: any;
  response?: AxiosResponse<T>;
  isAxiosError: boolean;
  toJSON: () => object;
}