// services/salesInvoiceService.ts
import api from "../../../../services/api"; // Your axios instance

export const createSalesInvoice = async (payload: any) => {
  try {
    const response = await api.post("/salesinvoice/invoice_create", payload);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, message: "Network Error" };
  }
};