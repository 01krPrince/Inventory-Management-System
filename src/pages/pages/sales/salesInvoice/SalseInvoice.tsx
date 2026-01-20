import React, { useState, useRef } from "react";
import { X, Save } from "lucide-react";

import SalesInvoiceHeader from "./SalesInvoiceHeader";
import SalesInvoiceForm, {
  InvoiceFormData,
  SalesInvoiceFormRef,
} from "./SalesInvoiceForm";
import ProfitAnalysisModal from "../../../../components/ProfitAnalysisModal";
import { fetchProfitAnalysis } from "../../../../services/analysis/profitService";
import OrderTable, { OrderTableRef } from "./OrderTable";
import InvoiceFooter, { InvoiceFooterRef } from "./InvoiceFooter";
import LedgerAttributes from "../../../../components/LedgerAttributes";
import InvoiceA4 from "../../../../components/invoiceDownload/InvoiceA4";

import { COLORS } from "../../../../constants/colors";
import { createSalesInvoice } from "./salesInvoiceService";
import { prepareInvoicePayload } from "./invoiceAdapter";

const SalesInvoice: React.FC = () => {
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [generatedBillData, setGeneratedBillData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isAnalysisOpen, setAnalysisOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const formRef = useRef<SalesInvoiceFormRef>(null);
  const orderTableRef = useRef<OrderTableRef>(null);
  const footerRef = useRef<InvoiceFooterRef>(null);

  /* =========================
     HANDLE SAVE BUTTON
  ========================== */
  const handleBottomSaveClick = () => {
    formRef.current?.triggerSubmit();
  };

  /// profit analyzesection
const handleAnalyzeProfit = async (tableRows: any[]) => {
    // 1. Check if items exist
    if (!tableRows || tableRows.length === 0) {
      alert("Please add items to the table first.");
      return;
    }

    // 2. Get Store ID
    const formData = formRef.current?.getFormData();
    const storeId = formData?.storeId || formData?.store; 

    if (!storeId) {
      alert("Please select a Store in the form.");
      return;
    }

    // 3. Map Items & Validate IDs
    const itemsPayload = [];
    
    for (const row of tableRows) {
        // STRICT CHECK: We MUST have the hidden itemId
        const hiddenId = row.data.itemId; 
        
        if (!hiddenId) {
            console.error("Missing ID for row:", row);
            alert(`Error: Item '${row.data.desc}' does not have a valid System ID. \n\nPlease DELETE this row and ADD it again to fix it.`);
            return; // STOP HERE. Don't crash the server.
        }

        itemsPayload.push({
          item: hiddenId, // Send the valid Mongo ID
          quantity: Number(row.data.qty),
          sellingPrice: Number(row.data.rate) // Sending Total Amount
        });
    }

    // 4. Debugging Log (Check your console!)
    console.log("🚀 Payload being sent:", {
        store: storeId,
        items: itemsPayload
    });

    try {
      const response = await fetchProfitAnalysis({
        store: storeId,
        items: itemsPayload,
        totalExpenses: 0
      });

      if (!response.success) throw new Error("Analysis failed");

      // 5. Merge Data
      const mergedItems = response.items.map((apiItem: any) => {
          const originalRow = tableRows.find(r => r.data.itemId === apiItem.item);
          return {
             ...apiItem,
             itemName: originalRow?.data.desc || "Unknown Item",
             itemCode: originalRow?.data.select || "N/A"
          };
      });

      setAnalysisData({ ...response, items: mergedItems });
      setAnalysisOpen(true);

    } catch (error: any) {
      console.error("Analysis Error:", error);
      alert(error.message || "Failed to fetch profit analysis.");
    }
  };

  /* =========================
     MAIN SUBMIT LOGIC
  ========================== */
  const handleFormSubmit = async (formData: InvoiceFormData) => {
    try {
      setIsSaving(true);

      // 1. Validate Items
      const tableData = orderTableRef.current?.getTableData();
      if (!tableData || tableData.visibleRows.length === 0) {
        alert("Please add at least one item.");
        return;
      }

      // 2. Footer Data
      const footerData = footerRef.current?.getFooterData();
      if (!footerData) return;

      // 3. Prepare API Payload
      const apiPayload = prepareInvoicePayload(
        formData,
        tableData.visibleRows,
        footerData,
      );

      console.log("🚀 Sending to API:", apiPayload);

      // 4. API Call
      const result = await createSalesInvoice(apiPayload);

      if (!result?.success) {
        throw new Error(result?.message || "Invoice creation failed");
      }

      /* =========================
         BUILD BILL PREVIEW DATA
      ========================== */
      const finalBillData = {
        invoiceNo: result.data.invoiceNo,
        date: new Date(result.data.date).toLocaleDateString("en-GB"),
        billType: result.data.gstType,
        placeOfSupply: formData.placeOfSupply,
        stateCode: "10",

        customer: {
          name: result.data.customer,
          addressLine: formData.billToText || "Address not provided",
          cityStateZip: "",
          gstin: formData.gstNo,
        },

        shipping: {
          name: result.data.customer,
          addressLine: formData.shipToText || formData.billToText,
          cityStateZip: "",
          stateCode: "",
        },

        items: result.data.items.map((item: any) => ({
          id: item.itemCode,
          description: item.description,
          qty: item.quantity,
          uom: "PCS",
          rate: item.rate,
          amount: item.amount,
        })),

        amountInWords:
          "Rupees " + (result.data.receivedAmount || "0") + " Only",

        bankDetails: {
          bankName: "HDFC Bank",
          ifsc: "HDFC000123",
          accountNo: "5020XXXXXXXX",
        },

        terms: [
          "1. Goods once sold will not be taken back",
          "2. Subject to Patna Jurisdiction",
        ],
      };

      setGeneratedBillData(finalBillData);
      setShowBillPreview(true);
      alert("✅ Invoice Saved Successfully!");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================
     UI
  ========================== */
  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* HEADER */}
      <SalesInvoiceHeader />

      {/* CONTENT */}
      <div className="flex-1 overflow-auto px-4 py-3 pb-24 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-4">
          <SalesInvoiceForm ref={formRef} onSubmit={handleFormSubmit} />
          <OrderTable ref={orderTableRef} onAnalyze={handleAnalyzeProfit} />
          <InvoiceFooter ref={footerRef} />
          <LedgerAttributes />
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div
        className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t shadow-[0_-6px_10px_-4px_rgba(0,0,0,0.15)] flex items-center justify-end px-6 z-50"
        style={{ borderColor: COLORS.borderDark }}
      >
        <button
          onClick={handleBottomSaveClick}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 rounded text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Save size={18} />
          {isSaving ? "Saving..." : "Save Invoice"}
        </button>
      </div>

      <ProfitAnalysisModal 
          isOpen={isAnalysisOpen} 
          onClose={() => setAnalysisOpen(false)} 
          data={analysisData}
      />

      {/* BILL PREVIEW MODAL */}
      {showBillPreview && generatedBillData && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
          <div className="relative bg-white w-full max-w-4xl h-[90vh] rounded shadow-2xl overflow-auto">
            <button
              onClick={() => setShowBillPreview(false)}
              className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 print:hidden z-50"
            >
              <X size={18} />
            </button>

            <InvoiceA4 data={generatedBillData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesInvoice;
