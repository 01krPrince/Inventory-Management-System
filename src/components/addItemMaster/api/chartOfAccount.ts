import api from "../../../services/api";

// ==========================================
// 1. Interfaces
// ==========================================

// The full database object
export interface CoaGroup {
  _id: string;
  name: string;
  code: string;
  inactive: boolean;
  nature: string;
  underGroup?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// The Input interface (Request Body for Creation & Update)
export interface CoaGroupInput {
  name: string;
  nature: string;
  inactive: boolean;
  underGroup?: string; 
}

// --- API Response Wrappers ---

export interface GetCoaGroupsResponse {
  success: boolean;
  data: CoaGroup[];
}

export interface CreateCoaGroupResponse {
  success: boolean;
  message: string;
  data?: CoaGroup;
}

export interface UpdateCoaGroupResponse {
  success: boolean;
  message: string;
  data?: CoaGroup;
}

// ==========================================
// 2. API Functions
// ==========================================

// --- GET: Fetch All COA Groups ---
export const fetchCoaGroups = async (): Promise<CoaGroup[]> => {
  try {
    const response = await api.get<GetCoaGroupsResponse>(''); // /coagroups/getall
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching COA Groups:", error);
    return [];
  }
};

// --- POST: Create New COA Group ---
export const createCoaGroup = async (
  formData: CoaGroupInput
): Promise<CreateCoaGroupResponse> => {
  try {
    const response = await api.post<CreateCoaGroupResponse>(
      '', // /coagroups/create_coagroups
      formData
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data as CreateCoaGroupResponse;
    }
    
    console.error("Error creating COA Group:", error);
    return { 
      success: false, 
      message: "An unexpected error occurred while connecting to the server." 
    };
  }
};

// --- PUT: Update Existing COA Group ---
export const updateCoaGroup = async (
  id: string,
  formData: CoaGroupInput
): Promise<UpdateCoaGroupResponse> => {
  try {
    // Using PUT request targeting the specific ID
    const response = await api.put<UpdateCoaGroupResponse>(
      `${id}`, // /coagroups/update_by/${id}
      formData
    );
    return response.data;
  } catch (error: any) {
    // Handle API-specific errors (e.g., validation failed, ID not found)
    if (error.response && error.response.data) {
      return error.response.data as UpdateCoaGroupResponse;
    }
    
    // Handle network or unexpected errors
    console.error(`Error updating COA Group (ID: ${id}):`, error);
    return { 
      success: false, 
      message: "An unexpected error occurred while connecting to the server." 
    };
  }
};