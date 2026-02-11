import api from "../api";

/* =======================
   MODELS / INTERFACES
======================= */

export interface ShippingAddress {
  shipTo: string;
  fullAddress: string;
  state: string;
  city: string;
}

export interface Warranty {
  duration: string;
  price: number;
}

export interface PosInvoiceItem {
  item: string;
  itemCode: string;
  itemName: string;
  posType: "Sale" | "Return";

  warranty?: Warranty;

  quantity: number;
  rate: number;
  amount: number;

  mrp: number;
  unit: string;
  brand: string;
  barCode: string;
  hsn: string;

  taxCode: string;
  taxRate: number;
  taxAmount: number;
  netRate: number;
  netAmount: number;
  group: string;

  batchNo: string;
  warehouse: string;
}

export interface Payment {
  mode: "Cash" | "UPI" | "Card" | "CreditNote";
  netAmount: number;
  pendingAmount: number;

  // Optional fields depending on payment mode
  givenByCustomer?: number;
  approvalCode?: string;
  docNo?: string;
}

export interface PosInvoicePayload {
  store: string;
  billDate: string;
  salesman: string;
  priceCategory: string;

  customerCode: string;
  customerName: string;
  customerPhone: string;

  billingAddress: string;
  shippingAddress: ShippingAddress;

  refNo: string;
  refDate: string;
  gstNo: string;
  deliveryType: string;

  items: PosInvoiceItem[];

  itemValue: number;
  grossAmount: number;

  promoDiscount: number;
  promoDiscount2: number;
  couponDiscount: number;
  couponCode: string;

  billDiscountPercent: number;
  billDiscountAmount: number;

  taxableAmount: number;
  taxAmount: number;
  roundOff: number;

  docAmount: number;

  remarks: string;
  description: string;
  ledgerEmployee: string;
  ledgerGroup: string;

  payments: Payment[];
}

/* =======================
   API RESPONSE MODEL
======================= */

/* =======================
   API RESPONSE MODEL
======================= */

export interface PosInvoiceResponse {
  success: boolean;
  message: string;
  data?: any; 
}

/* =======================
   SERVICE
======================= */

const POS_INVOICE_ENDPOINT = "/posinvoice/create";

export const PosInvoiceService = {
  createInvoice: async (
    payload: PosInvoicePayload
  ): Promise<PosInvoiceResponse> => {
    const response = await api.post<PosInvoiceResponse>(
      POS_INVOICE_ENDPOINT,
      payload
    );
    return response.data;
  },
};

export default PosInvoiceService;
