// src/models/ItemModel.ts

// --- 1. UI TYPES (Used by React Component State) ---
export interface SuggestedItem {
  id: number;
  itemId: string;
}

export interface CustomWarranty {
  duration: string;
  price: string;
  _id?: string;
}

export interface ItemFormData {
  // Basic Details
  itemMode: string;
  item_name: string;
  underGroup: string;       // Stores the _ID string
  stockUnit: string;        // Stores the _ID string
  gstClassification: string;
  profileImage: string | null;

  // Warranty
  warrantyEnabled: boolean;
  warranty1YearPrice: string;
  warranty2YearPrice: string;
  warranty3YearPrice: string;
  customWarranties: CustomWarranty[];

  // Advance Info
  category: string;         // Stores the _ID string
  brand: string;            // Stores the _ID string
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

  // Suggested Items
  suggestedItems: SuggestedItem[];
}

// --- 2. API TYPES (Used by Service/Server response) ---
// These interfaces define what the Objects inside the response look like
export interface IdNameObject {
  _id: string;
  name?: string;
  item_name?: string;
  code?: string;
}

export interface ItemApiData {
  _id?: string;
  id?: string;
  
  // Basic
  item_mode: string | null;
  name: string | null; 
  
  // Relational fields are Objects in the GET response
  under_group: IdNameObject | null;
  stock_unit: IdNameObject | null;
  gst_classfication: string | null; // Note: Typo 'classfication' matches server

  // Warranty
  warranty?: boolean;
  firstyearwarranty?: string | null;
  secyearwarranty?: string | null;
  thirdyearwarranty?: string | null;
  customWarranty?: CustomWarranty[];

  // Advance
  category: IdNameObject["_id"] | null;
  brand: IdNameObject | null;
  
  type: string | null;
  unit_option: string | null;
  barcode: string | null;
  auto_barcode: string | null;
  gst_applicable: boolean;
  print_barcode: boolean;

  // Sales
  sale_desc: string | null;
  sales_gl: string | null;
  mrp: string | number | null;
  minimum_price: string | number | null;
  sales_rate: string | number | null;
  wholesale_rate: string | number | null;
  dealer_factor: string | number | null;
  rate_factor: string | number | null;
  sale_discount: string | number | null;
  sale_discount_percent: string | number | null;

  // Purchase
  purch_desc: string | null;
  purchase_gl: string | null;
  purchase_rate: string | number | null;
  purchase_ratefactor: string | number | null;
  purchase_discount: string | number | null;
  purchase_discount_percent: string | number | null;

  // Attributes
  item_workflow: string | null;
  procurement_type: string | null;
  minimum_level: string | number | null;
  maximum_level: string | number | null;
  weighscale_mapping_code: string | null;
  rackbin_no: string | null;
  add_in_item_set_template: string | null;
  
  track_inventory?: boolean;
  batch_wise_inventory: boolean;
  batch_wise_rate: boolean;
  
  drug_type: string | null;
  salt: string | null;
  skip_item_from_loyalty: string | null;
  exclude_cvss_applist: boolean;
  ask_udf_in_document: string | null;
  
  attachment: string | null;

  suggested_cat?: { itemId: string; _id?: string }[]; 

  code?: string | null;
  __v?: number;
}

export interface ItemResponse {
  success: boolean;
  message: string;
  data?: ItemApiData;
}