import React, { useState, useRef } from "react";
import { X, Save } from "lucide-react";
// import { ToWords } from "to-words";

import PurchaseBillHeader from "./PurchaseBillHeader";
import PurchaseBillForm, { PurchaseBillFormRef } from "./PurchaseBillForm";
import OrderTable, { OrderTableRef } from "./OrderTable";
import PurchaseBillFooter, {
  PurchaseBillFooterRef,
} from "./PurchaseBillFooter";
import { COLORS } from "../../../../constants/colors";

import purchaseBillService from "../../../../services/purchase/purchaseBill";
import { fetchProfitAnalysis } from "../../../../services/analysis/profitService";
import ProfitAnalysisModal from "../../../../components/ProfitAnalysisModal";

import LedgerAttributes, {
  LedgerData,
} from "../../../../components/LedgerAttributes";

import GoodsRecieptNoteLogistics, {
  LogisticsData,
} from "../goodsRecieptNote/GoodsRecieptNoteLogistics";

import PurchaseBillInvoice from "../../../../components/invoiceDownload/PurchaseBillInvoice";

const PurchaseBill: React.FC = () => {
  const orderTableRef = useRef<OrderTableRef>(null);
  const formRef = useRef<PurchaseBillFormRef>(null);
  const footerRef = useRef<PurchaseBillFooterRef>(null);

  const [cashCredit, setCashCredit] = useState<string>("Credit");
  // CRITICAL: This state variable acts as the "Single Source of Truth" for vendor synchronization.
  const [currentVendorCode, setCurrentVendorCode] = useState<string>("");

  const [isAnalysisOpen, setAnalysisOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

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
    customDutyTender: "0.00",
    chaPayment: "0.00",
    chaPaymentTender: "0.00",
    freight: "0.00",
    freightTender: "0.00",
    insurance: "0.00",
    insuranceTender: "0.00",
    handling: "0.00",
    handlingTender: "0.00",
    documentationCharges: "0.00",
    documentationChargesTender: "0.00",
    bankCharges: "0.00",
    bankChargesTender: "0.00",
    customExpenses: "0.00",
    customExpensesTender: "0.00",
    loadingUnloading: "0.00",
    loadingUnloadingTender: "0.00",
    otherCharges: "0.00",
    otherChargesTender: "0.00",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [generatedBillData, setGeneratedBillData] = useState<any>(null);
  const [tableItems, setTableItems] = useState<any[]>([]);

  // const toWords = new ToWords({
  //   localeCode: "en-IN",
  //   converterOptions: {
  //     currency: true,
  //     ignoreDecimal: false,
  //     ignoreZeroCurrency: false,
  //   },
  // });

  const handleFormChange = (data: any) => {
    if (data.cashCredit) {
      setCashCredit(data.cashCredit);
    }
    // RECTIFICATION: Update currentVendorCode whenever the form's vendor selection changes.
    // This prop update will trigger the useEffect inside OrderTable to fetch new items.
    if (data.vendorCode !== undefined) {
      setCurrentVendorCode(data.vendorCode);
    }
  };

  const handleAnalyzeProfit = async (tableRows: any[]) => {
    if (!tableRows || tableRows.length === 0) {
      alert("Please add items to the table first.");
      return;
    }

    const formData = formRef.current?.getFormData();
    const storeId = formData?.storeId;

    if (!storeId) {
      alert("Please select a Store in the form.");
      return;
    }

    const itemsPayload = tableRows.map((row) => ({
      item: row.data.itemId,
      quantity: Number(row.data.qty),
      sellingPrice: Number(row.data.rate),
    }));

    try {
      const response = await fetchProfitAnalysis({
        store: storeId,
        items: itemsPayload,
        totalExpenses: 0,
      });

      if (!response.success) throw new Error("Analysis failed");

      const mergedItems = response.items.map((apiItem: any) => {
        const originalRow = tableRows.find(
          (r) => r.data.itemId === apiItem.item,
        );
        return {
          ...apiItem,
          itemName: originalRow?.data.desc || "Unknown Item",
          itemCode: originalRow?.data.select || "N/A",
        };
      });

      setAnalysisData({ ...response, items: mergedItems });
      setAnalysisOpen(true);
    } catch (error: any) {
      console.error("Analysis Error:", error);
      alert(error.message || "Failed to fetch profit analysis.");
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData = formRef.current?.getFormData();
      const tableSource: any = orderTableRef.current?.getTableData?.();
      const footerData = footerRef.current?.getFooterData();

      if (!formData) {
        alert("Form data is missing");
        return;
      }
      if (!formData.storeCode || !formData.vendorCode) {
        alert("Store or Vendor Code is missing.");
        return;
      }
      const rawRows = tableSource?.visibleRows || [];
      if (rawRows.length === 0) {
        alert("Please add at least one item.");
        return;
      }

      const apiItems = rawRows.map((row: any) => {
        const item = row.data || row;
        return {
          itemCode: item.select || item.itemCode || "",
          quantity: Number(item.qty || 0),
          rate: Number(item.rate || 0),
          amount: Number(item.amount || 0),
        };
      });

      const payload = {
        billDate: formData.orderDate || new Date().toISOString().split("T")[0],
        storeCode: formData.storeCode,
        vendorCode: formData.vendorCode,
        cashCredit: cashCredit,
        gstType: formData.gstType,
        remarks: footerData?.remarks || "Purchase Bill",
        receivedAmount: footerData?.receivedAmount || 0,
        cashBankLedger: footerData?.cashBankLedger || "",
        itemValue: footerData?.itemValue || 0,
        // billDiscount: footerData?.discount1 || 0,
        billDiscount: footerData?.otherDiscAmt || 0,
        taxable: footerData?.taxable || 0,
        taxAmount: footerData?.taxAmount || 0,
        roundOff: footerData?.roundOff || 0,
        netAmount: footerData?.docAmount || 0,
        items: apiItems,
        logistics: {
          freight: Number(logisticsData.freight) || 0,
          loadingUnloading: Number(logisticsData.loadingUnloading) || 0,
          insurance: Number(logisticsData.insurance) || 0,
          otherCharges: Number(logisticsData.otherCharges) || 0,
        },
      };

      // ✅ LOG: Printing the request body to console
      console.log("🚀 Request Payload:", payload);

      const response = await purchaseBillService.createPurchaseBill(
        payload as any,
      );
      const responseData = response.data;
      // const grandTotal = footerData?.docAmount || 0;

      setGeneratedBillData(responseData);
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
        {/* Step 1: Form triggers handleFormChange on any selection */}
        <PurchaseBillForm ref={formRef} onFormChange={handleFormChange} />

        {/* Step 2: Table reacts to currentVendorCode prop updates */}
        <OrderTable
          ref={orderTableRef}
          onAnalyze={handleAnalyzeProfit}
          vendorCode={currentVendorCode}
          onItemsChange={setTableItems}
        />

        <PurchaseBillFooter
          ref={footerRef}
          cashCredit={cashCredit}
          currentItems={tableItems}
        />

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
            <Save size={18} className="inline mr-2" />
            {isSubmitting ? "Saving..." : "Save Purchase Bill"}
          </button>
        </div>
      </div>

      <ProfitAnalysisModal
        isOpen={isAnalysisOpen}
        onClose={() => setAnalysisOpen(false)}
        data={analysisData}
      />

      {showBillPreview && generatedBillData && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-4xl h-[90vh] rounded shadow-2xl flex flex-col">
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
