import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Share2, Mail, MessageCircle, ChevronUp, Download } from 'lucide-react';

import PurchaseBillHeader from './PurchaseBillHeader';
import PurchaseBillForm, { PurchaseBillFormRef } from './PurchaseBillForm';
import OrderTable, { OrderTableRef } from './OrderTable';
import PurchaseBillFooter, { PurchaseBillFooterRef } from './PurchaseBillFooter';
import { COLORS } from '../../../../constants/colors';

import purchaseBillService from '../../../../services/purchase/purchaseBill';
import { fetchProfitAnalysis } from '../../../../services/analysis/profitService';
import ProfitAnalysisModal from '../../../../components/ProfitAnalysisModal';

import LedgerAttributes, { LedgerData } from '../../../../components/LedgerAttributes';

import GoodsRecieptNoteLogistics, {
  LogisticsData,
} from '../goodsRecieptNote/GoodsRecieptNoteLogistics';

import PurchaseBillInvoice from '../../../../components/invoiceDownload/PurchaseBillInvoice';

// Import Utils
import { downloadPdf, getPdfFileName } from '../../../../utils/pdfUtils';

const PurchaseBill: React.FC = () => {
  // --- Refs ---
  const orderTableRef = useRef<OrderTableRef>(null);
  const formRef = useRef<PurchaseBillFormRef>(null);
  const footerRef = useRef<PurchaseBillFooterRef>(null);

  // --- State ---
  const [cashCredit, setCashCredit] = useState<string>('Credit');
  const [currentVendorCode, setCurrentVendorCode] = useState<string>('');
  const [currentStoreCode, setCurrentStoreCode] = useState<string>('');

  const [isAnalysisOpen, setAnalysisOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  // Share Dropdown State
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [ledgerData, setLedgerData] = useState<LedgerData>({
    employee: '',
    group: '',
  });

  const [logisticsData, setLogisticsData] = useState<LogisticsData>({
    destination: '',
    shippingMode: 'Road',
    shippingCompany: '',
    shippingCompanyAddress: '',
    shippingTrackingNo: '',
    shippingDate: new Date().toISOString().split('T')[0],
    shippingCharges: '0',
    vehicleNo: '',
    chargeType: 'Paid',
    documentThrough: '',
    portOfLanding: '',
    portOfDischarge: '',
    noOfPackets: '0',
    weight: '0',
    portAddressForEway: '',
    portStateForEway: '',
    distance: '',
    ewayInvoiceNo: '',
    ewayInvoiceDate: '',
    ewayCancelDate: '',
    irnNo: '',
    qrCode: '',
    irnCancelDate: '',
    irnCancelReason: '',
    ackNo: '',
    ackDate: '',
    billOfEntryNum: '',
    billOfEntryDate: '',

    // --- Expenses Initial State ---
    custDuty: '0.00',
    custDutyAccount: '',
    chaPayment: '0.00',
    chaPaymentAccount: '',
    freight: '0.00',
    freightAccount: '',
    insurance: '0.00',
    insuranceAccount: '',
    handling: '0.00',
    handlingAccount: '',
    docCharges: '0.00',
    docChargesAccount: '',
    bankCharges: '0.00',
    bankChargesAccount: '',
    custExp: '0.00',
    custExpAccount: '',
    loadingUnloading: '0.00',
    loadingUnloadingAccount: '',
    otherCharges: '0.00',
    otherChargesAccount: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [generatedBillData, setGeneratedBillData] = useState<any>(null);
  const [tableItems, setTableItems] = useState<any[]>([]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.share-dropdown-container')) {
        setIsShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormChange = (data: any) => {
    if (data.cashCredit) {
      setCashCredit(data.cashCredit);
    }
    if (data.vendorCode !== undefined) {
      setCurrentVendorCode(data.vendorCode);
    }
    if (data.storeCode !== undefined) {
      setCurrentStoreCode(data.storeCode);
    }
  };

  const handleAnalyzeProfit = async (tableRows: any[]) => {
    if (!tableRows || tableRows.length === 0) {
      alert('Please add items to the table first.');
      return;
    }

    const formData = formRef.current?.getFormData();
    const storeId = formData?.storeId;

    if (!storeId) {
      alert('Please select a Store in the form.');
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

  const handleDownloadPdf = async (billDataToUse: any = null) => {
    // Priority: Passed Argument > State > Error
    const data = billDataToUse || generatedBillData;

    if (!data) {
      alert('No bill data available to download.');
      return;
    }

    // Ensure the Modal is actually open so the Element ID exists in the DOM
    if (!showBillPreview) {
      setShowBillPreview(true);
      // Small delay to let React render the modal before grabbing the ID
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const gstType = formRef.current?.getFormData().gstType || 'PurchaseBill';
    const fileName = getPdfFileName(gstType, data.billNo);

    await downloadPdf({
      elementId: 'printable-invoice-area',
      fileName: fileName,
      format: 'A4',
    });
  };

  // --- Share Handler ---
  const handleShare = async (method: 'whatsapp' | 'email') => {
    if (!generatedBillData) {
      alert('Please save the bill first.');
      return;
    }

    // 1. Download the file
    await handleDownloadPdf(generatedBillData);

    const billNo = generatedBillData.billNo;
    const vendor = generatedBillData.vendorDetails?.vend_name || 'Vendor';
    const amount = generatedBillData.docAmount;
    const message = `Hello, Please find attached the Purchase Bill ${billNo} from ${vendor} for Amount ${amount}.`;

    // 2. Instructions for the user (Cleaner Message)
    const proceed = window.confirm(
      `File downloaded successfully!\n\nNext Step: We will open ${method === 'whatsapp' ? 'WhatsApp' : 'Email'}.\n\nPlease drag and drop the downloaded PDF into the chat/email to send it.\n\nProceed?`
    );

    if (!proceed) {
      setIsShareOpen(false);
      return;
    }

    // 3. Open the App
    if (method === 'whatsapp') {
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } else if (method === 'email') {
      const subject = `Purchase Bill - ${billNo}`;
      const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }

    setIsShareOpen(false);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData = formRef.current?.getFormData();
      const tableSource: any = orderTableRef.current?.getTableData?.();
      const footerData = footerRef.current?.getFooterData();

      if (!formData) {
        alert('Form data is missing');
        return;
      }
      if (!formData.storeCode || !formData.vendorCode) {
        alert('Store or Vendor Code is missing.');
        return;
      }
      const rawRows = tableSource?.visibleRows || [];
      if (rawRows.length === 0) {
        alert('Please add at least one item.');
        return;
      }

      const apiItems = rawRows.map((row: any) => {
        const item = row.data || row;
        return {
          ...item,
          itemCode: item.select || item.itemCode || '',
          quantity: Number(item.qty || 0),
          rate: Number(item.rate || 0),
          mrp: Number(item.mrp || 0),
          amount: Number(item.amount || 0),
          sale_rate: Number(item.sale_rate || 0),
          wholesale_rate: Number(item.wholesale_rate || 0),
          dealer_rate: Number(item.dealer_rate || 0),
          gstRate: Number(item.gstRate || 0),
          taxable: Number(item.taxable || 0),
          taxAmt: Number(item.taxAmt || 0),
          taxAmount: Number(item.taxAmt || 0),
          netRate: Number(item.netRate || 0),
        };
      });

      const payload = {
        billDate: formData.orderDate || new Date().toISOString().split('T')[0],
        storeCode: formData.storeCode,
        vendorCode: formData.vendorCode,
        remarks: footerData?.remarks || 'Purchase Bill',
        cashCredit: cashCredit,
        gstType: formData.gstType,

        receivedAmount: footerData?.receivedAmount || 0,
        cashBankLedger: footerData?.cashBankLedger || '',

        itemValue: footerData?.itemValue || 0,
        billDiscount: footerData?.otherDiscAmt || 0,
        taxable: footerData?.taxable || 0,
        taxAmount: footerData?.taxAmount || 0,
        roundOff: footerData?.roundOff || 0,
        netAmount: footerData?.docAmount || 0,
        adjustment: footerData?.adjustmentAmt || 0,
        transport: footerData?.transportAmt || 0,
        billDiscountPercent: footerData?.otherDiscVal || 0,
        promoDiscount: 0,

        items: apiItems,

        logistics: {
          custDuty: {
            amount: Number(logisticsData.custDuty) || 0,
            accountCode: logisticsData.custDutyAccount || null,
          },
          chaPayment: {
            amount: Number(logisticsData.chaPayment) || 0,
            accountCode: logisticsData.chaPaymentAccount || null,
          },
          freight: {
            amount: Number(logisticsData.freight) || 0,
            accountCode: logisticsData.freightAccount || null,
          },
          insurance: {
            amount: Number(logisticsData.insurance) || 0,
            accountCode: logisticsData.insuranceAccount || null,
          },
          handling: {
            amount: Number(logisticsData.handling) || 0,
            accountCode: logisticsData.handlingAccount || null,
          },
          docCharges: {
            amount: Number(logisticsData.docCharges) || 0,
            accountCode: logisticsData.docChargesAccount || null,
          },
          bankCharges: {
            amount: Number(logisticsData.bankCharges) || 0,
            accountCode: logisticsData.bankChargesAccount || null,
          },
          custExp: {
            amount: Number(logisticsData.custExp) || 0,
            accountCode: logisticsData.custExpAccount || null,
          },
          loadingUnloading: {
            amount: Number(logisticsData.loadingUnloading) || 0,
            accountCode: logisticsData.loadingUnloadingAccount || null,
          },
          otherCharges: {
            amount: Number(logisticsData.otherCharges) || 0,
            accountCode: logisticsData.otherChargesAccount || null,
          },
        },
      };

      console.log('🚀 Request Payload:', payload);

      const response = await purchaseBillService.createPurchaseBill(payload as any);
      const responseData = response.data;

      // Handle nested data if necessary (e.g., responseData.data)
      const finalBillData = responseData.data || responseData;

      if (finalBillData) {
        setGeneratedBillData(finalBillData);
        setShowBillPreview(true);

        // --- NEW: Notification Logic ---
        setTimeout(() => {
          const userWantsToShare = window.confirm(
            'Purchase Bill created successfully!\n\nDo you want to save and share this bill?'
          );

          if (userWantsToShare) {
            // 1. Auto Download
            handleDownloadPdf(finalBillData);
            // 2. Open Share Menu
            setIsShareOpen(true);
          }
        }, 1000); // 1s delay to ensure the invoice modal is fully rendered
      }
    } catch (error) {
      console.error('❌ API ERROR:', error);
      alert('Failed to save. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden" style={{ backgroundColor: COLORS.background }}>
      {/* HEADER */}
      <PurchaseBillHeader />

      {/* CONTENT AREA */}
      <div className="custom-scrollbar flex-1 overflow-auto px-4 py-3 pb-24">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4">
          {/* Step 1: Form */}
          <PurchaseBillForm ref={formRef} onFormChange={handleFormChange} />

          {/* Step 2: Table */}
          <OrderTable
            ref={orderTableRef}
            onAnalyze={handleAnalyzeProfit}
            vendorCode={currentVendorCode}
            onItemsChange={setTableItems}
            storeCode={currentStoreCode}
          />

          <PurchaseBillFooter ref={footerRef} cashCredit={cashCredit} currentItems={tableItems} />

          <LedgerAttributes data={ledgerData} onChange={setLedgerData} />

          <GoodsRecieptNoteLogistics data={logisticsData} onChange={setLogisticsData} />
        </div>
      </div>

      {/* FIXED BOTTOM FOOTER */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-end border-t bg-white px-6 shadow-[0_-6px_10px_-4px_rgba(0,0,0,0.15)]"
        style={{ borderColor: COLORS.borderDark }}>
        {/* Right: Share & Save */}
        <div className="flex items-center gap-4">
          {/* Share Dropdown */}
          <div className="share-dropdown-container relative">
            <button
              onClick={() => setIsShareOpen(!isShareOpen)}
              className="flex items-center gap-2 rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
              <Share2 size={18} />
              Share
              <ChevronUp
                size={16}
                className={`transition-transform duration-200 ${isShareOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isShareOpen && (
              <div className="animate-in fade-in slide-in-from-bottom-2 absolute bottom-full right-0 z-[100] mb-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                {/* NEW: Download Option */}
                <button
                  onClick={() => handleDownloadPdf()}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  <Download size={18} />
                  Download PDF
                </button>
                <div className="h-[1px] bg-gray-100"></div>

                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700">
                  <MessageCircle size={18} />
                  Share on WhatsApp
                </button>
                <div className="h-[1px] bg-gray-100"></div>

                <button
                  onClick={() => handleShare('email')}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700">
                  <Mail size={18} />
                  Share on Email
                </button>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="z-50 flex items-center gap-2 rounded px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95 disabled:opacity-60"
            style={{ backgroundColor: COLORS.primary || '#0f3c63' }} // Fallback if COLORS.primary undefined
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : 'Save & Preview'}
          </button>
        </div>
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
              <h3 className="font-bold text-gray-700">Purchase Bill Generated</h3>
              <div className="flex items-center gap-2">
                {/* NEW: Download Button in Header */}
                <button
                  onClick={() => handleDownloadPdf(generatedBillData)}
                  className="rounded-full bg-blue-500 p-1.5 text-white transition-colors hover:bg-blue-600"
                  title="Download PDF">
                  <Download size={18} />
                </button>

                <button
                  onClick={() => setShowBillPreview(false)}
                  className="rounded-full bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600">
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="custom-scrollbar flex-1 overflow-auto bg-gray-50 p-6">
              {/* Ensure this component contains the id="printable-invoice-area" */}
              <PurchaseBillInvoice
                data={generatedBillData}
                onDownload={() => handleDownloadPdf(generatedBillData)}
                onShareWhatsApp={() => handleShare('whatsapp')}
                onShareEmail={() => handleShare('email')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseBill;
