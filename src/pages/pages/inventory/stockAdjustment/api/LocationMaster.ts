import api from "../../../../../services/api";

// ==========================================
// 1. Interfaces / Types
// ==========================================

// The full object structure coming from the Database
export interface LocationMaster {
  _id: string;
  name: string;
  party: string;
  profilePic: string; // URL string
  gstNo: string;
  ewayUsername?: string;
  ewayPassword?: string;
  gstInUsername?: string;
  gstInPassword?: string;
  othelicense1?: string;
  othelicense2?: string;
  bankDetails: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  phone: string;
  email: string;
  code: string; // Included in GET response
  __v?: number;
}

// The Input object for Creating/Updating (excludes _id, __v)
export interface LocationMasterInput {
  name: string;
  party: string;
  profilePic?: string;
  gstNo: string;
  ewayUsername?: string;
  ewayPassword?: string;
  gstInUsername?: string;
  gstInPassword?: string;
  othelicense1?: string;
  othelicense2?: string;
  bankDetails: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  phone: string;
  email: string;
  code?: string;
}

// API Response Wrappers
export interface GetLocationMasterResponse {
  success: boolean;
  data: LocationMaster[];
}

export interface SingleLocationResponse {
  success: boolean;
  data: LocationMaster;
}

// ==========================================
// 2. API Functions
// ==========================================

/**
 * Fetch All Locations
 * Endpoint: /locationmaster/getall
 */
export const fetchAllLocations = async (): Promise<LocationMaster[]> => {
  try {
    const response = await api.get<GetLocationMasterResponse>(''); // /locationmaster/getall
    console.log(response);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching location master:", error);
    throw error;
  }
};

/**
 * Get Location By ID
 * Endpoint: /locationmaster/getbyid/:id
 */
export const getLocationById = async (id: string): Promise<LocationMaster | null> => {
  try {
    const response = await api.get<LocationMaster>(`/${id}`);// /locationmaster/getbyid/${id}
    return response.data;
  } catch (error) {
    console.error(`Error fetching location by ID (${id}):`, error);
    return null;
  }
};

/**
 * Get Location By Code
 * Endpoint: /locationmaster/getbycode/:code
 */
export const getLocationByCode = async (code: string): Promise<LocationMaster | null> => {
  try {
    const response = await api.get<LocationMaster>(`/${code}`); // /locationmaster/getbycode/${code}
    return response.data;
  } catch (error) {
    console.error(`Error fetching location by Code (${code}):`, error);
    return null;
  }
};

/**
 * Create New Location
 * Endpoint: /locationmaster/create
 */
export const createLocation = async (
  formData: LocationMasterInput
): Promise<LocationMaster | null> => {
  try {
    const response = await api.post<LocationMaster>(
      '',  // /locationmaster/create
      formData
    );
    // Assuming the API returns the created object directly or inside a wrapper
    return response.data; 
  } catch (error) {
    console.error("Error creating location:", error);
    throw error;
  }
};

/**
 * Update Location
 * Endpoint: /locationmaster/update/:id
 */
export const updateLocation = async (
  id: string,
  formData: Partial<LocationMasterInput>
): Promise<LocationMaster | null> => {
  try {
    const response = await api.put<LocationMaster>(
      `/${id}`, // /locationmaster/update/${id}
      formData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating location (${id}):`, error);
    throw error;
  }
};

/**
 * Delete Location
 * Endpoint: /locationmaster/delete/:id
 */
export const deleteLocation = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/${id}`); // /locationmaster/delete/${id}
    return true;
  } catch (error) {
    console.error(`Error deleting location (${id}):`, error);
    throw error;
  }
};