import { ItemResponse } from "../models/ItemModel";
import api from "../../../services/api";

const BASE_URL = "/item_master";

export const createItem = async (payload: any): Promise<ItemResponse> => {
  const response = await api.post(`${BASE_URL}`, payload); // ${BASE_URL}/create_item
  return response.data;
};

export const updateItem = async (
  id: string,
  payload: any
): Promise<ItemResponse> => {
  const response = await api.put(`${BASE_URL}/${id}`, payload); //${BASE_URL}/update_item/${id}
  return response.data;
};
