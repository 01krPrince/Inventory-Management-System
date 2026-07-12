// src/services/analysis/profitService.ts
import api from "../../services/api"; 

export interface ProfitItemRequest {
  item: string;        // Item ID
  quantity: number;
  sellingPrice: number; // Unit Rate
}

export interface ProfitAnalysisPayload {
  store: string;       // Store ID
  items: ProfitItemRequest[];
  totalExpenses: number;
}

export const fetchProfitAnalysis = async (payload: ProfitAnalysisPayload) => {
  try {
    const response = await api.post("/salesinvoice/profit-preview", payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Analysis Failed" };
  }
};