import api from "../../../../../services/api";
import { ItemResponse, ItemApiData } from "../models/ItemModel";

const ENDPOINT = "/item_master";

export const fetchItems = async (): Promise<ItemApiData[]> => {
  try {
    const response = await api.get<ItemResponse>(`${ENDPOINT}/get_all_item`); 
    const result = response.data;
    
    if (result.success && result.data) {
      return result.data as ItemApiData[]; 
    } else {
      console.error("API returned success: false", result.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const deleteItemApi = async (id: string): Promise<ItemResponse> => {
  try {
    const response = await api.delete<ItemResponse>(`${ENDPOINT}/delete_item/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};