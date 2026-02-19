import api from "../../services/api";

// --- Types & Interfaces ---

// The structure of a Transporter object based on your response
export interface Transporter {
  _id: string;
  name: string;
  gstNo: string;
  websiteUrl: string;
  code: string;
  __v?: number;
}

// The data required to create or update a transporter
export interface TransporterPayload {
  name: string;
  gstNo: string;
  websiteUrl: string;
}

// Generic API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// --- Service Methods ---

const TransporterService = {
  /**
   * Fetch all transporters
   * GET /transporter/getall/
   */
  getAllTransporters: async (): Promise<ApiResponse<Transporter[]>> => {
    const response = await api.get(""); // /transporter/getall/
    return response.data;
  },

  /**
   * Create a new transporter
   * POST /transporter/create/
   */
  createTransporter: async (
    data: TransporterPayload
  ): Promise<ApiResponse<Transporter>> => {
    const response = await api.post("", data); // /transporter/create/
    return response.data;
  },

  /**
   * Get a transporter by DB ID
   * GET /transporter/getbyid/:id
   */
  getTransporterById: async (
    id: string
  ): Promise<ApiResponse<Transporter>> => {
    const response = await api.get(`/${id}`); // /transporter/getbyid/${id}
    return response.data;
  },

  /**
   * Update a transporter by ID
   * PUT /transporter/updatebyid/:id
   */
  updateTransporter: async (
    id: string,
    data: Partial<TransporterPayload>
  ): Promise<ApiResponse<Transporter>> => {
    const response = await api.put(`/${id}`, data); // /transporter/updatebyid/${id}
    return response.data;
  },

  /**
   * Get a transporter by their unique Code (e.g., 0001)
   * GET /transporter/getbycode/:code
   */
  getTransporterByCode: async (
    code: string
  ): Promise<ApiResponse<Transporter>> => {
    const response = await api.get(`/${code}`); // /transporter/getbycode/${code}
    return response.data;
  },
};

export default TransporterService;