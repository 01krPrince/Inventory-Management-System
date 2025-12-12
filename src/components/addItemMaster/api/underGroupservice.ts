import api from "../../../services/api";

// --- Interfaces ---

// Response structure for generic API calls
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Matches the data structure required for Stock Unit dropdown
export interface StockUnitData {
  _id?: string;
  code: string;
  name: string;
  uqc: string;
}

// Matches the GST/HSN dropdown requirements
export interface GstClassificationData {
  _id?: string;
  name: string; // HSN/SAC
  description: string;
}

// The main Data Interface matching the Payload sent in handleSave
export interface UnderGroupData {
  _id?: string;
  item_name: string;
  code: string;
  under_group: string;
  item_mode: string; // "Inventory" | "Non-Inventory" | "Service" | "Bundle"
  description: string;
  type: string;
  unit_option: string;
  stock_unit: string;
  gst_classification: string;
  sales_gl: string;
  purchase_gl: string;
  minimum_level: number;
  rate_factor: number;
  item_type: string;
  drug_type: string;
  purchase_rate_factor: number;
  batch_wise_inventory: boolean;
  batch_wise_rate: boolean;
  exclude_cvss: boolean;
  // Some legacy data might use this key, supporting both is safer for Types
  exclude_cvss_applist?: boolean; 
  image: string | null;
}

// --- API Functions ---

/**
 * Fetches the list of Stock Units for the dropdown
 */
export const fetchStockUnits = async (): Promise<StockUnitData[]> => {
  try {
    // Adjust endpoint path as per your actual backend route
    const response = await api.get<ApiResponse<StockUnitData[]>>("/stock-unit/get");
    if (response.data && response.data.success) {
      return response.data.data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching stock units:", error);
    return [];
  }
};

/**
 * Fetches GST Classifications for the dropdown
 */
export const fetchGstClassifications = async (): Promise<GstClassificationData[]> => {
  try {
    // Adjust endpoint path as per your actual backend route
    const response = await api.get<ApiResponse<GstClassificationData[]>>("/gst-classification/get");
    if (response.data && response.data.success) {
      return response.data.data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching GST classifications:", error);
    return [];
  }
};

/**
 * Fetches the main list of Item Groups (UnderGroups)
 */
export const fetchUnderGroup = async (): Promise<UnderGroupData[]> => {
  try {
    const response = await api.get<ApiResponse<UnderGroupData[]>>("/item/get");
    if (response.data && response.data.success) {
      return response.data.data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching item groups:", error);
    return [];
  }
};

/**
 * Creates a new Item Group
 * Payload matches the snake_case object constructed in handleSave
 */
export const createUnderGroup = async (
  payload: Omit<UnderGroupData, "_id">
): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>("/item/create", payload);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create item group",
    };
  }
};

/**
 * Updates an existing Item Group
 */
export const updateUnderGroup = async (
  id: string,
  payload: Omit<UnderGroupData, "_id">
): Promise<ApiResponse> => {
  try {
    const response = await api.put<ApiResponse>(`/item/update/${id}`, payload);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update item group",
    };
  }
};

/**
 * Deletes an Item Group
 */
export const deleteUnderGroup = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete<ApiResponse>(`/item/delete/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete item group",
    };
  }
};