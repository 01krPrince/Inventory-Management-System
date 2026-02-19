import api from "../../api";
import { AxiosResponse } from "axios";
import { FormData } from "./AddCustomerPayload";

/* ==========================
   Interfaces
========================== */

export interface Customer {
  _id: string;
  cust_name: string;
  print_name: string;
  gst_no: string;
  identification: string;
  code: string;
  under_ledger: string;
  gst: string;
  registration_date: string;
  cin?: string;
  pan?: string;
  goods_service?: string;
  gst_category?: string;
  [key: string]: any;
}

interface CustomerApiResponse {
  success: boolean;
  message: string;
  data: Customer[];
}

/* ==========================
   GET ALL CUSTOMERS
========================== */

export const getAllCustomers = async (): Promise<Customer[]> => {
  const response: AxiosResponse<CustomerApiResponse> =
    await api.get(""); // /customer/get_all_customer

  return response.data.data;
};

/* ==========================
   ADD CUSTOMER
========================== */

export const addCustomer = async (
  payload: FormData
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post("", payload); // /customer/add-customer

    return response.data;
    
  } catch (error: any) {
    console.error("Add Customer Error:", error);

    return {
      success: false,
      message:
        error?.response?.data?.error ||
        error.message ||
        "Something went wrong",
    };
  }
};

/* ==========================
   DELETE CUSTOMER
========================== */

export const customerDeleteApi = async (
  customerId: string
): Promise<{ success: boolean }> => {
  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  const response = await api.delete(
    `/${customerId}` // /customer/deleteCustomer/${customerId}
  );

  return response.data;
};


// --- Bank Fetch Service ---
export const fetchBankDetailsApi = async (ifscCode: string) => {
  if (!ifscCode) {
    throw new Error("IFSC Code is required");
  }

  const response = await fetch(
    `https://ifsc.razorpay.com/${ifscCode}`
  );

  if (!response.ok) {
    throw new Error("Invalid IFSC Code or API error");
  }

  const data = await response.json();

  return {
    bankName: data.BANK || "",
    branch: data.BRANCH || "",
  };
};


/* ==========================
   UPDATE CUSTOMER
========================== */
export const customerUpdateApi = async (
  customerId: string,
  payload: FormData
) => {
  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  try {
    const response = await api.put(
      `/${customerId}`,  // /customer/updateCustomer/${customerId}
      payload
    );
    
    return {
      success: true,
      data: response.data,
      message: "Customer updated successfully"
    };
  } catch (error: any) {
    console.error("Update Customer Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong during update",
    };
  }
};