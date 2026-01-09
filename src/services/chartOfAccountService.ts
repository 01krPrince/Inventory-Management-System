import api from "./api";
import { AxiosResponse } from "axios";

/* =========================
   Types & Interfaces
========================= */

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
  identification: string;
  isSubleder: boolean;
  underLedger: string;
  underGroup: string | UnderGroup;
  type: string;
  accountNo: string;
  ifscRtgs: string;
  classification: string;
  isLoanAccount: boolean;
  intrestRate: number;
  calcultaionOn: string;
  tdsApplicable: boolean;
  tdsSection: string;
  address: string;
  pan: string;
  employee: boolean;
  group: boolean;
  code?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/* =========================
   API Endpoints
========================= */

const BASE_PATH = "/chartofaccount";

/* =========================
   Services
========================= */

/** Get all chart of accounts */
export const getAllChartOfAccounts = (): Promise<
  AxiosResponse<ApiResponse<ChartOfAccount[]>>
> => {
  return api.get(`${BASE_PATH}/all`);
};

/** Create chart of account */
export const createChartOfAccount = (
  payload: ChartOfAccount
): Promise<AxiosResponse<ApiResponse<ChartOfAccount>>> => {
  return api.post(`${BASE_PATH}/create`, payload);
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

/* =========================
   Default Export (Optional)
========================= */

const chartOfAccountService = {
  getAllChartOfAccounts,
  createChartOfAccount,
  getChartOfAccountById,
  getChartOfAccountByCode,
  updateChartOfAccountById,
  deleteChartOfAccountById,
};

export default chartOfAccountService;
