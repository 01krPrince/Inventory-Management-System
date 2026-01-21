import api from "../../../services/api"; 

// --- Interfaces ---

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface SalesExecutiveData {
  _id: string;
  name: string;
  code: string;
  commisionRate: string; 
  rateOn: string;
  amountType: string;
  email: string;
  phone: string;
  reporting_to?: string | null; // Added based on Postman
  underStore?: string | null;   // Added based on Postman
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// Payload for Create/Update
export interface CreateSalesExecutivePayload {
  name: string;
  commisionRate: string;
  rateOn: string;
  amountType: string;
  email: string;
  phone: string;
  reporting_to?: string | null; // Added
  underStore?: string | null;   // Added
}

// --- API Functions ---

export const fetchSalesExecutives = async (): Promise<SalesExecutiveData[]> => {
  try {
    const response = await api.get<ApiResponse<SalesExecutiveData[]>>("/salesexecutive/getall/");
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching sales executives:", error);
    return [];
  }
};

export const fetchSalesExecutiveByCode = async (code: string): Promise<ApiResponse<SalesExecutiveData>> => {
  try {
    const response = await api.get<ApiResponse<SalesExecutiveData>>(`/salesexecutive/getbycode/${code}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch by code",
    };
  }
};

export const fetchSalesExecutiveById = async (id: string): Promise<ApiResponse<SalesExecutiveData>> => {
  try {
    const response = await api.get<ApiResponse<SalesExecutiveData>>(`/salesexecutive/getbyid/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch by ID",
    };
  }
};

export const createSalesExecutive = async (payload: CreateSalesExecutivePayload): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>("/salesexecutive/create/", payload);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create",
    };
  }
};

/**
 * Update an existing Sales Executive
 * FIX: Endpoint changed to /updatebyid/ to match Postman
 */
export const updateSalesExecutive = async (id: string, payload: CreateSalesExecutivePayload): Promise<ApiResponse> => {
  try {
    const response = await api.put<ApiResponse>(`/salesexecutive/updatebyid/${id}`, payload);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update",
    };
  }
};

export const deleteSalesExecutive = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete<ApiResponse>(`/salesexecutive/deletebyid/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete",
    };
  }
};