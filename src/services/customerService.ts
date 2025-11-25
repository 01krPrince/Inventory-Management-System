import api from "./api";
import { AxiosResponse } from "axios";

// 1. **FIX THE CUSTOMER INTERFACE** to match the actual fields
export interface Customer {
  _id: string;
  cust_name: string; // Use the actual field name from API
  print_name: string;
  gst_no: string;
  identification: string;
  code: string;
  under_ledger: string;
  gst: string;
  registration_date: string;
  // Include all other potential fields
  cin?: string;
  pan?: string;
  goods_service?: string;
  gst_category?: string;
  [key: string]: any;
}

// Define the shape of the full response body
interface CustomerApiResponse {
  success: boolean;
  message: string;
  data: Customer[]; // This contains the array we want
}

// GET all customers
// 2. **FIX THE RETURN LOGIC**
export const getAllCustomers = async (): Promise<Customer[]> => {
  // Tell Axios what the full response body looks like
  const response: AxiosResponse<CustomerApiResponse> = await api.get<CustomerApiResponse>("/customer/get_all_customer");

  // Log the *full* response data object
  console.log("Full API Response:", response.data); 

  // **RETURN ONLY THE 'data' ARRAY CONTAINING CUSTOMERS**
  return response.data.data;
};