// services/reports/customerTrail.ts
import api from "../api";

export interface ICustomerTrialItem {
  code: string;
  name: string;
  print_name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  openingDebit: number;
  openingCredit: number;
  duringDebit: number;
  duringCredit: number;
  closingDebit: number;
  closingCredit: number;
}

export interface ICustomerTrialResponse {
  success: boolean;
  meta: {
    count: number;
    grandTotal: Record<string, number>;
  };
  data: ICustomerTrialItem[];
}

export interface ICustomerTrialParams {
  storeCode?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ICustomerStatementParams {
  storeCode?: string;
  customerCode?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ICustomerTransaction {
  _id: string;
  date: string;
  voucherNo: string;
  txnType: string;
  particulars: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface ICustomerStatementResponse {
  success: boolean;
  meta: {
    customerName: string;
    partyCode: string;
    fromDate: string;
    toDate: string;
    openingBalance: number;
    currentBalance: number;
    totalDebitInPeriod: number;
    totalCreditInPeriod: number;
  };
  data: ICustomerTransaction[];
}

const customerTrialService = {
  getAllCustomerTrials: async (
    params: ICustomerTrialParams,
  ): Promise<ICustomerTrialResponse> => {
    const response = await api.get<ICustomerTrialResponse>(
      "/customertrail/all-ledger-report",
      { params },
    );
    return response.data;
  },

  getCustomerStatement: async (
    params: ICustomerStatementParams,
  ): Promise<ICustomerStatementResponse> => {
    const response = await api.get<ICustomerStatementResponse>(
      "/customertrail/statement",
      { params },
    );
    return response.data;
  },
};

export default customerTrialService;
