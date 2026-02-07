import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Download } from 'lucide-react';
import toast from 'react-hot-toast';

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
  GoodsRecieptNoteLogisticsRef,
} from '../goodsRecieptNote/GoodsRecieptNoteLogistics';

import PurchaseBillInvoice from '../../../../components/invoiceDownload/PurchaseBillInvoice';

import { downloadPdf, getPdfFileName } from '../../../../utils/pdfUtils';

export const sampleInvoiceResponse = {
  success: true,
  message: 'Purchase Bill created successfully',
  data: {
    billNo: 'PB0207',
    billDate: '2026-02-04T00:00:00.000Z',
    store: '00002',
    vendor: '000019',
    items: [
      {
        item: '00001308',
        itemcode: '00001308',
        description: 'SVR Push up Bar',
        batchNo: 'PUR-PB0207-00001308',
        quantity: 10,
        rate: 100,
        amount: 1000,
        netRate: 100,
        netAmount: 0,
        mrp: 150,
        sale_rate: 130,
        wholesale_rate: 120,
        dealer_rate: 115,
        taxable: 1000,
        taxAmount: 50,
        taxRate: '5%',
        itemBarCode: '8901234567890',
        brand: 'TATA',
        _id: '69858184d4a76a23edc7e612',
      },
      {
        item: '00000249',
        itemcode: '00000249',
        description: 'HELIX FOOTBALL SOCKS',
        batchNo: 'PUR-PB0207-00000249',
        quantity: 5,
        rate: 200,
        amount: 1000,
        netRate: 200,
        netAmount: 0,
        mrp: 260,
        sale_rate: 240,
        wholesale_rate: 230,
        dealer_rate: 225,
        taxable: 1000,
        taxAmount: 120,
        taxRate: '12%',
        itemBarCode: '8909876543210',
        brand: 'HUL',
        _id: '69858184d4a76a23edc7e613',
      },
    ],
    type: 'Credit',
    logistics: {
      freight: {
        amount: 500,
        accountCode: '23400002',
      },
      loadingUnloading: {
        amount: 200,
        accountCode: '23400002',
      },
      insurance: {
        amount: 100,
        accountCode: '23400002',
      },
      otherCharges: {
        amount: 50,
        accountCode: '23400002',
      },
      custDuty: {
        amount: 0,
        accountCode: null,
      },
      chaPayment: {
        amount: 0,
        accountCode: null,
      },
      handling: {
        amount: 100,
        accountCode: '23400002',
      },
      docCharges: {
        amount: 50,
        accountCode: '23400002',
      },
      bankCharges: {
        amount: 20,
        accountCode: '23400002',
      },
      custExp: {
        amount: 0,
        accountCode: null,
      },
    },
    gstType: 'GST',
    billingFrom: {
      contactNo: '9876543210',
      gstNo: '09ABCDE1234F1Z5',
      placeOfSupply: 'UP',
      ecommerceInvoiceNo: 'ECOM123',
      fullAddress: 'Noida, UP',
    },
    shippingFrom: {
      fullAddress: 'Warehouse 2, Delhi',
    },
    supplierInvoiceNo: 'SUPINV123',
    supplierInvoiceDate: '2026-02-04T00:00:00.000Z',
    tax: 'Inclusive',
    dueDate: '2026-02-15T00:00:00.000Z',
    paymentTerms: '15 Days',
    email: 'supplier@gmail.com',
    priceCategory: 'Retail',
    payments: [
      {
        ledger: '23400002',
        ledgerName: 'Advance Income - Tax Paid',
        amount: 1000,
        remarks: 'NEFT TXN12345',
      },
    ],
    itemValue: 2000,
    taxableAmount: 1700,
    taxAmount: 170,
    promoDiscount: 100,
    promoDiscount2: 50,
    couponDiscount: 20,
    billDiscount: 30,
    billDiscountPercent: 5,
    adjustment: -10,
    roundOff: 0,
    docAmount: 3150,
    transport: 300,
    remarks: 'Purchase from main supplier',
    paidAmount: '1000',
    _id: '69858184d4a76a23edc7e611',
    createdAt: '2026-02-06T05:52:04.638Z',
    updatedAt: '2026-02-06T05:52:04.638Z',
    __v: 0,
    storeName: 'SPORTS HUB',
    vendorName: 'S.S TRENDY SPORTS',
    netAmount: 3150,
    totalLogistics: 1020,
  },
};

const INITIAL_LOGISTICS_DATA: LogisticsData = {
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
};

const PurchaseBill: React.FC = () => {
  const orderTableRef = useRef<OrderTableRef>(null);
  const formRef = useRef<PurchaseBillFormRef>(null);
  const footerRef = useRef<PurchaseBillFooterRef>(null);
  const logisticsRef = useRef<GoodsRecieptNoteLogisticsRef>(null);
  const [footerExpenseTotal, setFooterExpenseTotal] = useState(0);
  const [grandTotalExpense, setGrandTotalExpense] = useState(0);

  const [cashCredit, setCashCredit] = useState<string>('Credit');
  const [currentVendorCode, setCurrentVendorCode] = useState<string>('');
  const [currentStoreCode, setCurrentStoreCode] = useState<string>('');

  const [isAnalysisOpen, setAnalysisOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const [isShareOpen, setIsShareOpen] = useState(false);

  const [ledgerData, setLedgerData] = useState<LedgerData>({
    employee: '',
    group: '',
  });

  const [logisticsData, setLogisticsData] = useState<LogisticsData>(INITIAL_LOGISTICS_DATA);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [generatedBillData, setGeneratedBillData] = useState<any>(null);
  const [tableItems, setTableItems] = useState<any[]>([]);

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
  useEffect(() => {
    const logisticsTotal = calculateLogisticsTotal(logisticsData);
    const total = logisticsTotal + footerExpenseTotal;

    console.log('💰 EXPENSE UPDATE:');
    console.log('   Logistics Total:', logisticsTotal);
    console.log('   Footer Total:', footerExpenseTotal);
    console.log('   GRAND TOTAL:', total);

    setGrandTotalExpense(total);
    // Ab ye 'grandTotalExpense' seedha Table me prop banke jayega
  }, [logisticsData, footerExpenseTotal]);

  const handleFormChange = (data: any) => {
    if (data.cashCredit) setCashCredit(data.cashCredit);
    if (data.vendorCode !== undefined) setCurrentVendorCode(data.vendorCode);
    if (data.storeCode !== undefined) setCurrentStoreCode(data.storeCode);
  };

  // Footer Expense Change Handler
  const handleFooterExpenseChange = (val: number) => {
    console.log('Footer Expense Changed to:', val);
    setFooterExpenseTotal(val);
  };

  // 2. Helper to calculate total from Logistics Data
  const calculateLogisticsTotal = (data: LogisticsData) => {
    return (
      Number(data.freight || 0) +
      Number(data.loadingUnloading || 0) +
      Number(data.insurance || 0) +
      Number(data.otherCharges || 0) +
      Number(data.custDuty || 0) +
      Number(data.chaPayment || 0) +
      Number(data.handling || 0) +
      Number(data.docCharges || 0) +
      Number(data.bankCharges || 0) +
      Number(data.custExp || 0)
    );
  };

  // onClick={() => toast("Hello World")}
  const handleAnalyzeProfit = async (tableRows: any[]) => {
    if (!tableRows || tableRows.length === 0) {
      // alert('Please add items to the table first.');
      toast.error('Please add items to the table first.', {
        duration: 4000,
        position: 'top-center',
      });

      return;
    }

    const formData = formRef.current?.getFormData();
    const storeId = formData?.storeId;

    if (!storeId) {
      toast.error('Please select a Store in the form.', {
        duration: 4000,
        position: 'top-center',
      });
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
      toast.error(error.message || 'Failed to fetch profit analysis.', {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const handleDownloadPdf = async (billDataToUse: any = null) => {
    const data = billDataToUse || generatedBillData;

    if (!data) {
      toast.error('No bill data available to download.', {
        duration: 4000,
        position: 'top-center',
      });
      return;
    }

    if (!showBillPreview) {
      setShowBillPreview(true);
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

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData = formRef.current?.getFormData();
      const tableSource: any = orderTableRef.current?.getTableData?.();
      const footerData = footerRef.current?.getFooterData() as any;
      const paymentList = footerData?.payments || [];

      if (!formData || !formData.storeCode || !formData.vendorCode) {
        toast.error('Store or Vendor Code is missing.', {
          duration: 4000,
          position: 'top-center',
        });
        return;
      }

      // --- B. CALCULATE TOTAL ITEM VALUE ---
      const rawRows = tableSource?.visibleRows || [];
      let totalItemValue = 0;
      rawRows.forEach((row: any) => {
        const item = row.data || row;
        totalItemValue += Number(item.amount || 0);
      });

      if (footerRef.current) {
        const validation = footerRef.current.validatePayment();

        // This says: "If NOT valid, stop and alert."
        if (!validation.isValid) {
          toast.error(validation.message, {
            duration: 4000,
            position: 'top-center',
          });
          return;
        }
      }
      // --- C. CALCULATE RATIO ---
      const expenseRatio = totalItemValue > 0 ? grandTotalExpense / totalItemValue : 0;

      // --- D. MAP ITEMS ---
      const apiItems = rawRows.map((row: any) => {
        const item = row.data || row;

        // 1. Get Base Rate
        const rate = Number(item.rate || 0);
        const qty = Number(item.qty || 0);

        const taxableAmount = rate * qty;

        const expenseShare = taxableAmount * expenseRatio;

        // 2. Calculate Net Rate (FIX IS HERE)
        const calculatedNetRate = qty > 0 ? (taxableAmount + expenseShare) / qty : rate;
        return {
          itemCode: item.select || item.itemCode || '',
          quantity: Number(item.qty || 0),
          rate: rate,

          // 3. Send Calculated Net Rate
          netRate: Number(calculatedNetRate.toFixed(2)),

          hsn_code: item.hsn || '',

          mrp: Number(item.mrp || 0),
          sale_rate: Number(item.sale_rate || 0),
          wholesale_rate: Number(item.wholesale_rate || 0),
          dealer_rate: Number(item.dealer_rate || 0),
          taxable: Number(item.taxable || 0),
          taxAmount: Number(item.taxAmt || 0),
          taxRate: item.gstRate ? `${item.gstRate}%` : '0%',
          itemBarCode: item.barcode || '',
          brand: item.brand || '',
        };
      });

      const payload = {
        storeCode: formData.storeCode,
        vendorCode: formData.vendorCode,
        billDate: formData.orderDate,
        type: cashCredit,

        remarks: footerData?.remarks || '',

        payments: paymentList,

        netAmount: footerData?.docAmount ?? 0,
        transport: footerData?.transportAmt || 0,
        adjustment: footerData?.adjustmentAmt || 0,
        roundOff: footerData?.roundOff || 0,
        taxAmount: footerData?.taxAmount || 0,

        paidAmount: paymentList.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0),

        billingFrom: {
          contactNo: formData.contactNo || '',
          gstNo: formData.gstNo || '',
          placeOfSupply: formData.placeOfSupply || '',
          ecommerceInvoiceNo: formData.ecommerceInvoiceNo || formData.orderNo || '',
          fullAddress: formData.billToText || '',
        },

        shippingFrom: {
          fullAddress: formData.shipToText || '',
        },

        supplierInvoiceNo: formData.refNo || '',
        supplierInvoiceDate: formData.refDate || formData.orderDate,

        tax: formData.tax,
        dueDate: formData.dueDate,
        paymentTerms: formData.paymentTerms,
        email: formData.email,
        priceCategory: formData.priceCategory,

        items: apiItems,

        logistics: {
          freight: {
            amount: Number(logisticsData.freight) || 0,
            accountCode: logisticsData.freightAccount || '',
          },
          loadingUnloading: {
            amount: Number(logisticsData.loadingUnloading) || 0,
            accountCode: logisticsData.loadingUnloadingAccount || '',
          },
          insurance: {
            amount: Number(logisticsData.insurance) || 0,
            accountCode: logisticsData.insuranceAccount || '',
          },
          otherCharges: {
            amount: Number(logisticsData.otherCharges) || 0,
            accountCode: logisticsData.otherChargesAccount || '',
          },
          custDuty: {
            amount: Number(logisticsData.custDuty) || 0,
            accountCode: logisticsData.custDutyAccount || null,
          },
          chaPayment: {
            amount: Number(logisticsData.chaPayment) || 0,
            accountCode: logisticsData.chaPaymentAccount || null,
          },
          handling: {
            amount: Number(logisticsData.handling) || 0,
            accountCode: logisticsData.handlingAccount || '',
          },
          docCharges: {
            amount: Number(logisticsData.docCharges) || 0,
            accountCode: logisticsData.docChargesAccount || '',
          },
          bankCharges: {
            amount: Number(logisticsData.bankCharges) || 0,
            accountCode: logisticsData.bankChargesAccount || '',
          },
          custExp: {
            amount: Number(logisticsData.custExp) || 0,
            accountCode: logisticsData.custExpAccount || null,
          },
        },

        promoDiscount: footerData?.promoDiscount || 0,
        promoDiscount2: 0,
        couponDiscount: 0,
        billDiscount: footerData?.otherDiscAmt || 0,
        billDiscountPercent: footerData?.otherDiscVal || 0,

        gstType: formData.gstType,
      };

      console.log('✅ SUBMITTED PAYLOAD:', JSON.stringify(payload, null, 2));

      const response = await purchaseBillService.createPurchaseBill(payload as any);
      const finalBillData = response.data?.data || response.data;

      if (finalBillData) {
        toast.success('✅ Invoice Saved Successfully!', {
          duration: 4000,
          position: 'top-center',
        });
        setGeneratedBillData(finalBillData);
        setShowBillPreview(true);

        formRef.current?.resetForm();

        if (orderTableRef.current?.clearTable) {
          orderTableRef.current.clearTable();
        }

        if (footerRef.current?.resetFooter) {
          footerRef.current.resetFooter();
        }

        setTableItems([]);

        logisticsRef.current?.resetLogisticsUI();

        setLogisticsData(INITIAL_LOGISTICS_DATA);
        setLedgerData({ employee: '', group: '' });
      }
    } catch (error) {
      console.error('❌ API ERROR:', error);
      toast.error('Failed to save. Check console for details.', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden" style={{ backgroundColor: COLORS.background }}>
      <PurchaseBillHeader />

      <div className="custom-scrollbar flex-1 overflow-auto px-4 py-3 pb-24">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4">
          <PurchaseBillForm ref={formRef} onFormChange={handleFormChange} />

          <OrderTable
            ref={orderTableRef}
            onAnalyze={handleAnalyzeProfit}
            vendorCode={currentVendorCode}
            onItemsChange={setTableItems}
            storeCode={currentStoreCode}
            totalExpense={grandTotalExpense}
          />

          <PurchaseBillFooter
            ref={footerRef}
            cashCredit={cashCredit}
            currentItems={tableItems}
            onExpenseChange={handleFooterExpenseChange}
          />

          <LedgerAttributes data={ledgerData} onChange={setLedgerData} />

          <GoodsRecieptNoteLogistics
            data={logisticsData}
            ref={logisticsRef}
            onChange={setLogisticsData}
          />
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-end border-t bg-white px-6 shadow-[0_-6px_10px_-4px_rgba(0,0,0,0.15)]"
        style={{ borderColor: COLORS.borderDark }}>
        <div className="flex items-center gap-4">
          <div className="share-dropdown-container relative">
            {/* <button
              onClick={() => setIsShareOpen(!isShareOpen)}
              className="flex items-center gap-2 rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
              <Share2 size={18} />
              Share
              <ChevronUp
                size={16}
                className={`transition-transform duration-200 ${isShareOpen ? 'rotate-180' : ''}`}
              />
            </button> */}

            {isShareOpen && (
              <div className="animate-in fade-in slide-in-from-bottom-2 absolute bottom-full right-0 z-[100] mb-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                <button
                  onClick={() => handleDownloadPdf()}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  <Download size={18} />
                  Download PDF
                </button>
                <div className="h-[1px] bg-gray-100"></div>

                {/* <button
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
                </button> */}
              </div>
            )}
          </div>

          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="z-50 flex items-center gap-2 rounded px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95 disabled:opacity-60"
            style={{ backgroundColor: COLORS.primary || '#0f3c63' }}>
            <Save size={18} />
            {isSubmitting ? 'Saving...' : 'Save & Preview'}
          </button>
        </div>
      </div>

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
                {/* <button
                  onClick={() => handleDownloadPdf(generatedBillData)}
                  className="rounded-full bg-blue-500 p-1.5 text-white transition-colors hover:bg-blue-600"
                  title="Download PDF">
                  <Download size={18} />
                </button> */}

                <button
                  onClick={() => setShowBillPreview(false)}
                  className="rounded-full bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600">
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="custom-scrollbar flex-1 overflow-auto bg-gray-50 p-6">
              <PurchaseBillInvoice
                data={generatedBillData}
                // data={sampleInvoiceResponse.data}
                // onDownload={() => handleDownloadPdf(generatedBillData)}
                // onShareWhatsApp={() => handleShare('whatsapp')}
                // onShareEmail={() => handleShare('email')}
              />
              {/* <PurchaseBillInvoice data={sampleInvoiceResponse.data} /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseBill;
