import api from "../../../services/api";
import { GstClassificationData, ListResponse } from "./types";

export interface CreateGstClassificationPayload {
  type: string;
  code?: string;
  hsn_sac_code: string;
  hsn_description: string;
  gstRate?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// FETCH ALL
export const fetchGstClassifications = async (): Promise<GstClassificationData[]> => {
  try {
    const response = await api.get<ListResponse<GstClassificationData>>(
      "/gstclassification/get_gst_classification"
    );
    return response.data.data || [];
  } catch { return []; }
};

// CREATE
export const createGstClassification = async (payload: CreateGstClassificationPayload): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>("/gstclassification/create_gst_classification", payload);
  return response.data;
};

// UPDATE (Crucial for Edit mode)
export const updateGstClassification = async (
  id: string, 
  payload: CreateGstClassificationPayload
): Promise<ApiResponse> => {
  // Ensure the URL matches your backend endpoint
  const response = await api.put<ApiResponse>(
    `/gstclassification/update_gst_classification_by_id/${id}`,
    payload
  );
  return response.data;
};

// DELETE
export const deleteGstClassification = async (id: string | number): Promise<ApiResponse> => {
  const response = await api.delete<ApiResponse>(`/gstclassification/delete_gst_classification/${id}`);
  return response.data;
};