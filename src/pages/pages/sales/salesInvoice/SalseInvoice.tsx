import React, { useState, useRef } from 'react';
import { X, Save } from 'lucide-react';
import { ToWords } from 'to-words';

import SalesInvoiceHeader from './SalesInvoiceHeader';
import SalesInvoiceForm, { InvoiceFormData, SalesInvoiceFormRef } from './SalesInvoiceForm';
import ProfitAnalysisModal from '../../../../components/ProfitAnalysisModal';
import OrderTable, { OrderTableRef } from './OrderTable2';
// import InvoiceFooter, { InvoiceFooterRef } from "./InvoiceFooter";
import PurchaseBillFooter, {
  PurchaseBillFooterRef,
} from '../../purchase/purchaseBill/PurchaseBillFooter';
import LedgerAttributes from '../../../../components/LedgerAttributes';
import InvoiceA4 from '../../../../components/invoiceDownload/InvoiceA4';
import { fetchProfitAnalysis } from '../../../../services/analysis/profitService';
import { COLORS } from '../../../../constants/colors';
import { createSalesInvoice } from './salesInvoiceService';

const SalesInvoice: React.FC = () => {
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [generatedBillData, setGeneratedBillData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [tableItems, setTableItems] = useState<any[]>([]);

  // Profit Analysis State
  const [isAnalysisOpen, setAnalysisOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  // New State for Cash/Credit (Lifted from form)
  const [cashCredit, setCashCredit] = useState<string>('Credit');

  // Refs
  const formRef = useRef<SalesInvoiceFormRef>(null);
  const orderTableRef = useRef<OrderTableRef>(null);
  // const footerRef = useRef<InvoiceFooterRef>(null);
  const footerRef = useRef<PurchaseBillFooterRef>(null);

  // Number to Words Converter
  const toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  });

  // Handler to sync form state with parent
  const handleFormChange = (data: InvoiceFormData) => {
    setCashCredit(data.cashCredit);
  };

  /* =========================
      HANDLE PROFIT ANALYSIS
    ========================== */
  const handleAnalyzeProfit = async (tableRows: any[]) => {
    if (!tableRows || tableRows.length === 0) {
      alert('Please add items to the table first.');
      return;
    }

    const itemsPayload = [];
    for (const row of tableRows) {
      const hiddenId = row.data.itemId;

      if (!hiddenId) {
        console.error('Row Data:', row);
        alert(`Error: Item '${row.data.desc}' is missing a valid System ID.`);
        return;
      }

      itemsPayload.push({
        item: hiddenId,
        quantity: Number(row.data.qty),
        sellingPrice: Number(row.data.rate),
      });
    }

    // Note: Assuming 'store' is available in scope or derived from formRef.
    // If 'store' variable is missing in this scope, fetch it from formRef:
    const currentFormData = formRef.current?.getFormData();
    const currentStore = currentFormData?.store || '';

    try {
      const response = await fetchProfitAnalysis({
        store: currentStore,
        items: itemsPayload,
        totalExpenses: 0,
      });

      if (!response.success) throw new Error('Analysis failed');

      const mergedItems = response.items.map((apiItem: any) => {
        const originalRow = tableRows.find((r) => r.data.itemId === apiItem.item);
        return {
          ...apiItem,
          itemName: originalRow?.data.desc || 'Unknown Item',
          itemCode: originalRow?.data.select || 'N/A',
        };
      });

      setAnalysisData({ ...response, items: mergedItems });
      setAnalysisOpen(true);
    } catch (error: any) {
      console.error('Analysis Error:', error);
      alert(error.message || 'Failed to fetch profit analysis.');
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
        alert('Please add at least one item.');
        return;
      }

      // 2. Get Footer Data
      const footerData = footerRef.current?.getFooterData();
      if (!footerData) return;

      // --- CALCULATE GRAND TOTAL ---
      let currentGrandTotal = 0;
      const mappedItems = tableData.visibleRows.map((row) => {
        const qty = Number(row.data.qty || 0);
        const rate = Number(row.data.rate || 0);

        currentGrandTotal += qty * rate;

        return {
          itemCode: row.data.select, // Assuming 'select' holds the item code (e.g. "000377")
          quantity: qty,
          rate: rate,
        };
      });

      // --- 3. CONSTRUCT PAYLOAD MANUALLY ---
      // UPDATED: Sending Customer CODE instead of Name
      const apiPayload = {
        store: formData.storeCode || formData.store, // Use Code first, fallback to name
        customer: formData.customerCode || formData.customer, // Use Code first, fallback to name
        date: formData.date,
        gstType: formData.gstType,
        cashCredit: formData.cashCredit,
        netAmount: currentGrandTotal,

        cashBankLedger: 'Cash',
        remarks: formData.refNo || 'Sales Invoice',
        items: mappedItems,
      };

      if (!apiPayload.store || !apiPayload.customer) {
        alert('Error: Missing Store Code or Customer Code. Please re-select them in the form.');
        setIsSaving(false);
        return;
      }

      console.log('🚀 Request Body:', apiPayload);

      // 4. Call API
      const result = await createSalesInvoice(apiPayload);

      if (!result?.success) {
        throw new Error(result?.message || 'Invoice creation failed');
      }

      console.log('✅ Response Body:', result);

      /* =========================
          GENERATE BILL PREVIEW
      ========================== */
      const responseData = result.data;
      const resItems = responseData.items || [];

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
          hsn: item.hsn || '',
          qty: item.quantity,
          uom: 'PCS',
          rate: item.rate,
          taxableValue: taxableValue,
          cgst: item.cgst || 0,
          sgst: item.sgst || 0,
          igst: item.igst || 0,
          amount: item.amount,
        };
      });

      const finalBillData = {
        invoiceNo: responseData.invoiceNo,
        date: new Date(responseData.date).toLocaleDateString('en-GB'),
        billType: responseData.gstType,
        placeOfSupply: formData.placeOfSupply || 'Bihar',
        stateCode: '10',

        seller: {
          name: responseData.store,
          address: '',
          gstin: '',
        },

        customer: {
          name: responseData.customer,
          addressLine: formData.billToText || '',
          gstin: formData.gstNo || '',
        },

        shipping: {
          name: responseData.customer,
          addressLine: formData.shipToText || formData.billToText || '',
        },

        items: previewItems,

        totals: {
          totalTaxable: calculatedTaxable,
          totalTax: calculatedTotalTax,
          grandTotal: calculatedGrandTotal,
          roundOff: 0,
        },

        billDiscount: responseData.billDiscount || 0, // e.g. 10
        grandTotal: responseData.netAmount, // ✅ Using 'netAmount' (840) for the final bold total

        // Convert the NET AMOUNT (840) to words, not the gross
        amountInWords: toWords.convert(responseData.netAmount),

        bankDetails: {
          bankName: 'HDFC Bank',
          ifsc: 'HDFC000123',
          accountNo: '5020XXXXXXXX',
          branch: 'Patna',
        },

        terms: [
          '1. Goods once sold will not be taken back.',
          '2. Interest @ 18% p.a. charged on overdue payments.',
          '3. Subject to Patna Jurisdiction only.',
        ],

        createdBy: 'Admin',
        time: new Date().toLocaleTimeString(),
      };

      setGeneratedBillData(finalBillData);
      setShowBillPreview(true);
      alert('✅ Invoice Saved Successfully!');
    } catch (error: any) {
      console.error('Submit Error:', error);
      alert(error.message || 'Something went wrong while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================
      UI RENDER
    ========================== */
  return (
    <div className="flex flex-col overflow-hidden" style={{ backgroundColor: COLORS.background }}>
      {/* HEADER */}
      <SalesInvoiceHeader />

      {/* CONTENT AREA */}
      <div className="custom-scrollbar flex-1 overflow-auto px-4 py-3 pb-24">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4">
          <SalesInvoiceForm
            ref={formRef}
            onSubmit={handleFormSubmit}
            onFormChange={handleFormChange}
          />
          <OrderTable
            ref={orderTableRef}
            onAnalyze={handleAnalyzeProfit}
            vendorCode={''}
            onItemsChange={setTableItems}
          />
          {/* Passed the live state value here */}
          {/* <InvoiceFooter
            ref={footerRef}
            cashCredit={cashCredit}
            currentItems={tableItems}
          /> */}
          <PurchaseBillFooter ref={footerRef} cashCredit={cashCredit} currentItems={tableItems} />
          <LedgerAttributes />
        </div>
      </div>

      {/* FIXED BOTTOM BAR */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-end border-t bg-white px-6 shadow-[0_-6px_10px_-4px_rgba(0,0,0,0.15)]"
        style={{ borderColor: COLORS.borderDark }}>
        <button
          onClick={handleBottomSaveClick}
          disabled={isSaving}
          className="flex items-center gap-2 rounded px-6 py-2 text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60"
          style={{ backgroundColor: COLORS.primary }}>
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Invoice'}
        </button>
      </div>

      {/* MODALS */}
      <ProfitAnalysisModal
        isOpen={isAnalysisOpen}
        onClose={() => setAnalysisOpen(false)}
        data={analysisData}
      />

      {showBillPreview && generatedBillData && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b bg-gray-100 px-4 py-3">
              <h3 className="font-bold text-gray-700">Invoice Generated</h3>
              <button
                onClick={() => setShowBillPreview(false)}
                className="rounded-full bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600">
                <X size={18} />
              </button>
            </div>

            {/* Modal Content (The Invoice) */}
            <div className="custom-scrollbar flex-1 overflow-auto bg-gray-50 p-6">
              <InvoiceA4 data={generatedBillData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesInvoice;
