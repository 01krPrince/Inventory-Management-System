import api from "../../../services/api";
import { CategoryData, ListResponse } from "./types";

// --- EXISTING INTERFACES ---
export interface CreateCategoryPayload {
  name: string;
  image: string | null;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// --- FETCH ALL ---
export const fetchCategories = async (): Promise<CategoryData[]> => {
  try {
    const response = await api.get<ListResponse<CategoryData>>(
      "" // /itemcategory/get_all_item_category
    );
    return response.data.data || [];
  } catch {
    return [];
  }
};

// --- CREATE ---
export const createItemCategory = async (
  payload: CreateCategoryPayload
): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>(
    "", // /itemcategory/add_item_category
    payload
  );
  return response.data;
};

// --- UPDATE ---
export const updateItemCategory = async (
  id: string,
  payload: CreateCategoryPayload
): Promise<ApiResponse> => {
  const response = await api.put<ApiResponse>(
    `${id}`, // /itemcategory/update_item_category/${id}
    payload
  );
  return response.data;
};

// --- DELETE ---
export const deleteItemCategory = async (id: string): Promise<ApiResponse> => {
  const response = await api.delete<ApiResponse>(
    `${id}` // /itemcategory/delete_item_category/${id}
  );
  return response.data;
};

// --- GET BY CODE ---
export const getItemCategoryByCode = async (
  code: string
): Promise<CategoryData | null> => {
  try {
    const response = await api.get<ApiResponse>(
      `${code}` // /itemcategory/get_item_category_by_code/${code}
    );
    // Assuming the API wraps the single object in the 'data' field of ApiResponse
    return response.data.data || null;
  } catch {
    return null;
  }
};

// --- GET BY ID ---
export const getItemCategoryById = async (
  id: string
): Promise<CategoryData | null> => {
  try {
    const response = await api.get<ApiResponse>(
      `${id}` // /itemcategory/get_item_category_by_id/${id}
    );
    return response.data.data || null;
  } catch {
    return null;
  }
};