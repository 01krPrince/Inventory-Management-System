import api from "../api";

export interface IStockTrialItem {
  _id: string;
  itemCode: string;
  itemName: string;
  store: string;
  group: string;
  category: string;
  brand: string;
  barcode: string;
  opening_qty: number;
  inward_qty: number;
  outward_qty: number;
  closing_qty: number;
  saleRate: number;
  purchaseRate: number;
  mrp: number;
  itemType: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Interface matching the specific JSON response you provided
export interface IStockLedgerApiResponse {
  _id: string;
  voucherNo: string;
  partyName: string; // We will map this to Remark
  quantity: number;
  balance_qty: number;
  date: string;
  rate: number;
  amount?: number;
  direction: "IN" | "OUT" | "NA";
  itemCode?: string;
  itemName?: string;
  itemGroup?: string; // We map this to Group Name
  store?: string;
  unit?: string;
  category?: string;
  barcode?: string;
  ref_no?: string; // We map this to Doc Ref
  balance_amount?: string | number; // API sends string "600.0", we need to parse
}

export interface IStockLedgerParams {
  storeCode?: string;
  itemCode?: string;
  fromDate?: string;
  toDate?: string;
}

export interface IStockLedgerResponse {
  success: boolean;
  data: IStockLedgerApiResponse[];
}

export interface IStockTrialResponse {
  success: boolean;
  count: number;
  data: IStockTrialItem[];
}

export interface IStockTrialParams {
  storeCode?: string;
  fromDate?: string;
  toDate?: string;
}

const stockTrialService = {
  /**
   * Fetch all stock trials with optional filters
   */
  getAllStockTrials: async (
    params?: IStockTrialParams,
  ): Promise<IStockTrialResponse> => {
    const response = await api.get<IStockTrialResponse>("", { // /stocktrails/all
      params: params,
    });
    return response.data;
  },
  getStockLedger: async (
    params: IStockLedgerParams,
  ): Promise<IStockLedgerResponse> => {
    const response = await api.get<IStockLedgerResponse>(
      "", // /stocktrails/ledger
      {
        params: params,
      },
    );
    return response.data;
  },
};

///next api here...

export default stockTrialService;
