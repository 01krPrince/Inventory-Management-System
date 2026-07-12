// --- 1. UI TYPES (Used for Local Form State) ---
export interface SuggestedItem {
  id: number;     // Local unique identifier for UI list keys
  itemId: string; // The database _id
}

export interface ItemFormData {
  itemMode: string;
  itemName: string;
  itemCode: string;
  underGroup: string;
  stockUnit: string;
  gstClassification: string;
  profileImage: string | null;
  category: string;
  brand: string;
  type: string;
  unitOption: string;
  barCode: string;
  autoBarcodePrefix: string;
  gstInputNotApplicable: boolean;
  printBarcode: boolean;
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
  purchaseDescription: string;
  purchaseGL: string;
  purchaseRate: string;
  purchaseRateFactor: string;
  purchaseDiscount1: string;
  purchaseDiscount2: string;
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
  askUdfInDocument: boolean;
  suggestedItems: SuggestedItem[]; // Maps to suggested_cat in API
}

// --- 2. API TYPES (Matching JSON response) ---

export interface NestedObject {
  _id: string;
  name?: string;      // Used by Category/Stock Unit/Brand
  item_name?: string; // Used by under_group
  code?: string;
  uqc?: string;       // Used by stock_unit
}

export interface CustomWarranty {
  duration: string;
  price: string | number;
  _id?: string;
}

export interface SuggestedCatEntry {
  itemId: string;
  _id?: string; // MongoDB auto-generated ID for the array entry
}

export interface ItemApiData {
  _id: string;
  item_mode: "Product" | "Service" | string | null;
  name: string;
  code: string;
  
  // Relations: In GET they are objects, in POST/PUT they are usually strings (IDs)
  under_group: NestedObject | string | null;
  stock_unit: NestedObject | string | null;
  category: NestedObject | string | null;
  brand: NestedObject | string | null;
  
  gst_classfication: string | null;
  type: string | null;
  unit_option: string;
  barcode: string | null;
  auto_barcode: string | null;
  gst_applicable: boolean;
  print_barcode: boolean;
  
  // Sales
  sale_desc: string | null;
  sales_gl?: string | null;
  mrp: number;
  minimum_price: number;
  sales_rate: number;
  wholesale_rate: number;
  dealer_factor?: string | null; 
  rate_factor?: string | null;
  sale_discount?: string | null;
  sale_discount_percent?: string | null;
  
  // Purchase
  purch_desc: string | null;
  purchase_gl?: string | null;
  purchase_rate: number;
  purchase_ratefactor?: string | null;
  purchase_discount?: string | null;
  purchase_discount_percent?: string | null;
  
  // Inventory/Attributes
  item_workflow: string | null;
  procurement_type: string | null;
  minimum_level: number;
  maximum_level: number;
  track_inventory: boolean;
  weighscale_mapping_code?: string | null;
  rackbin_no: string | null;
  add_in_item_set_template?: string | null;
  batch_wise_inventory: boolean;
  batch_wise_rate: boolean;
  
  // Warranty
  warranty: boolean;
  firstyearwarranty: string;
  secyearwarranty: string;
  thirdyearwarranty: string;
  customWarranty: CustomWarranty[];
  
  // Meta/Misc
  drug_type: string | null;
  salt: string | null;
  skip_item_from_loyalty?: string | boolean | null; 
  exclude_cvss_applist: boolean;
  ask_udf_in_document: string | boolean | null; 
  attachment: string | null;
  
  // The list of suggested items
  suggested_cat: SuggestedCatEntry[];
  
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ItemResponse {
  success: boolean;
  message?: string; // Optional because it might not exist on success
  total?: number;
  page?: number;
  limit?: number;
  data: ItemApiData[]; // Based on your 'get_all_item' endpoint returning an array
}