import api from "../api";

// --- Create Payload Interfaces ---

export interface PurchaseBillItem {
  itemcode: string;
  quantity: number;
  rate: number;
}

export interface PurchaseBillPayload {
  billDate: string;
  store: string;
  vendor: string;
  remarks: string;
  items: PurchaseBillItem[];
  netAmount: string;
  billDiscount: string;
  logistics: {
    freight: number;
    loadingUnloading: number;
    insurance: number;
    otherCharges: number;
  };
  
  // --- Extra fields (Commented out until backend is ready) ---
  /*
  gstType?: string;
  priceCategory?: string;
  tax?: string;
  placeOfSupply?: string;
  shipTo?: string;
  paymentTerms?: string;
  email?: string;
  orderNo?: string;
  refNo?: string;
  refDate?: string;
  dueDate?: string;
  billToText?: string;
  shipToText?: string;
  gstNo?: string;
  contactPerson?: string;
  */
}

// --- Get All Purchase Bills Interfaces (Matches your JSON response) ---

export interface PurchaseBillDetailItem {
  itemcode: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  itemBalance: number;
  hsn_code: string;
  unit: string;
  tax_code: string;
  pack_qty: number;
  taxable_amount: number;
  tax_rate: number;
  tax_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  cess_amount: number;
  pack_unit_name: string;
  round_off: number;
}

export interface PurchaseBillData {
  _id: string;
  billNo: string;
  billDate: string;
  store: string;
  vendor: string;
  items: PurchaseBillDetailItem[];
}

export interface GetAllPurchaseBillsResponse {
  success: boolean;
  total: number;
  data: PurchaseBillData[];
}

// --- Report Interfaces ---

export interface PurchaseBillReportSummary {
  totalQty: number;
  totalPurchaseAmount: number;
  totalLogistics: number;
  netAmount: number;
}

export interface PurchaseBillReportItem {
  billId: string;
  billNo: string;
  billDate: string;
  storeId: string;
  storeName: string;
  storeCode: string;
  vendorId: string;
  vendorName: string;
  vendorCode: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  rate: number;
  amount: number;
  freight: number;
  loadingUnloading: number;
  insurance: number;
  otherCharges: number;
  logisticsTotal: number;
  billTotal: number;
  netTotal: number;
  remarks: string;
}

export interface PurchaseBillReportResponse {
  success: boolean;
  total: number;
  summary: PurchaseBillReportSummary;
  data: PurchaseBillReportItem[];
}

// --- API Functions ---

const createPurchaseBill = async (data: PurchaseBillPayload) => {
  try {
    console.log(data);
    const response = await api.post("/purchasebill/create", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllPurchaseBills = async (): Promise<GetAllPurchaseBillsResponse> => {
  try {
    const response = await api.get("/purchasebill/getallpurchasebill");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPurchaseBillReport = async (): Promise<PurchaseBillReportResponse> => {
  try {
    const response = await api.get("/purchasebill/purchasebillreport");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const purchaseBillService = {
  createPurchaseBill,
  getAllPurchaseBills,
  getPurchaseBillReport,
};

export default purchaseBillService;