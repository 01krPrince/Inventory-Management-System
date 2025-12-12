// src/models/ItemModel.ts

// --- 1. UI TYPES (Used by React Component) ---
export interface SuggestedItem {
  id: number;
  itemId: string;
}

export interface ItemFormData {
  // Basic Details
  itemMode: string;
  item_name: string;
  underGroup: string;
  stockUnit: string;
  gstClassification: string;
  profileImage: string | null;

  // Advance Info
  category: string;
  brand: string;
  type: string;
  unitOption: string;
  barCode: string;
  autoBarcodePrefix: string;
  gstInputNotApplicable: boolean;
  printBarcode: boolean;

  // Sales Config
  salesDescription: string;
  salesGL: string;
  mrp: string;
  minPrice: string;
  salesRate: string;
  wholesaleRate: string;
  dealerRate: string;
  rateFactor: string;
  salesDiscount: string;
  salesDiscountPercent: string;

  // Purchase Config
  purchaseDescription: string;
  purchaseGL: string;
  purchaseRate: string;
  purchaseRateFactor: string;
  purchaseDiscount1: string;
  purchaseDiscount2: string;

  // Attributes Config
  itemWorkflow: string;
  procurementType: string;
  minLevel: string;
  maxLevel: string;
  weighscaleMappingCode: string;
  rackBinNo: string;
  itemSetTemplate: string;
  batchWiseInventory: boolean;
  batchWiseRate: boolean;
  drugType: string;
  salt: string;
  skipLoyaltyPoints: boolean;
  excludeInCvss: boolean;

  // UDF
  askUdfInDocument: boolean;

  // Suggested Items
  suggestedItems: SuggestedItem[];
}

// --- 2. API TYPES (Used by Service/Server) ---
export interface ItemApiData {
  _id?: string;
  item_mode: string | null;
  item_name: string | null;
  under_group: string | null;
  stock_unit: string | null;
  gst_classfication: string | null;
  category: string | null;
  brand: string | null;
  type: string | null;
  unit_option: string | null;
  barcode: string | null;
  auto_barcode: string | null;
  gst_applicable: boolean;
  print_barcode: boolean;
  sale_desc: string | null;
  sales_gl: string | null;
  mrp: string | null;
  minimum_price: string | null;
  sales_rate: string | null;
  wholesale_rate: string | null;
  dealer_factor: string | null;
  rate_factor: string | null;
  sale_discount: string | null;
  sale_discount_percent: string | null;
  purch_desc: string | null;
  purchase_gl: string | null;
  purchase_rate: string | null;
  purchase_ratefactor: string | null;
  purchase_discount: string | null;
  purchase_discount_percent: string | null;
  item_workflow: string | null;
  procurement_type: string | null;
  minimum_level: string | null;
  maximum_level: string | null;
  weighscale_mapping_code: string | null;
  rackbin_no: string | null;
  add_in_item_set_template: string | null;
  batch_wise_inventory: boolean;
  batch_wise_rate: boolean;
  drug_type: string | null;
  salt: string | null;
  skip_item_from_loyalty: string | null;
  exclude_cvss_applist: boolean;
  ask_udf_in_document: string | null;
  attachment: string | null;
  code?: string | null;
  __v?: number;
}

export interface ItemResponse {
  success: boolean;
  message: string;
  data?: ItemApiData;
}