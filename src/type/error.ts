export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
}

export interface AxiosErrorWithProblem extends Error {
  response?: {
    data?: ProblemDetails;
  };
  code?: string;
}