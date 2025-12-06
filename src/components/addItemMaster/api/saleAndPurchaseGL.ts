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

// The Input interface (Request Body for Creation)
// This creates a type with all fields from SalesAndPurchaseGL 
// EXCEPT the system generated ones (_id, createdAt, etc.)
export type SalesAndPurchaseGLInput = Omit<
  SalesAndPurchaseGL, 
  '_id' | 'createdAt' | 'updatedAt' | 'code' | '__v'
>;

// API Response Wrappers
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

// --- GET: Fetch All Entries ---
export const fetchSalesAndPurchaseGL = async (): Promise<SalesAndPurchaseGL[]> => {
  try {
    const response = await api.get<GetSalesGlResponse>('/salespurchasegl/get_salespurchasegl_all');
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching Sales and Purchase GL:", error);
    return [];
  }
};

// --- POST: Create New Entry ---
export const createSalesAndPurchaseGL = async (
  formData: SalesAndPurchaseGLInput
): Promise<CreateSalesGlResponse | null> => {
  try {
    const response = await api.post<CreateSalesGlResponse>(
      '/salespurchasegl/create_salespurchasegl', 
      formData
    );
    
    // You might want to log the success message here
    console.log(response.data.message);
    
    return response.data;
  } catch (error) {
    console.error("Error creating Sales Account:", error);
    return null;
  }
};