import api from "../api";

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

const createPurchaseBill = async (data: PurchaseBillPayload) => {
  try {
    const response = await api.post("/purchasebill/create", data);
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
  getPurchaseBillReport,
};

export default purchaseBillService;