import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { COLORS } from '../../../../constants/colors';
import { ToWords } from 'to-words'; // Ensure this is installed: npm install to-words
import { X } from 'lucide-react';

// Child Components
import POSInvoiceHeader, { InvoiceTab } from './POSInvoiceHeader';
import POSInvoiceForm from './POSInvoiceForm';
import OrderTable from './OrderTable';
import POSInvoiceFooter from './POSInvoiceFooter';
import PosReceipt from '../../../../components/invoiceDownload/PosReceipt';

// Service Imports
import PosInvoiceService, {
  PosInvoiceItem,
  PosInvoicePayload,
} from '../../../../services/pos/posInvoiceService';

// --- HELPER: Map API Response to Receipt Data ---
const mapApiResponseToReceipt = (apiData: any) => {
  const toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: { currency: true, ignoreDecimal: false },
  });

  const totalDiscount =
    (Number(apiData.promoDiscount) || 0) +
    (Number(apiData.couponDiscount) || 0) +
    (Number(apiData.billDiscountAmount) || 0);

  let mode = 'Credit';
  let paidAmount = 0;

  if (apiData.payments && apiData.payments.length > 0) {
    mode = apiData.payments.map((p: any) => p.mode).join(' + ');
    paidAmount = apiData.payments.reduce((acc: number, p: any) => acc + (p.netAmount || 0), 0);
  } else if (apiData.paymentStatus === 'Paid') {
    mode = 'Cash';
    paidAmount = apiData.docAmount;
  }

  const mappedItems = (apiData.items || []).map((item: any, index: number) => ({
    id: index + 1,
    description: item.itemName || item.description || 'Item',
    qty: Number(item.quantity || 0),
    mrp: Number(item.mrp || 0),
    rate: Number(item.rate || 0),
    amount: Number(item.amount || 0),
  }));

  return {
    invoiceNo: apiData.voucherNo || apiData.invoiceNo || 'N/A',
    date: apiData.billDate
      ? new Date(apiData.billDate).toLocaleDateString('en-GB')
      : new Date().toLocaleDateString('en-GB'),
    customerName: apiData.customerName || 'Cash Customer',
    customerPhone: apiData.customerPhone || '',
    items: mappedItems,
    subTotal: Number(apiData.grossAmount || apiData.itemValue || 0),
    promoDiscount: Number(apiData.promoDiscount || 0),
    discount: totalDiscount,
    taxableAmount: Number(apiData.taxableAmount || 0),
    billTotal: Number(apiData.docAmount || 0),
    amountInWords: toWords.convert(Number(apiData.docAmount || 0)),
    tenderMode: mode,
    tenderAmount: paidAmount,
    bankDetails: {
      bankName: 'HDFC BANK',
      ifsc: 'HDFC0001234',
      accountNo: '5020000123456',
    },
    terms: [
      'Goods once sold will not be taken back.',
      'Subject to local jurisdiction.',
      'E. & O.E.',
    ],
  };
};

interface RowData {
  [key: string]: string | number;
}

interface FullInvoiceData {
  rows: string[];
  tableData: Record<string, RowData>;
  store: string;
  billDate: string;
  salesman: string;
  priceCategory: string;
  customerCode: string;
  customerName: string;
  customerPhone: string;
  billingAddress: string;
  shippingAddress: any;
  refNo: string;
  refDate: string;
  gstNo: string;
  deliveryType: string;
  voucherNo: string;
  city: string;
  state: string;
  items: PosInvoiceItem[];
  itemsTotal: { qty: number; amount: number; tax: number; total: number };
  promoDiscount: number;
  promoDiscount2: number;
  couponDiscount: number;
  couponCode: string;
  billDiscountPercent: number;
  billDiscountAmount: number;
  roundOff: number;
  remarks: string;
  payments: any[];
}

const initialInvoiceData: FullInvoiceData = {
  rows: [],
  tableData: {},
  store: '',
  billDate: new Date().toISOString().split('T')[0],
  salesman: '',
  priceCategory: 'Retail',
  customerCode: '',
  customerName: '',
  customerPhone: '',
  billingAddress: '',
  shippingAddress: '',
  refNo: '',
  refDate: '',
  gstNo: '',
  deliveryType: '',
  voucherNo: '',
  city: '',
  state: '',
  items: [],
  itemsTotal: { qty: 0, amount: 0, tax: 0, total: 0 },
  promoDiscount: 0,
  promoDiscount2: 0,
  couponDiscount: 0,
  couponCode: '',
  billDiscountPercent: 0,
  billDiscountAmount: 0,
  roundOff: 0,
  remarks: '',
  payments: [],
};

const POSInvoice: React.FC = () => {
  const [tabs, setTabs] = useState<InvoiceTab[]>([
    { id: '1', name: 'Invoice #1', data: { ...initialInvoiceData } },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [lastClosedTab, setLastClosedTab] = useState<InvoiceTab | null>(null);

  // Receipt Modal State
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const activeData = (activeTab.data || initialInvoiceData) as FullInvoiceData;

  // [FIX] useCallback prevents 'updateActiveTabData' from changing every render
  const updateActiveTabData = useCallback(
    (updater: (prev: FullInvoiceData) => Partial<FullInvoiceData>) => {
      setTabs((prevTabs) =>
        prevTabs.map((tab) => {
          if (tab.id === activeTabId) {
            const currentData = tab.data as FullInvoiceData;
            const updates = updater(currentData);
            return { ...tab, data: { ...currentData, ...updates } };
          }
          return tab;
        })
      );
    },
    [activeTabId]
  );

  // [FIX] Wrappers wrapped in useCallback
  const setRowsWrapper = useCallback(
    (val: string[] | ((prev: string[]) => string[])) => {
      updateActiveTabData((prev) => ({
        rows: typeof val === 'function' ? val(prev.rows) : val,
      }));
    },
    [updateActiveTabData]
  );

  const setTableDataWrapper = useCallback(
    (val: any) => {
      updateActiveTabData((prev) => ({
        tableData: typeof val === 'function' ? val(prev.tableData) : val,
      }));
    },
    [updateActiveTabData]
  );

  // [CRITICAL FIX] This caused the infinite loop. Now it's stable.
  const handleItemsUpdated = useCallback(
    (items: PosInvoiceItem[], totals: any) => {
      updateActiveTabData(() => ({
        items: items,
        itemsTotal: totals,
      }));
    },
    [updateActiveTabData]
  );

  const handleFieldChange = useCallback(
    (field: string, value: any) => {
      updateActiveTabData(() => ({ [field]: value }));
    },
    [updateActiveTabData]
  );

  const handlePaymentUpdate = useCallback(
    (payments: any[]) => {
      updateActiveTabData(() => ({ payments: payments }));
    },
    [updateActiveTabData]
  );

  const handleSaveInvoice = async () => {
    try {
      const data = activeData;

      if (!data.items || data.items.length === 0) {
        alert('Please add items to the invoice before saving.');
        return;
      }

      // 1. Calculate Financials
      const totalDiscount =
        Number(data.promoDiscount || 0) +
        Number(data.promoDiscount2 || 0) +
        Number(data.couponDiscount || 0) +
        Number(data.billDiscountAmount || 0);

      const docAmount = Number(
        (data.itemsTotal.total - totalDiscount + Number(data.roundOff || 0)).toFixed(2)
      );

      // 2. Map Items
      const formattedItems = data.items.map((item) => ({
        item: item.item,
        itemCode: item.itemCode,
        itemName: item.itemName,
        posType: item.posType || 'Sale',
        warranty: typeof item.warranty === 'object' ? item.warranty : { duration: '', price: 0 },
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
        mrp: item.mrp,
        unit: item.unit,
        brand: item.brand,
        barCode: item.barCode,
        hsn: item.hsn,
        taxCode: item.taxCode,
        taxRate: item.taxRate,
        taxAmount: item.taxAmount,
        netRate: item.netRate,
        netAmount: item.netAmount,
        batchNo: item.batchNo || '',
        warehouse: item.warehouse || 'Main Store',
      }));

      // 3. Construct Payload
      const payload: PosInvoicePayload = {
        store: data.store || '00002', // Fallback to ensure not empty
        billDate: new Date(data.billDate).toISOString(),
        salesman: data.salesman || '',
        priceCategory: data.priceCategory || 'Retail',
        customerCode: data.customerCode || '',
        customerName: data.customerName || 'Cash Customer',
        customerPhone: data.customerPhone || '',
        billingAddress: data.billingAddress || '',
        shippingAddress: {
          shipTo: data.customerName || 'Customer',
          fullAddress: data.billingAddress || '',
          state: data.state || '',
          city: data.city || '',
        },
        refNo: data.refNo || '',
        refDate: data.refDate ? new Date(data.refDate).toISOString() : new Date().toISOString(),
        gstNo: data.gstNo || '',
        deliveryType: data.deliveryType || '',
        items: formattedItems,
        itemValue: Number(data.itemsTotal.amount.toFixed(2)),
        grossAmount: Number(data.itemsTotal.total.toFixed(2)),
        promoDiscount: Number(data.promoDiscount || 0),
        promoDiscount2: Number(data.promoDiscount2 || 0),
        couponDiscount: Number(data.couponDiscount || 0),
        couponCode: data.couponCode || '',
        billDiscountPercent: Number(data.billDiscountPercent || 0),
        billDiscountAmount: Number(data.billDiscountAmount || 0),
        taxableAmount: Number(data.itemsTotal.amount.toFixed(2)),
        taxAmount: Number(data.itemsTotal.tax.toFixed(2)),
        roundOff: Number(data.roundOff || 0),
        docAmount: docAmount,
        remarks: data.remarks || '',
        description: 'Counter Sale Invoice',
        ledgerEmployee: 'EMP-001',
        ledgerGroup: 'Sales Account',
        payments: data.payments || [],
      };

      console.log('🚀 SUBMITTING PAYLOAD:', JSON.stringify(payload, null, 2));

      // 4. API Call
      const response = await PosInvoiceService.createInvoice(payload);
      console.log('✅ API RESPONSE:', response);

      if (response.success && response.data) {
        alert(`Invoice Saved Successfully!`);

        // Map Response & Open Modal
        const mappedReceipt = mapApiResponseToReceipt(response.data);
        setReceiptData(mappedReceipt);
        setShowReceipt(true);
      } else {
        alert(`Failed to save invoice: ${response.message}`);
      }
    } catch (error: any) {
      console.error('❌ Error saving invoice:', error);
      // Detailed error alert for debugging 500 errors
      const errMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert('Failed to save invoice: ' + errMsg);
    }
  };

  const handleNewTab = () => {
    const newId = uuidv4();
    setTabs([
      ...tabs,
      { id: newId, name: `Invoice #${tabs.length + 1}`, data: { ...initialInvoiceData } },
    ]);
    setActiveTabId(newId);
  };

  const handleCopyTab = () => {
    if (!activeTab) return;
    const newId = uuidv4();
    setTabs([
      ...tabs,
      {
        id: newId,
        name: `${activeTab.name} (Copy)`,
        data: JSON.parse(JSON.stringify(activeTab.data)),
      },
    ]);
    setActiveTabId(newId);
  };

  const handleDeleteTab = () => handleCloseSpecificTab(null, activeTabId);

  const handleCloseSpecificTab = (e: React.MouseEvent | null, idToClose: string) => {
    if (e) e.stopPropagation();
    if (tabs.length === 1) {
      updateActiveTabData(() => ({ ...initialInvoiceData }));
      return;
    }
    const tabToClose = tabs.find((t) => t.id === idToClose);
    if (tabToClose) setLastClosedTab(tabToClose);
    const newTabs = tabs.filter((t) => t.id !== idToClose);
    setTabs(newTabs);
    if (idToClose === activeTabId) setActiveTabId(newTabs[newTabs.length - 1].id);
  };

  const handleRestoreTab = () => {
    if (!lastClosedTab) return;
    setTabs([...tabs, lastClosedTab]);
    setActiveTabId(lastClosedTab.id);
    setLastClosedTab(null);
  };

  const handleResetTab = () => {
    if (window.confirm('Are you sure you want to clear the current invoice?')) {
      updateActiveTabData(() => ({ ...initialInvoiceData }));
    }
  };

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex min-h-screen flex-col overflow-hidden">
      <POSInvoiceHeader
        tabs={tabs}
        activeTabId={activeTabId}
        onNewTab={handleNewTab}
        onCopyTab={handleCopyTab}
        onDeleteTab={handleDeleteTab}
        onRestoreTab={handleRestoreTab}
        onResetTab={handleResetTab}
        onSwitchTab={setActiveTabId}
        onCloseSpecificTab={handleCloseSpecificTab}
      />

      <div className="flex-1 overflow-auto p-4 pb-24">
        {' '}
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
          <POSInvoiceForm data={activeData} onChange={handleFieldChange} />

          <OrderTable
            rows={activeData.rows}
            setRows={setRowsWrapper}
            tableData={activeData.tableData}
            setTableData={setTableDataWrapper}
            onItemsUpdated={handleItemsUpdated}
          />

          <POSInvoiceFooter
            data={activeData}
            totals={activeData.itemsTotal}
            onChange={handleFieldChange}
            onPaymentUpdate={handlePaymentUpdate}
          />

          {/* <div className="flex justify-end">
            <button
              onClick={handleSaveInvoice}
              className="rounded bg-green-600 px-6 py-2 font-bold text-white shadow transition-colors hover:bg-green-700">
              Save Invoice
            </button>
          </div> */}

          <div
            className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-end border-t bg-white px-6 shadow-[0_-6px_10px_-4px_rgba(0,0,0,0.15)]"
            style={{ borderColor: COLORS.borderDark || '#e5e7eb' }}>
            <button
              onClick={handleSaveInvoice}
              className="flex items-center gap-2 rounded bg-green-600 px-6 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg active:scale-95">
              Save Invoice
            </button>
          </div>
        </div>
      </div>

      {/* --- RECEIPT MODAL --- */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] flex-col items-center overflow-hidden rounded-lg bg-white p-2 shadow-2xl">
            <div className="mb-2 flex w-full items-center justify-between border-b px-2 pb-2">
              <h3 className="font-bold text-gray-700">Receipt Preview</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="rounded bg-blue-600 px-4 py-1 text-sm font-bold text-white hover:bg-blue-700">
                  Print
                </button>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="rounded bg-red-500 p-1 text-white hover:bg-red-600">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="custom-scrollbar flex-1 overflow-auto border border-gray-200">
              <PosReceipt data={receiptData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSInvoice;
