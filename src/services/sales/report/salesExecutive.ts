import api from "../../api";

/**
 * Interface representing a single stock item from the API response
 */
export interface StockItem {
  _id: string;
  itemcode: string;
  store: string;
  name: string;
  description: string;
  group: string;
  unit: string;
  opening_qty: number;
  inward_qty: number;
  outward_qty: number;
  closing_qty: number;
  closing_value: number;
  standard_sales_rate: number;
  mrp: number;
  purchase_rate: number;
  hsn_code: string;
  tax_category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Interface for the paginated Stock Summary response
 */
export interface StockSummaryResponse {
  success: boolean;
  total: number;
  data: StockItem[];
}

/**
 * Standard API response wrapper (matching salesExecutive.ts pattern)
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const stockSummaryService = {
  /**
   * Get Stock Summary data
   * Endpoint: GET /api/stocksummery/stocksummary
   * @param params Optional query parameters for filtering/pagination
   */
  getStockSummary: async (params?: any): Promise<StockSummaryResponse> => {
    const response = await api.get<StockSummaryResponse>(
      "/stocksummery/stocksummary",
      { params }
    );
    return response.data;
  },

  /**
   * Get a specific stock item by ID
   * Endpoint: GET /api/stocksummery/getbyid/:id
   */
  getStockItemById: async (id: string): Promise<ApiResponse<StockItem>> => {
    const response = await api.get<ApiResponse<StockItem>>(
      `/stocksummery/getbyid/${id}`
    );
    return response.data;
  },

  /**
   * Get stock summary filtered by store
   * Endpoint: GET /api/stocksummery/getbystore/:storeId
   */
  getStockByStore: async (storeId: string): Promise<ApiResponse<StockItem[]>> => {
    const response = await api.get<ApiResponse<StockItem[]>>(
      `/stocksummery/getbystore/${storeId}`
    );
    return response.data;
  }
};

export default stockSummaryService;