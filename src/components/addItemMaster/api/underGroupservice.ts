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

// The main Data Interface for your UI Form State
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
  exclude_cvss_applist?: boolean;
  image: string | null;
}

// New Interface: STRICTLY matches the API Payload (The "Needed Body")
export interface ItemGroupApiPayload {
  item_group_mode: string;
  item_name: string;
  under_group: string;
  item_desc: string;       // Renamed from 'description'
  item_type: string;
  unit_option: string;
  stock_unit: string;
  gst_classification: string;
  sales_gl: string;
  purchase_gl: string;
  maximum_level: string;   // API expects string
  rate_factor: string;     // API expects string
  drug_type: string;
  purchase_rate_factor: string; // API expects string
  batch_wise_inventory: boolean;
  batch_wise_rate: boolean;
  exclude_from_cvss: boolean;   // Renamed from 'exclude_cvss'
}

// --- API Functions ---

/**
 * Fetches the list of Stock Units for the dropdown
 */
export const fetchStockUnits = async (): Promise<StockUnitData[]> => {
  try {
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
 * Payload must match ItemGroupApiPayload (The snake_case structure)
 */
export const createUnderGroup = async (
  payload: ItemGroupApiPayload
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
  payload: ItemGroupApiPayload
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