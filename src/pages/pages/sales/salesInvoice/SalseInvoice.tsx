import React, { useState, useRef } from "react";
import { X, Save } from "lucide-react";
import { ToWords } from "to-words";

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
// We don't strictly need the adapter if we build the payload manually below to be safe
// import { prepareInvoicePayload } from "./invoiceAdapter";

const SalesInvoice: React.FC = () => {
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [generatedBillData, setGeneratedBillData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Profit Analysis State
  const [isAnalysisOpen, setAnalysisOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  // Refs
  const formRef = useRef<SalesInvoiceFormRef>(null);
  const orderTableRef = useRef<OrderTableRef>(null);
  const footerRef = useRef<InvoiceFooterRef>(null);

  // Number to Words Converter
  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  });

  /* =========================
      HANDLE PROFIT ANALYSIS
   ========================== */
  const handleAnalyzeProfit = async (tableRows: any[]) => {
    if (!tableRows || tableRows.length === 0) {
      alert("Please add items to the table first.");
      return;
    }

    const formData = formRef.current?.getFormData();
    // Use storeId for analysis (backend usually expects ID for lookups here)
    const storeId = formData?.storeId;

    if (!storeId) {
      alert("Please select a Store in the form.");
      return;
    }

    const itemsPayload = [];
    for (const row of tableRows) {
      const hiddenId = row.data.itemId;

      if (!hiddenId) {
        console.error("Row Data:", row);
        alert(`Error: Item '${row.data.desc}' is missing a valid System ID.`);
        return;
      }

      itemsPayload.push({
        item: hiddenId,
        quantity: Number(row.data.qty),
        sellingPrice: Number(row.data.rate),
      });
    }

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

  /* =========================
      MAIN SAVE / SUBMIT LOGIC
   ========================== */
  const handleBottomSaveClick = () => {
    formRef.current?.triggerSubmit();
  };

  const handleFormSubmit = async (formData: InvoiceFormData) => {
    try {
      setIsSaving(true);

      // 1. Get Table Data
      const tableData = orderTableRef.current?.getTableData();
      if (!tableData || tableData.visibleRows.length === 0) {
        alert("Please add at least one item.");
        return;
      }

      // 2. Get Footer Data (Discounts, Round off, etc.)
      const footerData = footerRef.current?.getFooterData();
      if (!footerData) return;

      // --- CALCULATE GRAND TOTAL ---
      // We need this for 'receivedAmount' in request body
      let currentGrandTotal = 0;
      const mappedItems = tableData.visibleRows.map((row) => {
        const qty = Number(row.data.qty || 0);
        const rate = Number(row.data.rate || 0);

        // Assuming your backend handles tax calc, but for 'receivedAmount'
        // we might need a rough total. If footer has logic, use footerData.
        // For now, let's sum line amounts.
        currentGrandTotal += qty * rate;

        // Return the exact item structure for API
        return {
          itemCode: row.data.select, // Assuming 'select' holds the Item Code (e.g. "000376")
          quantity: qty,
          rate: rate,
        };
      });

      // --- 3. CONSTRUCT PAYLOAD MANUALLY ---
      // This ensures we match your REQUIRED format exactly
      const apiPayload = {
        storeCode: formData.storeCode, // "00001"
        customerCode: formData.customerCode, // "000005"
        date: formData.date, // "2026-01-17"
        gstType: formData.gstType, // "Intra"
        cashCredit: formData.cashCredit, // "Cash"

        // Using form data or calculating total if not provided
        receivedAmount: currentGrandTotal, // 1002998 (Example)

        cashBankLedger: "Cash", // Hardcoded per your request/example
        remarks: formData.refNo || "Sales Invoice",
        items: mappedItems,
      };

      // Validation Check
      if (!apiPayload.storeCode || !apiPayload.customerCode) {
        alert(
          "Error: Missing Store Code or Customer Code. Please re-select them in the form.",
        );
        setIsSaving(false);
        return;
      }

      console.log("🚀 Request Body:", apiPayload);

      // 4. Call API
      const result = await createSalesInvoice(apiPayload);

      if (!result?.success) {
        throw new Error(result?.message || "Invoice creation failed");
      }

      console.log("✅ Response Body:", result);

      /* =========================
          GENERATE BILL PREVIEW
      ========================== */
      const responseData = result.data;
      const resItems = responseData.items || [];

      // Calculate Totals for Preview
      let calculatedGrandTotal = 0;
      let calculatedTotalTax = 0;
      let calculatedTaxable = 0;

      const previewItems = resItems.map((item: any) => {
        const taxableValue = item.taxable || item.amount || 0;
        const taxVal = item.taxAmount || 0;
        const lineTotal = taxableValue + taxVal;

        calculatedTaxable += taxableValue;
        calculatedTotalTax += taxVal;
        calculatedGrandTotal += lineTotal;

        return {
          id: item.itemCode,
          description: item.description,
          hsn: item.hsn || "",
          qty: item.quantity,
          uom: "PCS",
          rate: item.rate,
          taxableValue: taxableValue,
          cgst: item.cgst || 0,
          sgst: item.sgst || 0,
          igst: item.igst || 0,
          amount: lineTotal,
        };
      });

      const finalBillData = {
        invoiceNo: responseData.invoiceNo,
        date: new Date(responseData.date).toLocaleDateString("en-GB"),
        billType: responseData.gstType,
        placeOfSupply: formData.placeOfSupply || "Bihar",
        stateCode: "10",

        seller: {
          name: responseData.store,
          address: "",
          gstin: "",
        },

        customer: {
          name: responseData.customer,
          addressLine: formData.billToText || "",
          gstin: formData.gstNo || "",
        },

        shipping: {
          name: responseData.customer,
          addressLine: formData.shipToText || formData.billToText || "",
        },

        items: previewItems,

        totals: {
          totalTaxable: calculatedTaxable,
          totalTax: calculatedTotalTax,
          grandTotal: calculatedGrandTotal,
          roundOff: 0,
        },

        amountInWords: toWords.convert(calculatedGrandTotal),

        bankDetails: {
          bankName: "HDFC Bank",
          ifsc: "HDFC000123",
          accountNo: "5020XXXXXXXX",
          branch: "Patna",
        },

        terms: [
          "1. Goods once sold will not be taken back.",
          "2. Interest @ 18% p.a. charged on overdue payments.",
          "3. Subject to Patna Jurisdiction only.",
        ],

        createdBy: "Admin",
        time: new Date().toLocaleTimeString(),
      };

      setGeneratedBillData(finalBillData);
      setShowBillPreview(true);
      alert("✅ Invoice Saved Successfully!");
    } catch (error: any) {
      console.error("Submit Error:", error);
      alert(error.message || "Something went wrong while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================
      UI RENDER
   ========================== */
  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* HEADER */}
      <SalesInvoiceHeader />

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-auto px-4 py-3 pb-24 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-4">
          <SalesInvoiceForm ref={formRef} onSubmit={handleFormSubmit} />
          <OrderTable ref={orderTableRef} onAnalyze={handleAnalyzeProfit} />
          <InvoiceFooter ref={footerRef} />
          <LedgerAttributes />
        </div>
      </div>

      {/* FIXED BOTTOM BAR */}
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

      {/* MODALS */}
      <ProfitAnalysisModal
        isOpen={isAnalysisOpen}
        onClose={() => setAnalysisOpen(false)}
        data={analysisData}
      />

      {showBillPreview && generatedBillData && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-4xl h-[90vh] rounded shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-gray-100 px-4 py-3 border-b">
              <h3 className="font-bold text-gray-700">Invoice Generated</h3>
              <button
                onClick={() => setShowBillPreview(false)}
                className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content (The Invoice) */}
            <div className="flex-1 overflow-auto bg-gray-50 p-6 custom-scrollbar">
              <InvoiceA4 data={generatedBillData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesInvoice;
