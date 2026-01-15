import api from "../../api";

// --- Interfaces ---

export interface OpeningStockItem {
  item: string;          // Database ID
  itemcode: string;
  description: string;
  batchNo?: string;
  packQty: number;
  quantity: number;
  rate: number;
  amount: number;
  itemBalance?: number;
  sale_rate?: number;
  wholesale_rate?: number;
  dealer_rate?: number;
  mrp?: number;
}

export interface OpeningStockPayload {
  store: string;         // Store ID
  voucherDate: string;
  remarks?: string;
  items: OpeningStockItem[];
}

// --- Service ---

export const openingStockService = {
  // 1. CREATE Opening Stock
  createOpeningStock: async (payload: OpeningStockPayload) => {
    const response = await api.post("/openingstock/opening-stock", payload);
    return response.data;
  },

  // 2. GET Opening Stock (with optional filters for Store and Dates)
  getOpeningStockHistory: async (params?: { store?: string; fromDate?: string; toDate?: string }) => {
    const response = await api.get("/openingstock/opening-stock", { params });
    return response.data;
  },

  // 3. STOCK INQUIRY APIS

  /** Get total stock for all items in a specific store */
  getStockByStore: async (storeId: string) => {
    const response = await api.get(`/stock/by-store`, {
      params: { store: storeId }
    });
    return response.data;
  },

  /** Get stock for a specific item across all stores */
  getStockByItem: async (itemId: string) => {
    const response = await api.get(`/stock/by-item/${itemId}`);
    return response.data;
  },

  /** Get stock for a specific item in a specific store (via IDs) */
  getStockByStoreAndItem: async (storeId: string, itemId: string) => {
    const response = await api.get(`/stock/by-store-item/${storeId}/${itemId}`);
    return response.data;
  },

  /** Get stock for a specific item in a store using the Item Code (Search) */
  getStockByItemCode: async (storeId: string, itemCode: string) => {
    const response = await api.get(`/stock/by-item-code`, {
      params: { store: storeId, code: itemCode }
    });
    return response.data;
  }
};