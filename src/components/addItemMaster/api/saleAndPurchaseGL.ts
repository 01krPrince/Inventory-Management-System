import api from "../../../services/api";
// ==========================================
// 1. Interfaces
// ==========================================

export interface SalesAndPurchaseGL {
  _id: string;
  name: string;
  identification: string;
  isSubledger: boolean;
  salesGlUnderGroup: string;
  inactive: boolean;
  type: string;
  accountNo: string;
  rtgsIfscCode: string;
  classification: string;
  isLoanAccount: boolean;
  intrestRate: string; // "9.5%"
  calculationOn: string;
  tdsSection: string;
  tdsApplicable: boolean;
  address: string;
  pan: string;
  attributeApplicable: boolean;
  employee: string;
  group: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  __v: number;
}

export type SalesAndPurchaseGLInput = Omit<
  SalesAndPurchaseGL, 
  '_id' | 'createdAt' | 'updatedAt' | 'code' | '__v'
>;

export interface GetSalesGlResponse {
  success: boolean;
  total: number;
  data: SalesAndPurchaseGL[];
}

export interface CreateSalesGlResponse {
  success: boolean;
  message: string;
  data: SalesAndPurchaseGL;
}

// ==========================================
// 2. API Functions
// ==========================================

export const fetchSalesAndPurchaseGL = async (): Promise<SalesAndPurchaseGL[]> => {
  try {
    const response = await api.get<GetSalesGlResponse>('/salespurchasegl/get_salespurchasegl_all');
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching Sales and Purchase GL:", error);
    return [];
  }
};

export const createSalesAndPurchaseGL = async (
  formData: SalesAndPurchaseGLInput
): Promise<CreateSalesGlResponse | null> => {
  try {
    const response = await api.post<CreateSalesGlResponse>(
      '/salespurchasegl/create_salespurchasegl', 
      formData
    );
    
    console.log(response.data.message);
    
    return response.data;
  } catch (error) {
    console.error("Error creating Sales Account:", error);
    return null;
  }
};

export const updateSalesAndPurchaseGL = async (
  id: string,
  payload: any // using 'any' to ensure the strict mapping from component passes through
) => {
  try {
    // Matches your Postman URL: /chartofaccount/updatebyid/:id
    const response = await api.put(`/salespurchasegl/update_salespurchasegl_by_id/${id}`, payload);
    return response.data;
  } catch (error: any) {
    console.error("Error updating GL:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update GL Account",
    };
  }
};

