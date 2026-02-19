import api from "../../../../../services/api";

// ==========================================
// 1. Interfaces / Types
// ==========================================

export interface StockAdjustmentItem {
  _id?: string; // Optional for creation, present in get/update
  itemcode: string;
  description: string;
  packUnit: string;
  packQuantity: number;
  unit: string;
  quantity: number;
  ratePer: number;
  rate: number;
  amount: number;
  minRate: number;
  mrp: number;
  netRate: number;
  remark: string;
  printDesc: string;
  serviceLocation: string;
  itemBarcode: string;
  bdBatchNo: string;
  bdMfgDate: string;
  bdExpDate: string;
  bdSaleRate: number;
  itemBalance: number;
  barcode: string;
  lineLevelBarcode: string;
  hsnCode: string;
  brand: string;
}

export interface StockAdjustment {
  _id?: string;
  category: string;
  store: string;
  party: string;
  voucherDate: string;
  voucherNo: string;
  remarks: string;
  items: StockAdjustmentItem[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// API Response Wrappers
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ==========================================
// 2. API Functions
// ==========================================

/**
 * Create New Stock Adjustment
 * Endpoint: /stockadjustment/create
 */
export const createStockAdjustment = async (
  payload: StockAdjustment
): Promise<ApiResponse<StockAdjustment>> => {
  try {
    // api.post automatically uses BASE_URL and adds the Token
    const response = await api.post<ApiResponse<StockAdjustment>>('', payload); // /stockadjustment/create
    
    // Assuming backend returns { success: true, data: { ... } }
    return {
      success: true,
      message: "Stock Adjustment Created Successfully",
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("API Error (Create):", error);
    const responseData = error.response?.data;

    // Handle Duplicate Key Error
    if (responseData?.error && typeof responseData.error === 'string' && responseData.error.includes("duplicate key")) {
      return {
        success: false,
        message: `Voucher Number "${payload.voucherNo}" already exists.`,
        error: responseData.error,
      };
    }

    return {
      success: false,
      message: responseData?.message || "Failed to create stock adjustment.",
      error: responseData?.error,
    };
  }
};

/**
 * Fetch All Stock Adjustments
 * Endpoint: /stockadjustment/getall
 */
export const getAllStockAdjustments = async (): Promise<ApiResponse<StockAdjustment[]>> => {
  try {
    const response = await api.get<ApiResponse<StockAdjustment[]>>(''); // /stockadjustment/getall
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error: any) {
    console.error("API Error (GetAll):", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch records.",
    };
  }
};

/**
 * Get Stock Adjustment By ID
 * Endpoint: /stockadjustment/getbyid/:id
 */
export const getStockAdjustmentById = async (id: string): Promise<ApiResponse<StockAdjustment>> => {
  try {
    const response = await api.get<ApiResponse<StockAdjustment>>(`/${id}`); // /stockadjustment/getbyid/${id}
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error(`API Error (GetById ${id}):`, error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch record.",
    };
  }
};

/**
 * Update Stock Adjustment By ID
 * Endpoint: /stockadjustment/updatebyid/:id
 */
export const updateStockAdjustment = async (
  id: string,
  payload: StockAdjustment
): Promise<ApiResponse<StockAdjustment>> => {
  try {
    const response = await api.put<ApiResponse<StockAdjustment>>(`/${id}`, payload); // /stockadjustment/updatebyid/${id}
    return {
      success: true,
      message: "Stock Adjustment Updated Successfully",
      data: response.data.data,
    };
  } catch (error: any) {
    console.error(`API Error (Update ${id}):`, error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update record.",
      error: error.response?.data?.error,
    };
  }
};

/**
 * Delete Stock Adjustment By ID
 * Endpoint: /stockadjustment/deletebyid/:id
 */
export const deleteStockAdjustment = async (id: string): Promise<ApiResponse<null>> => {
  try {
    await api.delete<ApiResponse<null>>(`/${id}`); // /stockadjustment/deletebyid/${id}
    return {
      success: true,
      message: "Stock Adjustment Deleted Successfully",
    };
  } catch (error: any) {
    console.error(`API Error (Delete ${id}):`, error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete record.",
    };
  }
};