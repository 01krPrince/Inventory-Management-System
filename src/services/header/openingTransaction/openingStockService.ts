import api from "../../api";

export interface OpeningStockItem {
  item: string;
  itemcode: string;
  description: string;
  batchNo?: string;
  packQty: number;
  quantity: number;
  rate: number;
  amount: number;
  itemBalance?: number;
  sale_rate?: number;
  mrp?: number;
}

export interface OpeningStockPayload {
  store: string;
  voucherDate: string;
  remarks?: string;
  items: OpeningStockItem[];
}

export const openingStockService = {
  createOpeningStock: async (payload: OpeningStockPayload) => {
    const response = await api.post("/openingstock/opening-stock", payload);
    return response.data;
  },

  getOpeningStockByStore: async (storeId: string) => {
    try {
      const response = await api.get(`/openingstock/opening-stock/store/${storeId}`);
      return response.data; 
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return { success: false, message: "No opening stock found", items: [] };
      }
      throw error;
    }
  },

  getOpeningStockHistory: async (params?: { store?: string; fromDate?: string; toDate?: string }) => {
    const response = await api.get("/openingstock/opening-stock", { params });
    return response.data;
  },

  getStockByStore: async (storeId: string) => {
    const response = await api.get(`/stock/by-store`, { params: { store: storeId } });
    return response.data;
  }
};