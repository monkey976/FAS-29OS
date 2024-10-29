// src/types/ApiResponse.ts
export interface ApiResponse<T> {
    code: number;
    isSuccess: boolean;
    msg: string;
    sysDateTime: string;
    rowsCount: number;
    data: T;
  }
  