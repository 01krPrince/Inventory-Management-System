import api from "../api";

/**
 * Unified Model for POS Customer Master
 * Handles both API Request (Create) and Response (Get All)
 */
export interface PosCustomer {
  // System / Response Fields
  _id?: string;
  createdAt?: string;
  code?: string;
  isactive?: boolean;

  // Identity & Naming
  name?: string;       // Used in UI/Forms
  cust_name: string;   // Primary Backend field
  print_name: string;  // Primary Backend field for display
  firm_status?: string;
  
  // Contact & Demographics
  phone: string;
  email: string;
  gender?: "Male" | "Female" | "Other";
  dob?: string;        // ISO format: YYYY-MM-DD
  status?: "Active" | "Inactive" | string; // Supporting both string types
  
  // Loyalty Data
  loyaltyCard?: string;
  loyaltyCardOpeningPoint?: string | number;
  cardNo?: string;
  
  // Relationships & Tax
  anniversary?: string;
  spouseName?: string;
  gstNo?: string;      // Standard GST
  gst_category?: string; // Get All response category
  gstNoIfB?: string;   // B2B specific field
  
  // Location & Address
  address: string;
  country?: string;
  state: string;
  city: string;
  pin?: string;        // Response field
  pinCode?: string;    // Request field
  territory?: string;
  longitude?: string;
  latitiude?: string;  // Consistent with backend spelling
}

export interface CustomerResponse {
  success: boolean;
  total: number;
  data: PosCustomer[];
}

// --- Services ---

/**
 * Service to manage POS Customer API calls
 */
export class PosCustomerService {
  /**
   * Fetch all customers
   */
  static async getAllCustomers(): Promise<CustomerResponse> {
    const response = await api.get<CustomerResponse>(
      "/poscustomermaster/getall"
    );
    return response.data;
  }

  /**
   * Create a new POS Customer
   */
  static async createPosCustomer(customerData: PosCustomer) {
    try {
      const response = await api.post("/poscustomermaster/create", customerData);
      return response.data;
    } catch (error) {
      console.error("Error creating POS customer:", error);
      throw error;
    }
  }
}

export default PosCustomerService;