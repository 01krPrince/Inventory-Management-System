import api from "../../../../../services/api";

/* ==========================
   Vendor Model / Interface
========================== */

export interface VendorContact {
  name: string;
  email: string;
  phone: string;
  designation: string;
  _id?: string;
}

export interface VendorPayload {
  // Basic & Mandatory
  vend_name: string;
  print_name?: string;
  gst_no?: string;
  identification?: string;
  
  under_ledger: string; 
  
  Vendor_comman?: boolean;
  is_sub_customer?: boolean;
  under_customer?: string | boolean;

  // Statutory (Made Optional)
  gst?: string; 
  registration_date?: string;
  cin?: string;
  pan?: string;
  goods_service?: string;
  gst_category?: string;
  gst_suspend?: boolean;
  distance?: number;
  tds_on_gst_applicable?: boolean;

  // Communication (Made Optional)
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pin_code?: string;
  phone?: string;
  email?: string;

  // Social (Made Optional)
  website?: string;
  facebook?: string;

  // Defaults (Made Optional)
  payment_term?: string;
  price_category?: string;
  batch_rate_category?: string; 
  sales_executive?: string;
  transporter?: string;
  credit_limit?: string;
  max_credit_days?: string;
  interest_rate_yearly?: string;
  customer_on_watch?: string; 
  firm_status?: string;
  territory?: string;
  customer_category?: string;

  contact_person?: string;

  // Bank (Made Optional)
  ifsc_code?: string;
  account_number?: string;
  bank_name?: string;
  branch?: string;

  contact?: VendorContact[];
  
  profile_photo?: string | null;
}

/* ==========================
   API Services
========================== */

export const getAllVendors = async (): Promise<any[]> => {
  const response = await api.get("/vendor/getallvendor");
  return response.data.data;
};

export const addVendor = async (payload: VendorPayload) => {
  console.group("🔵 [API] addVendor Request");
  console.log("Payload:", JSON.stringify(payload, null, 2));
  console.groupEnd();

  try {
    const response = await api.post("/vendor/createvendor", payload);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [API Error]", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Internal Server Error (500)",
    };
  }
};

export const updateVendor = async (id: string, payload: VendorPayload) => {
  try {
    const response = await api.put(`/vendor/update/${id}`, payload);
    return { success: true, data: response.data, message: "Vendor updated" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Update failed",
    };
  }
};

export const deleteVendor = async (id: string) => {
  const response = await api.delete(`/vendor/delete/${id}`);
  return response.data;
};

export const getVendorByCode = async (code: string) => {
  const response = await api.get(`/vendor/code/${code}`);
  return response.data;
};

export const fetchBankDetailsApi = async (ifscCode: string) => {
  try {
    const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);
    if (!response.ok) throw new Error("Invalid IFSC");
    const data = await response.json();
    return { bankName: data.BANK || "", branch: data.BRANCH || "" };
  } catch (err) {
    throw err;
  }
};