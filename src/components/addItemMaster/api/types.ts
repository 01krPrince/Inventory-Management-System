export interface ListResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
}

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
  type: string;
  code: string;
  hsn_sac_code: string;
  hsn_description: string;
  gstRate?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
}

export interface UnderGroupData {
  _id?: string;
  
  // Naming variations based on your code logic
  item_mode?: string;
  UnderGroupMode?: string; 
  
  item_name?: string;
  name?: string;
  
  under_group?: string;
  code?: string;
  description?: string;
  
  type?: string;
  unit_option?: string;
  stock_unit?: string;
  gst_classification?: string;
  sales_gl?: string;
  purchase_gl?: string;
  
  minimum_level?: number;
  rate_factor?: number;
  item_type?: string;
  drug_type?: string;
  purchase_rate_factor?: number;
  
  // Boolean flags
  batch_wise_inventory?: boolean;
  batch_wise_rate?: boolean;
  exclude_cvss?: boolean;
  exclude_cvss_applist?: boolean;
  
  image?: string | null;
}
