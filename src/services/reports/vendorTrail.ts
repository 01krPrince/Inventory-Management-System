import api from "../api";

// --- TRIAL INTERFACES ---
export interface IVendorTrialItem {
  name: string;
  code: string;
  contactPerson: string;
  cellNo: string;
  email: string;
  pan: string;
  gst: string;
  address: string;
  zone: string;
  state_name: string;
  city_name: string;
  salesman: string;
  ledger: string;
  party_print_name: string;
  openingDebit: number;
  openingCredit: number;
  duringDebit: number;
  duringCredit: number;
  closingDebit: number;
  closingCredit: number;
}

export interface IVendorTrialResponse {
  success: boolean;
  meta: {
    count: number;
    grandTotal: Record<string, any>;
  };
  data: IVendorTrialItem[];
}

export interface IVendorTrialParams {
  storeCode?: string;
  fromDate?: string;
  toDate?: string;
}

// --- LEDGER INTERFACES ---
export interface IVendorLedgerParams {
  storeCode?: string;
  vendorCode?: string;
  fromDate?: string;
  toDate?: string;
}

export interface IVendorTransaction {
  // The API sometimes sends PascalCase, sometimes camelCase. We type both.
  Date?: string;
  date?: string;
  VoucherNo?: string;
  voucherNo?: string;
  Debit?: number;
  debit?: number;
  Credit?: number;
  credit?: number;
  Balance?: number;
  balance?: number;
  item_description?: string;
  state_name?: string;
  PartyCode?: string;
  partyRefNo?: string;
  gst?: string;
  FullAddress?: string;
  amount?: number;
}

export interface IVendorLedgerResponse {
  success: boolean;
  data: IVendorTransaction[];
}

const vendorTrialService = {
  getAllVendorTrials: async (
    params: IVendorTrialParams,
  ): Promise<IVendorTrialResponse> => {
    const response = await api.get<IVendorTrialResponse>(
      "/vendorledger/all-ledger-report",
      { params },
    );
    return response.data;
  },

  getVendorStatement: async (
    params: IVendorLedgerParams,
  ): Promise<IVendorLedgerResponse> => {
    const response = await api.get<IVendorLedgerResponse>(
      "/vendorledger/statement",
      { params },
    );
    return response.data;
  },
};

export default vendorTrialService;
