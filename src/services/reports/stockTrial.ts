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
  salesRate: number;
  purchaseRate: number;
  mrp: number;
  itemType: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  getAllStockTrials: async (params?: IStockTrialParams): Promise<IStockTrialResponse> => {
    const response = await api.get<IStockTrialResponse>("/stocktrails/all", {
      params: params,
    });
    return response.data;
  },

};

export default stockTrialService;