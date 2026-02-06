import api from "./api";

export interface PriceCategory {
  _id: string;
  code: string;
  name: string;
  __v: number;
}

export interface PriceCategoryResponse {
  success: boolean;
  data: PriceCategory[];
}

class PriceCategoryService {
  static async getAllPriceCategories(): Promise<PriceCategoryResponse> {
    const response = await api.get<PriceCategoryResponse>(
      "/price_category/all_price_category"
    );
    return response.data;
  }
}

export default PriceCategoryService;
