import api from "../api";

// --- Strict Interface based on your JSON payload ---

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

// --- Service Functions ---

const createPurchaseBill = async (data: PurchaseBillPayload) => {
  try {
    const response = await api.post("/purchasebill/create", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const purchaseBillService = {
  createPurchaseBill,
};

export default purchaseBillService;