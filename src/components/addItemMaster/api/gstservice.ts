import api from "../../../services/api";
import { GstClassificationData, ListResponse } from "./types";

// --- FETCH ALL ---
export const fetchGstClassifications = async (): Promise<GstClassificationData[]> => {
  try {
    const response = await api.get<ListResponse<GstClassificationData>>(
      "/gstclassification/get_gst_classification"
    );
    return response.data.data || [];
  } catch {
    return [];
  }
};

// --- INTERFACES ---
export interface CreateGstClassificationPayload {
  type: string;
  code: string;
  hsn_sac_code: string;
  hsn_description: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// --- CREATE ---
export const createGstClassification = async (
  payload: CreateGstClassificationPayload
): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>(
    "/gstclassification/create_gst_classification",
    payload
  );
  return response.data;
};

// --- UPDATE ---
export const updateGstClassification = async (
  id: string,
  payload: CreateGstClassificationPayload
): Promise<ApiResponse> => {
  const response = await api.put<ApiResponse>(
    `/gstclassification/update_gst_classification_by_id/${id}`,
    payload
  );
  return response.data;
};

// --- DELETE ---
export const deleteGstClassification = async (
  id: string
): Promise<ApiResponse> => {
  const response = await api.delete<ApiResponse>(
    `/gstclassification/delete_gst_classification/${id}`
  );
  return response.data;
};

// --- GET BY ID ---
export const getGstClassificationById = async (
  id: string
): Promise<GstClassificationData | null> => {
  try {
    const response = await api.get<ApiResponse>(
      `/gstclassification/get_gst_classification_by_id/${id}`
    );
    return response.data.data || null;
  } catch {
    return null;
  }
};

// --- GET BY CODE ---
export const getGstClassificationByCode = async (
  code: string
): Promise<GstClassificationData | null> => {
  try {
    const response = await api.get<ApiResponse>(
      `/gstclassification/get_by_code/${code}`
    );
    return response.data.data || null;
  } catch {
    return null;
  }
};