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
    const response = await api.post("", payload); // /openingstock/opening-stock
    return response.data;
  },

  getOpeningStockByStore: async (code: string) => {
    try {
      const response = await api.get(`/${code}`); // /openingstock/opening-stock/store/${code}
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return { success: false, message: "No opening stock found", items: [] };
      }
      throw error;
    }
  },

  getStockByStoreCode: async (code: string) => {
    try {
      const response = await api.get(``, { // /openingstock/opening-stock/by-store
        params: { store: code }
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching stock by store code:", error);
      return { success: false, data: [] };
    }
  },

  getOpeningStockHistory: async (params?: { store?: string; fromDate?: string; toDate?: string }) => {
    const response = await api.get("", { params }); // /openingstock/opening-stock
    return response.data;
  },

  getStockByStore: async (storeId: string) => {
    const response = await api.get(``, { params: { store: storeId } }); // /stock/by-store
    return response.data;
  }
};