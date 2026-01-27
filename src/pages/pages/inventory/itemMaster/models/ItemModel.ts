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
  _id?: string;
}

export interface ItemApiData {
  _id: string;
  code: string;
  name: string;
  netRate: string;
  gstRate: string;
  hsn_description: string;
  last_purchase_rate: string;
  stock_unit: { _id: string; code: string; name: string } | null;
  brand: { _id: string; name: string; code: string } | null;
  category: { _id: string; name: string; code: string } | null;
  // Updated: Made optional to prevent build errors if missing from API model
  gst_classification?: string;
  sales_rate: number;
  mrp: number;
  barcode: string;
  warranty: boolean;
  firstyearwarranty: string;
  customWarranty: CustomWarranty[];
  // ... other fields can be optional
  [key: string]: any;
}

export interface ItemResponse {
  success: boolean;
  message?: string; // Optional because it might not exist on success
  total?: number;
  page?: number;
  limit?: number;
  data: ItemApiData[]; // Based on your 'get_all_item' endpoint returning an array
}