import api from "./api";

export interface SalesExecutive {
  _id: string;
  name: string;
  email: string;
  phone: string;
  commisionRate: string;
  rateOn: "Net Amount" | "Qty" | string;
  amountType: "Percentage" | "Fixed" | string;
  underStore: string;
  reporting_to: string | null;
  code: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateSalesExecutivePayload {
  name: string;
  email: string;
  phone: string;
  commisionRate: string;
  rateOn: string;
  amountType: string;
  underStore: string;
  reporting_to: string | null;
}

export interface UpdateSalesExecutivePayload extends Partial<CreateSalesExecutivePayload> {}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const salesExecutiveService = {
  /**
   * Get all sales executives
   * Endpoint: GET /api/salesexecutive/getall/
   */
  getAllSalesExecutives: async (): Promise<ApiResponse<SalesExecutive[]>> => {
    const response = await api.get<ApiResponse<SalesExecutive[]>>(
      "/salesexecutive/getall/"
    );
    console.log(response.data);
    return response.data;
  },

  /**
   * Get sales executive by Code
   * Endpoint: GET /api/salesexecutive/getbycode/:code
   */
  getSalesExecutiveByCode: async (
    code: string
  ): Promise<ApiResponse<SalesExecutive>> => {
    const response = await api.get<ApiResponse<SalesExecutive>>(
      `/salesexecutive/getbycode/${code}`
    );
    return response.data;
  },

  /**
   * Create a new sales executive
   * Endpoint: POST /api/salesexecutive/create/
   */
  createSalesExecutive: async (
    data: CreateSalesExecutivePayload
  ): Promise<ApiResponse<SalesExecutive>> => {
    const response = await api.post<ApiResponse<SalesExecutive>>(
      "/api/salesexecutive/create/",
      data
    );
    return response.data;
  },

  /**
   * Get sales executive by ID
   * Endpoint: GET /api/salesexecutive/getbyid/:id
   */
  getSalesExecutiveById: async (
    id: string
  ): Promise<ApiResponse<SalesExecutive>> => {
    const response = await api.get<ApiResponse<SalesExecutive>>(
      `/api/salesexecutive/getbyid/${id}`
    );
    return response.data;
  },

  /**
   * Update sales executive by ID
   * Endpoint: PUT /api/salesexecutive/update/:id
   */
  updateSalesExecutive: async (
    id: string,
    data: UpdateSalesExecutivePayload
  ): Promise<ApiResponse<SalesExecutive>> => {
    const response = await api.put<ApiResponse<SalesExecutive>>(
      `/api/salesexecutive/update/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete sales executive by ID
   * Endpoint: DELETE /api/salesexecutive/delete/:id
   */
  deleteSalesExecutive: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(
      `/api/salesexecutive/delete/${id}`
    );
    return response.data;
  },
};

export default salesExecutiveService;