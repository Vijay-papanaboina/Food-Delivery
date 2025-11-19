import { AxiosError, type AxiosResponse } from "axios";

export interface AxiosErrorResponse extends AxiosError {
  response?: AxiosResponse<{
    error?: string;
    message?: string;
    details?: string;
  }>;
  status?: number;
}
