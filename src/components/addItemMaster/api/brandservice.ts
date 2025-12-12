import api from "../../../services/api";
import { BrandData, ListResponse } from "./types";

// --- INTERFACES ---
export interface CreateBrandPayload {
  name: string;
  salesman?: string;
  image?: string | null;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// --- FETCH ALL ---
export const fetchBrands = async (): Promise<BrandData[]> => {
  try {
    const response = await api.get<ListResponse<BrandData>>(
      "/itembrand/get_item_brand"
    );
    return response.data.data || [];
  } catch {
    return [];
  }
};

// --- CREATE ---
export const createItemBrand = async (
  payload: CreateBrandPayload
): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>(
    "/itembrand/create_item_brand",
    payload
  );
  return response.data;
};

// --- UPDATE ---
export const updateItemBrand = async (
  id: string,
  payload: CreateBrandPayload
): Promise<ApiResponse> => {
  const response = await api.put<ApiResponse>(
    `/itembrand/update_item_brand_by_id/${id}`,
    payload
  );
  return response.data;
};

// --- DELETE ---
export const deleteItemBrand = async (id: string): Promise<ApiResponse> => {
  const response = await api.delete<ApiResponse>(
    `/itembrand/delete_item_brand_by_id/${id}`
  );
  return response.data;
};

// --- GET BY ID ---
export const getItemBrandById = async (
  id: string
): Promise<BrandData | null> => {
  try {
    const response = await api.get<ApiResponse>(
      `/itembrand/get_item_brand_by_id/${id}`
    );
    return response.data.data || null;
  } catch {
    return null;
  }
};

// --- GET BY CODE ---
export const getItemBrandByCode = async (
  code: string
): Promise<BrandData | null> => {
  try {
    const response = await api.get<ApiResponse>(
      `/itembrand/get_item_brand_by_code/${code}`
    );
    return response.data.data || null;
  } catch {
    return null;
  }
};