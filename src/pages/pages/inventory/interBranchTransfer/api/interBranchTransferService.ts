import api from "../../../../../services/api";

// ==========================================
// 1. Interfaces (Type Definitions)
// ==========================================

// --- Shared Item Interface ---
export interface InterBranchItem {
  _id?: string; // Optional because it won't exist during creation
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
  remark?: string;
  printDesc: string;
  serviceLocation: string;
  itemBarcode: string;
  bdBatchNo: string;
  bdMfgDate: string | null; // Response allows null
  bdExpDate: string | null; // Response allows null
  bdSaleRate: number;
  itemBalance: number;
  barcode?: string; // Optional based on response variance
  lineLevelBarcode?: string; // Optional based on response variance
  hsnCode: string;
  brand: string;
}

// --- Shared Logistics Interface ---
export interface InterBranchLogistics {
  _id?: string; // Optional
  destination: string;
  shippingMode: string;
  shippingCompany: string;
  shippingCompanyAbout?: string;
  shippingTrackingNo: string;
  shippingDate: string;
  shippingCharges: string | number;
  vehicleNo: string;
  chargesType: string;
  documentThrough: string;
  noOfPackets: string | number;
  weight: string;
  distance: string;
  eWayInvoiceNo: string;
  eWayInvoiceDate: string;
  eWayCancelDate?: string | null;
  irnNo: string;
  qrCode: string;
  irnCancelDate?: string | null;
  irnCancelReason?: string;
  acknowledgementNo?: string;
  acknowledgementDate?: string;
}

// --- Payload for CREATING a transfer ---
export interface CreateInterBranchPayload {
  category: string;
  store: string;
  toStore: string;
  transferNo: string;
  transferDate: string;
  postingGl: string;
  remarks: string;
  attachment?: string;
  items: InterBranchItem[];
  logistics: InterBranchLogistics;
}

// --- Data Structure received from GET ALL ---
export interface InterBranchTransferDoc {
  _id: string;
  category: string;
  store: string;
  toStore: string;
  transferNo: string;
  transferDate: string;
  postingGl: string;
  remarks: string;
  items: InterBranchItem[];
  logistics: InterBranchLogistics;
  createdAt: string;
  updatedAt: string;
  code?: string;
  __v: number;
}

// --- API Responses ---
export interface StandardResponse {
  success: boolean;
  message: string;
}

export interface InterBranchListResponse {
  success: boolean;
  data: InterBranchTransferDoc[];
}

// ==========================================
// 2. Service Methods
// ==========================================

export const interBranchService = {
  
  /**
   * Create a new Inter-Branch Transfer
   * Method: POST
   * Endpoint: /interbranch/create/
   */
  createTransfer: async (payload: CreateInterBranchPayload): Promise<StandardResponse> => {
    try {
      const response = await api.post<StandardResponse>("", payload); // /interbranch/create/
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw new Error(error.message || "An unexpected error occurred during creation");
    }
  },

  /**
   * Get All Inter-Branch Transfers
   * Method: GET
   * Endpoint: /interbranch/getall/
   */
  getAllTransfers: async (): Promise<InterBranchListResponse> => {
    try {
      const response = await api.get<InterBranchListResponse>(""); // /interbranch/getall/
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw new Error(error.message || "An unexpected error occurred while fetching data");
    }
  },
};