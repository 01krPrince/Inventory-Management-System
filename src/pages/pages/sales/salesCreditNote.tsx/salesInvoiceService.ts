// services/salesInvoiceService.ts
import api from "../../../../services/api"; 

export interface SalesInvoiceItem {
  _id: string;
  item: string;
  itemCode: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  unit?: string;
}

export interface SalesInvoiceData {
  _id: string;
  invoiceNo: string;
  date: string;
  store: string;
  customer: string;
  grandTotal: number;
  items: SalesInvoiceItem[];
}

interface SalesInvoiceResponse {
  success: boolean;
  count: number;
  data: SalesInvoiceData[];
}

// --- Named Exports (Fixes the SyntaxError) ---

export const createSalesInvoice = async (payload: any) => {
  try {
    const response = await api.post("/salesinvoice/invoice_create", payload);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, message: "Network Error" };
  }
};

export const getAllSalesInvoices = async (): Promise<SalesInvoiceResponse> => {
  try {
    const response = await api.get("/salesinvoice/get_invoice_all");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching sales invoices:", error);
    return { success: false, count: 0, data: [] };
  }
};