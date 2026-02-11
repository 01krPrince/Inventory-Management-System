import React, { useState, useRef } from 'react';
import { X, Save } from 'lucide-react';
import SalesInvoiceHeader from './SalesInvoiceHeader';
import SalesInvoiceForm, { InvoiceFormData, SalesInvoiceFormRef } from './SalesInvoiceForm';
import ProfitAnalysisModal from '../../../../components/ProfitAnalysisModal';
import OrderTable, { OrderTableRef } from './OrderTable';
import { ToWords } from 'to-words';
import SaleInvoiceFooter, { SaleInvoiceFooterRef } from './SaleInvoiceFooter';
import InvoiceA4 from '../../../../components/invoiceDownload/InvoiceA4';
import { fetchProfitAnalysis } from '../../../../services/analysis/profitService';
import { COLORS } from '../../../../constants/colors';
import { createSalesInvoice } from './salesInvoiceService';

const SaleReturn: React.FC = () => {
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [generatedBillData, setGeneratedBillData] = useState<any>(null);
  const [storeCode, setStoreCode] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [tableItems, setTableItems] = useState<any[]>([]);

  // Profit Analysis State
  const [isAnalysisOpen, setAnalysisOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const [cashCredit, setCashCredit] = useState<string>('Credit');

  // Refs
  const formRef = useRef<SalesInvoiceFormRef>(null);
  const orderTableRef = useRef<OrderTableRef>(null);
  const footerRef = useRef<SaleInvoiceFooterRef>(null);

  // Sync form state
  const handleFormChange = (data: InvoiceFormData) => {
    setCashCredit(data.cashCredit);
    if (data.storeCode !== storeCode) {
      setStoreCode(data.storeCode || '');
    }
  };

  const handleAnalyzeProfit = async (tableRows: any[]) => {
    if (!tableRows || tableRows.length === 0) {
      alert('Please add items to the table first.');
      return;
    }
    const currentFormData = formRef.current?.getFormData();
    const currentStore = currentFormData?.store || '';

    const itemsPayload = tableRows.map((row) => ({
      item: row.data.itemId,
      quantity: Number(row.data.qty),
      sellingPrice: Number(row.data.rate),
    }));

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
      SAVE / SUBMIT LOGIC
     ========================== */
  const handleBottomSaveClick = () => {
    // This triggers the submit in the form, which calls handleFormSubmit below
    formRef.current?.triggerSubmit();
  };

  const handleFormSubmit = async (formData: InvoiceFormData) => {
    try {
      setIsSaving(true);

      // --- 1. GET TABLE DATA ---
      const tableData = orderTableRef.current?.getTableData();
      if (!tableData || tableData.visibleRows.length === 0) {
        alert('Please add at least one item to the invoice.');
        setIsSaving(false);
        return;
      }

      // --- 2. GET FOOTER DATA ---
      const footerData = footerRef.current?.getFooterData();
      const billDiscount = Number(footerData?.discount1 || 0);
      const roundOff = Number(footerData?.roundOff || 0);

      if (footerRef.current) {
        const validation = footerRef.current.validatePayment();

        // This says: "If NOT valid, stop and alert."
        if (!validation.isValid) {
          alert(validation.message);
          return;
        }
      }

      // --- 3. PROCESS ITEMS LOOP ---
      let totalTaxAmount = 0;
      let totalItemValue = 0;
      let totalWarrantyValue = 0;

      const mappedItems = tableData.visibleRows.map((row) => {
        const rawQty = parseFloat(String(row.data.qty || 0));
        const rawRate = parseFloat(String(row.data.rate || 0));
        // const calculatedNetRate = rawRate + (rawRate * expenseRatio);
        const taxRate = parseFloat(String(row.data.gstRate || row.data.taxRate || 0));
        const hsn = String(row.data.taxCode || row.data.hsn || '');
        // const groupName = row.data.group || 'Default';
        // Warranty Logic
        let warrantyPrice = 0;
        const customWarranty = [];
        if (row.data.warrantyDuration) {
          warrantyPrice = Number(row.data.warrantyPrice || 0);
          customWarranty.push({
            duration: row.data.warrantyDuration,
            price: row.data.warrantyPrice || '0',
          });
        }

        // Tax Logic
        let taxableRate = 0;
        if (formData.tax === 'Inclusive') {
          taxableRate = rawRate / (1 + taxRate / 100);
        } else {
          taxableRate = rawRate;
        }

        taxableRate = Number(taxableRate.toFixed(2));
        const taxableAmount = Number((rawQty * taxableRate).toFixed(2));
        const totalTaxForItem = Number(((taxableAmount * taxRate) / 100).toFixed(2));

        // Net Amount for API (Taxable + Tax + Warranty)
        const netAmountForItem = Number(
          (taxableAmount + totalTaxForItem + warrantyPrice).toFixed(2)
        );

        let cgst = 0,
          sgst = 0,
          igst = 0;
        if (formData.gstType === 'Intra') {
          cgst = Number((totalTaxForItem / 2).toFixed(2));
          sgst = Number((totalTaxForItem / 2).toFixed(2));
        } else {
          igst = totalTaxForItem;
        }

        totalTaxAmount += totalTaxForItem;
        totalItemValue += taxableAmount;
        totalWarrantyValue += warrantyPrice;

        return {
          itemCode: row.data.select,
          quantity: rawQty,
          rate: taxableRate,
          amount: taxableAmount,
          hsn: hsn,
          taxRate: taxRate,
          cgst,
          sgst,
          igst,
          taxAmount: totalTaxForItem,
          netAmount: netAmountForItem,
          description: row.data.desc || 'Item',
          unit: row.data.unit || 'PCS',
          customWarranty: customWarranty,
          group: row.data.group || 'Default',
          // netRate: Number(calculatedNetRate.toFixed(2)),
          // warrantyPrice: warrantyPrice
        };
      });

      // Calculate Grand Total
      const subTotal = totalItemValue + totalTaxAmount + totalWarrantyValue;
      const finalNetAmount = Number((subTotal - billDiscount + roundOff).toFixed(2));
      const paymentList = footerData?.payments || [];

      // --- 4. API PAYLOAD ---
      const apiPayload = {
        store: formData.storeCode,
        customer: formData.customerCode,
        date: formData.date,
        remarks: formData.refNo || formData.billToText || 'Sales Invoice',
        type: formData.cashCredit,
        gstType: formData.gstType,
        items: mappedItems,
        promoDiscount: 0,
        billDiscount: billDiscount,
        billDiscountPercent: 0,
        taxAmount: Number(totalTaxAmount.toFixed(2)),
        roundOff: roundOff,
        adjustment: 0,
        netAmount: finalNetAmount,
        payments: paymentList,
      };

      console.log('🚀 DEBUG: Sending Payload:', JSON.stringify(apiPayload, null, 2));

      if (!apiPayload.store || !apiPayload.customer) {
        alert('Validation Failed: Store Code or Customer Code is missing.');
        setIsSaving(false);
        return;
      }

      // --- 5. CALL SERVICE ---
      const response = await createSalesInvoice(apiPayload);
      console.log('✅ DEBUG: API Response:', JSON.stringify(response, null, 2));

      if (response.success) {
        alert('Invoice Created Successfully!');

        formRef.current?.resetForm();
        orderTableRef.current?.clearTable();
        footerRef.current?.resetFooter?.();
        setTableItems([]);

        // --- 6. PREPARE PREVIEW DATA ---
        const apiData = response.data;
        const toWords = new ToWords({ localeCode: 'en-IN', converterOptions: { currency: true } });
        const formatDate = (d: string) => (d ? new Date(d).toLocaleDateString('en-GB') : '');

        // Map Items specifically for the A4 Invoice View
        const previewItems = apiData.items.map((item: any, idx: number) => {
          let warrantyText = '';
          let wPrice = 0;

          if (item.customWarranty && item.customWarranty.length > 0) {
            const w = item.customWarranty[0];
            wPrice = Number(w.price || 0);
            if (wPrice > 0) {
              warrantyText = `${w.duration} Months Warranty (₹${wPrice})`;
            } else {
              warrantyText = `${w.duration} Months Warranty`;
            }
          }

          // --- CALCULATION LOGIC FOR PREVIEW ---
          const itemQty = Number(item.quantity || 0);

          // 1. Get Base Values (Product Only)
          const itemTaxable = Number(item.amount || 0); // API 'amount' is taxable
          const itemTax = Number(item.taxAmount || 0);
          const productTotal = itemTaxable + itemTax; // Price without warranty

          // 2. Original Rate (Product Rate / Qty) -> Matches "Original Item Rate"
          const originalRate = itemQty > 0 ? productTotal / itemQty : 0;

          // 3. Final Amount (Product + Warranty) -> Matches "Total Amount me add kr ke"
          const totalLineAmount = productTotal + wPrice;

          return {
            id: idx + 1,
            description: item.description || 'Item',
            qty: itemQty,
            uom: 'PCS',
            rate: originalRate, // Shows rate WITHOUT warranty
            amount: totalLineAmount, // Shows total WITH warranty
            warranty: warrantyText,
          };
        });

        // Calculate the sum of the displayed amounts for the words
        const totalDisplayAmount = previewItems.reduce(
          (acc: number, curr: any) => acc + (curr.isWarrantyRow ? curr.amount : curr.amount),
          0
        );
        // Adjust for discount/roundoff from API response
        const finalDisplayTotal =
          totalDisplayAmount - (apiData.billDiscount || 0) + (apiData.roundOff || 0);

        const previewData = {
          storeName: apiData.storeName || formData.store || 'Unknown Store',
          remarks: apiData.remarks || apiPayload.remarks || '',
          invoiceNo: apiData.invoiceNo || 'NEW-INV',
          date: formatDate(apiData.date || formData.date),
          billType: apiData.type || formData.cashCredit,
          placeOfSupply: formData.placeOfSupply || 'Bihar',
          grlrNo: '',
          destination: '',
          stateCode: '10',
          customer: {
            name: apiData.customerName || formData.customer,
            addressLine: formData.billToText || '',
            cityStateZip: '',
            stateCode: '',
            gstin: formData.gstNo || '',
          },
          items: previewItems,
          amountInWords: toWords.convert(finalDisplayTotal),
          bankDetails: {
            bankName: 'HDFC BANK',
            ifsc: 'HDFC0001234',
            accountNo: '5020000123456',
          },
          terms: ['Goods once sold will not be taken back.', 'Subject to local jurisdiction.'],
        };

        setGeneratedBillData(previewData);
        setShowBillPreview(true);
      } else {
        alert('Failed to create invoice: ' + (response.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Submission Error:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="flex h-screen flex-col overflow-hidden"
      style={{ backgroundColor: COLORS.background }}>
      {/* HEADER */}
      <SalesInvoiceHeader />

      {/* SCROLLABLE CONTENT */}
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
            vendorCode={''} // Not needed for Sales, but prop is required
            storeCode={storeCode}
            onItemsChange={setTableItems}
          />

          <SaleInvoiceFooter ref={footerRef} cashCredit={cashCredit} currentItems={tableItems} />
        </div>
      </div>

      {/* FOOTER SAVE BAR */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-end border-t bg-white px-6 shadow-[0_-6px_10px_-4px_rgba(0,0,0,0.15)]"
        style={{ borderColor: COLORS.borderDark }}>
        <div className="mr-auto text-sm font-medium text-gray-500">
          {tableItems.length} Items | Total:{' '}
          {tableItems.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0).toFixed(2)}
        </div>
        <button
          onClick={handleBottomSaveClick}
          disabled={isSaving}
          className="flex items-center gap-2 rounded px-6 py-2 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
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
            <div className="flex items-center justify-between border-b bg-gray-100 px-4 py-3">
              <h3 className="font-bold text-gray-700">Invoice Generated</h3>
              <button
                onClick={() => setShowBillPreview(false)}
                className="rounded-full bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600">
                <X size={18} />
              </button>
            </div>
            <div className="custom-scrollbar flex-1 overflow-auto bg-gray-50 p-6">
              <InvoiceA4 data={generatedBillData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleReturn;
