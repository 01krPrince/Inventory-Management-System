import { ItemResponse } from "../models/ItemModel";
import api from "../../../services/api";

const BASE_URL = "/item_master";

export const createItem = async (payload: any): Promise<ItemResponse> => {
  const response = await api.post(`${BASE_URL}/create_item`, payload);
  return response.data;
};

export const updateItem = async (
  id: string,
  payload: any
): Promise<ItemResponse> => {
  const response = await api.put(`${BASE_URL}/update_item/${id}`, payload);
  return response.data;
};