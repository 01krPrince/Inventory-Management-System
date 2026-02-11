import api from "./api";
import { AxiosResponse } from "axios";

export interface UnderGroup {
  _id: string;
  name: string;
  inactive: boolean;
  nature: string;
  code: string;
}

export interface ChartOfAccount {
  _id?: string;
  name: string;
  identification?: string; // Optional or empty string allowed
  isSubleder?: boolean;    // From POST screenshot
  subLedger?: string;     // From GET screenshot ("0.0")
  underGroup: string;     // Can be ID (POST) or Name (GET)
  underGroupCode?: string;
  type?: string;
  classification?: string;
  address?: string;
  employee?: boolean;
  group?: boolean;
  nature?: string;
  code?: string;
  ledger?: string;
  inactive: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  
  // Optional/Legacy fields from your previous code
  underLedger?: string;
  accountNo?: string;
  ifscRtgs?: string;
  isLoanAccount?: boolean;
  intrestRate?: number;
  calcultaionOn?: string;
  tdsApplicable?: boolean;
  tdsSection?: string;
  pan?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const BASE_PATH = "/chartofaccount";

/** Get all chart of accounts */
export const getAllChartOfAccounts = (): Promise<
  AxiosResponse<ChartOfAccount[]>
> => {
  return api.get(`${BASE_PATH}/all/`); // Added trailing slash to match screenshot
};

/** Create chart of account */
export const createChartOfAccount = (
  payload: ChartOfAccount
): Promise<AxiosResponse<ApiResponse<ChartOfAccount>>> => {
  return api.post(`${BASE_PATH}/create/`, payload); // Added trailing slash to match screenshot
};

/** Get chart of account by ID */
export const getChartOfAccountById = (
  id: string
): Promise<AxiosResponse<ApiResponse<ChartOfAccount>>> => {
  return api.get(`${BASE_PATH}/getbyid/${id}`);
};

/** Get chart of account by Code */
export const getChartOfAccountByCode = (
  code: string
): Promise<AxiosResponse<ApiResponse<ChartOfAccount>>> => {
  return api.get(`${BASE_PATH}/getbycode/${code}`);
};

/** Update chart of account by ID */
export const updateChartOfAccountById = (
  id: string,
  payload: Partial<ChartOfAccount>
): Promise<AxiosResponse<ApiResponse<ChartOfAccount>>> => {
  return api.put(`${BASE_PATH}/updatebyid/${id}`, payload);
};

/** Delete chart of account by ID */
export const deleteChartOfAccountById = (
  id: string
): Promise<AxiosResponse<ApiResponse<null>>> => {
  return api.delete(`${BASE_PATH}/deletebyid/${id}`);
};

const chartOfAccountService = {
  getAllChartOfAccounts,
  createChartOfAccount,
  getChartOfAccountById,
  getChartOfAccountByCode,
  updateChartOfAccountById,
  deleteChartOfAccountById,
};

export default chartOfAccountService;