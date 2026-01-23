import React, { useState, useRef } from "react";
import { X } from "lucide-react"; // Added X for modal close
import { ToWords } from "to-words"; // Import ToWords

import PurchaseBillHeader from "./PurchaseBillHeader";
import PurchaseBillForm, { PurchaseBillFormRef } from "./PurchaseBillForm";
import OrderTable, { OrderTableRef } from "../../sales/salesInvoice/OrderTable";
import PurchaseBillFooter from "./PurchaseBillFooter";
import { COLORS } from "../../../../constants/colors";

import purchaseBillService from "../../../../services/purchase/purchaseBill";

import LedgerAttributes, {
  LedgerData,
} from "../../../../components/LedgerAttributes";

import GoodsRecieptNoteLogistics, {
  LogisticsData,
} from "../goodsRecieptNote/GoodsRecieptNoteLogistics";

// Import the Invoice Component
import PurchaseBillInvoice from "../../../../components/invoiceDownload/PurchaseBillInvoice";

const PurchaseBill: React.FC = () => {
  const orderTableRef = useRef<OrderTableRef>(null);
  const formRef = useRef<PurchaseBillFormRef>(null);

  const [remarks, setRemarks] = useState("Testing logistics distribution");

  const [ledgerData, setLedgerData] = useState<LedgerData>({
    employee: "",
    group: "",
  });

  const [logisticsData, setLogisticsData] = useState<LogisticsData>({
    destination: "",
    shippingMode: "Road",
    shippingCompany: "",
    shippingCompanyAddress: "",
    shippingTrackingNo: "",
    shippingDate: new Date().toISOString().split("T")[0],
    shippingCharges: "0",
    vehicleNo: "",
    chargeType: "Paid",
    documentThrough: "",
    portOfLanding: "",
    portOfDischarge: "",
    noOfPackets: "0",
    weight: "0",
    portAddressForEway: "",
    portStateForEway: "",
    distance: "",
    ewayInvoiceNo: "",
    ewayInvoiceDate: "",
    ewayCancelDate: "",
    irnNo: "",
    qrCode: "",
    irnCancelDate: "",
    irnCancelReason: "",
    ackNo: "",
    ackDate: "",
    billOfEntryNum: "",
    billOfEntryDate: "",
    customDuty: "0.00",
    customDutyTender: "",
    chaPayment: "0.00",
    chaPaymentTender: "",
    freight: "100",
    freightTender: "",
    insurance: "210",
    insuranceTender: "",
    handling: "0.00",
    handlingTender: "",
    documentationCharges: "0.00",
    documentationChargesTender: "",
    bankCharges: "0.00",
    bankChargesTender: "",
    customExpenses: "0.00",
    customExpensesTender: "",
    loadingUnloading: "1000",
    loadingUnloadingTender: "",
    otherCharges: "1220",
    otherChargesTender: "",
  });

  // --- UI State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [generatedBillData, setGeneratedBillData] = useState<any>(null);

  // Number to Words Converter
  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  });

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData = formRef.current?.getFormData();

      if (!formData) {
        alert("Form data is missing");
        setIsSubmitting(false);
        return;
      }

      if (!formData.storeCode) {
        alert("Store Code is missing. Please re-select the Store.");
        setIsSubmitting(false);
        return;
      }
      if (!formData.vendorCode) {
        alert("Vendor Code is missing. Please re-select the Vendor.");
        setIsSubmitting(false);
        return;
      }

      const tableSource: any = orderTableRef.current?.getTableData?.();
      const rawRows = tableSource?.visibleRows || [];

      // Map Items to API structure
      const apiItems = rawRows.map((row: any) => {
        const item = row.data || row;
        return {
          itemcode: item.select || item.itemCode || "",
          quantity: Number(item.qty || 0),
          rate: Number(item.rate || 0),
        };
      });

      const payload = {
        billDate: formData.orderDate || new Date().toISOString().split("T")[0],
        storeCode: formData.storeCode,
        vendorCode: formData.vendorCode,
        remarks: remarks,
        items: apiItems,
        logistics: {
          freight: Number(logisticsData.freight) || 0,
          loadingUnloading: Number(logisticsData.loadingUnloading) || 0,
          insurance: Number(logisticsData.insurance) || 0,
          otherCharges: Number(logisticsData.otherCharges) || 0,
        },
      };

      console.log("🚀 SENDING PAYLOAD:", JSON.stringify(payload, null, 2));

      // Validation
      if (apiItems.length > 0 && apiItems.some((i: any) => !i.itemcode)) {
        console.warn("Missing itemcode detected in items:", apiItems);
        alert(
          "Warning: Some items do not have an Item Code. Please check the console.",
        );
        setIsSubmitting(false);
        return;
      }

      const response = await purchaseBillService.createPurchaseBill(
        payload as any,
      );
      console.log("✅ API SUCCESS:", response);

      // --- GENERATE INVOICE DATA FOR PREVIEW ---
      const responseData = response.data;
      const resItems = responseData.items || [];
      const resLogistics = responseData.logistics || {};

      // 1. Calculate Totals
      let subTotal = 0;
      const mappedItems = resItems.map((item: any, index: number) => {
        const amount = Number(item.amount || 0); // 4803430
        subTotal += amount;

        return {
          sNo: index + 1,
          description: item.description,
          hsnSac: "", // Not in response, leave empty or map if available
          packQty: 0, // Not in response
          qty: item.quantity,
          uom: "NOS", // Default
          rate: item.rate,
          discountPercent: 0,
          amount: amount,
        };
      });

      // Logistics Totals
      const freight = Number(resLogistics.freight || 0);
      const loading = Number(resLogistics.loadingUnloading || 0);
      const insurance = Number(resLogistics.insurance || 0);
      const other = Number(resLogistics.otherCharges || 0);
      const totalLogistics = freight + loading + insurance + other;

      // Tax Calculation (Assuming 0 for now as response doesn't provide it)
      // If you want to calculate tax from taxable value, add logic here.
      const totalTax = 0;
      const grandTotal = subTotal + totalLogistics + totalTax;

      // 2. Map to InvoiceData Interface
      const invoicePreviewData = {
        header: {
          title: "PURCHASE BILL",
          subTitle: "Internal Copy",
          originalFor: "Original",
          logoUrl: "", // Add logo URL if needed
        },
        seller: {
          // In a Purchase Bill, the "Seller" is the Vendor
          name: responseData.vendor, // "A.K. TRADING COMPANY"
          addressLine1: formData.billToText?.split("\n")[1] || "", // Extracting from form text
          addressLine2: formData.billToText?.split("\n")[2] || "",
          cityStateZip: "",
          gstin: formData.gstNo || "",
          pan: "",
        },
        invoiceDetails: {
          invoiceNo: responseData.billNo, // "PB0101"
          invoiceDate: new Date(responseData.billDate).toLocaleDateString(
            "en-GB",
          ),
          reverseCharge: "No",
          placeOfSupply: formData.placeOfSupply || "",
          station: "",
          vehicleNo: logisticsData.vehicleNo,
          grRrNo: "",
          distance: logisticsData.distance,
          shippingCompany: logisticsData.shippingCompany,
        },
        billing: {
          // "Bill To" is Us (The Store)
          name: responseData.store, // "CHANDAN KHEL GHAR"
          addressLine1: formData.shipToText?.split("\n")[1] || "",
          addressLine2: "",
          cityStateZip: "",
          gstin: "",
        },
        shipping: {
          // "Ship To" is Us (The Store)
          name: responseData.store,
          addressLine1: formData.shipToText?.split("\n")[1] || "",
          addressLine2: formData.shipToText?.split("\n")[2] || "",
          cityStateZip: "",
          phone: "",
        },
        items: mappedItems,
        totals: {
          subTotal: subTotal,
          discount: 0,
          taxableAmount: subTotal, // Assuming subTotal is taxable
          cgst: 0,
          sgst: 0,
          cess: 0,
          roundOff: 0,
          grandTotal: grandTotal,
          amountInWords: toWords.convert(grandTotal),
          taxAmountInWords: "Zero Only",
        },
        taxTable: [], // Empty if no tax details provided
        logistics: {
          mode: logisticsData.shippingMode,
          weight: logisticsData.weight,
          bundles: logisticsData.noOfPackets,
          chargesPaid: totalLogistics.toFixed(2),
          docExtraInfo: "",
          remarks: responseData.remarks,
        },
        signatory: {
          companyName: responseData.store,
        },
      };

      setGeneratedBillData(invoicePreviewData);
      setShowBillPreview(true);
    } catch (error) {
      console.error("❌ API ERROR:", error);
      alert("Failed to save. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col bg-gray-100 overflow-hidden min-h-screen"
    >
      <PurchaseBillHeader />

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <PurchaseBillForm ref={formRef} />

        <OrderTable ref={orderTableRef} />

        <PurchaseBillFooter remarks={remarks} onRemarksChange={setRemarks} />

        <LedgerAttributes data={ledgerData} onChange={setLedgerData} />

        <GoodsRecieptNoteLogistics
          data={logisticsData}
          onChange={setLogisticsData}
        />

        <div className="flex justify-end gap-3 bg-white p-4 border rounded shadow-sm">
          <button
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="px-10 py-2 bg-[#0f3c63] text-white rounded font-bold hover:bg-[#1a4a75] transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? "Saving..." : "Save Purchase Bill"}
          </button>
        </div>
      </div>

      {/* --- INVOICE PREVIEW MODAL --- */}
      {showBillPreview && generatedBillData && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-4xl h-[90vh] rounded shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-gray-100 px-4 py-3 border-b">
              <h3 className="font-bold text-gray-700">
                Purchase Bill Generated
              </h3>
              <button
                onClick={() => setShowBillPreview(false)}
                className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content (The Invoice) */}
            <div className="flex-1 overflow-auto bg-gray-50 p-6 custom-scrollbar">
              <PurchaseBillInvoice data={generatedBillData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseBill;
