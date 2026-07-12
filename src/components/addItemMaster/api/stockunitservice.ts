import api from "../../../services/api";
import { StockUnitData, ListResponse } from "./types";

// --- Types ---

export interface CreateStockUnitPayload {
  code?: string;
  name: string;
  desc: string;
  roundoff_decimal: string | number;
  uqc: string;
}

// --- API Calls ---

export const fetchStockUnits = async (): Promise<StockUnitData[]> => {
  try {
    const response = await api.get<ListResponse<StockUnitData>>(
      "/stockunit/get_stock_unit"
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching units:", error);
    return [];
  }
};

export const createStockUnit = async (payload: CreateStockUnitPayload) => {
  const response = await api.post("/stockunit/create_stock_unit", payload);
  return response.data;
};

// UPDATED: ID is passed in the URL
export const updateStockUnit = async (id: string, payload: CreateStockUnitPayload) => {
  const response = await api.put(`/stockunit/update_stock_unit/${id}`, payload);
  return response.data;
};

export const deleteStockUnit = async (id: string) => {
  try {
    const response = await api.delete(`/stockunit/delete_stock_unit/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting stock unit:", error);
    throw error; // so UI can catch and show toast
  }
};
