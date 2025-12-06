// src/services/api/itemService.ts
import { ItemFormData, ItemApiData, ItemResponse } from "../models/ItemModel";
import api from "../../../services/api"; 

const BASE_URL = "https://sports-hub-h2um.onrender.com/api/item_master";

const toNull = (value: any): any => {
  if (value === "" || value === undefined || value === "Select...") return null;
  return value;
};

const transformFormDataToPayload = (formData: ItemFormData): ItemApiData => {
  return {
    item_mode: toNull(formData.itemMode),
    name: toNull(formData.itemName),
    under_group: toNull(formData.underGroup),
    stock_unit: toNull(formData.stockUnit),
    gst_classfication: toNull(formData.gstClassification),
    
    category: toNull(formData.category),
    brand: toNull(formData.brand),
    type: toNull(formData.type),
    unit_option: toNull(formData.unitOption),
    barcode: toNull(formData.barCode),
    auto_barcode: toNull(formData.autoBarcodePrefix),
    
    gst_applicable: !formData.gstInputNotApplicable, 
    print_barcode: !!formData.printBarcode,

    sale_desc: toNull(formData.salesDescription),
    sales_gl: toNull(formData.salesGL),
    mrp: toNull(formData.mrp),
    minimum_price: toNull(formData.minPrice),
    sales_rate: toNull(formData.salesRate),
    wholesale_rate: toNull(formData.wholesaleRate),
    dealer_factor: toNull(formData.dealerRate),
    rate_factor: toNull(formData.rateFactor),
    sale_discount: toNull(formData.salesDiscount),
    sale_discount_percent: toNull(formData.salesDiscountPercent),

    purch_desc: toNull(formData.purchaseDescription),
    purchase_gl: toNull(formData.purchaseGL),
    purchase_rate: toNull(formData.purchaseRate),
    purchase_ratefactor: toNull(formData.purchaseRateFactor),
    purchase_discount: toNull(formData.purchaseDiscount1),
    purchase_discount_percent: toNull(formData.purchaseDiscount2),

    item_workflow: toNull(formData.itemWorkflow),
    procurement_type: toNull(formData.procurementType),
    minimum_level: toNull(formData.minLevel),
    maximum_level: toNull(formData.maxLevel),
    weighscale_mapping_code: toNull(formData.weighscaleMappingCode),
    rackbin_no: toNull(formData.rackBinNo),
    add_in_item_set_template: toNull(formData.itemSetTemplate),
    
    batch_wise_inventory: !!formData.batchWiseInventory,
    batch_wise_rate: !!formData.batchWiseRate,
    drug_type: toNull(formData.drugType),
    salt: toNull(formData.salt),
    
    skip_item_from_loyalty: formData.skipLoyaltyPoints ? "Yes" : "No",
    exclude_cvss_applist: !!formData.excludeInCvss,
    ask_udf_in_document: formData.askUdfInDocument ? "Y" : "N",
    
    attachment: toNull(formData.profileImage),
  };
};

export const createItem = async (formData: ItemFormData): Promise<ItemResponse> => {
  const payload = transformFormDataToPayload(formData);
  try {
    const response = await fetch(`${BASE_URL}/create_item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Create Error:", error);
    throw error;
  }
};

export const updateItem = async (id: string, formData: ItemFormData): Promise<ItemResponse> => {
  const payload = transformFormDataToPayload(formData);
  try {
    const response = await api.put<ItemResponse>(`/item_master/update_item/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Update Error:", error);
    throw error;
  }
};

export interface CategoryData {
  _id: string;
  name: string;
  code: string;
  image?: string | null;
}

export interface BrandData {
  _id: string;
  name: string;
  code: string;
  salesman?: string;
}

export interface StockUnitData {
  _id: string;
  code: string;
  name: string;
  desc: string;
  roundoff_decimal: string;
  uqc: string;
}

export interface GstClassificationData {
  _id: string;
  type: string;           // "Goods"
  hsn_sac_code: string;   // "1001"
  hsn_description: string;// "Agricultural product"
  code: string;
}

export interface ListResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
}

export const fetchCategories = async (): Promise<CategoryData[]> => {
  try {
    const response = await api.get<ListResponse<CategoryData>>('/itemcategory/get_all_item_category');
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchBrands = async (): Promise<BrandData[]> => {
  try {
    const response = await api.get<ListResponse<BrandData>>('/itembrand/get_item_brand');
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

export interface CreateBrandPayload {
  name: string;
  salesman?: string;
  image?: string | null;
}

export const createItemBrand = async (payload: CreateBrandPayload): Promise<ItemResponse> => {
  try {
    const response = await api.post<ItemResponse>('/itembrand/create_item_brand', payload);
    return response.data;
  } catch (error) {
    console.error("Failed to create item brand:", error);
    throw error;
  }
};

export const fetchStockUnits = async (): Promise<StockUnitData[]> => {
  try {
    const response = await api.get<ListResponse<StockUnitData>>('/stockunit/get_stock_unit');
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching stock units:", error);
    return [];
  }
};

export const fetchGstClassifications = async (): Promise<GstClassificationData[]> => {
  try {
    const response = await api.get<ListResponse<GstClassificationData>>('/gstclassification/get_gst_classification');
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching GST classifications:", error);
    return [];
  }
};


export interface CreateCategoryPayload {
  name: string;
  image: string | null;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const createItemCategory = async (payload: CreateCategoryPayload): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(`/itemcategory/create_item_category`, payload);
    return response.data;
  } catch (error) {
    console.error("Failed to create item category:", error);
    throw error;
  }
};