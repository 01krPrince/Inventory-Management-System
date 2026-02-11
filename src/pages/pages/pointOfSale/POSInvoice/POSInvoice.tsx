import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { COLORS } from '../../../../constants/colors';
import { ToWords } from 'to-words';
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

// Deep clone helper – prevents shared references between tabs
const deepCloneInvoiceData = (data: FullInvoiceData): FullInvoiceData => {
  return JSON.parse(JSON.stringify(data));
};

const POSInvoice: React.FC = () => {
  const [tabs, setTabs] = useState<InvoiceTab[]>([
    {
      id: '1',
      name: 'Invoice #1',
      data: deepCloneInvoiceData(initialInvoiceData),
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [recentlyClosedTabs, setRecentlyClosedTabs] = useState<InvoiceTab[]>([]);

  // Receipt Modal State
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const activeData = (activeTab?.data || initialInvoiceData) as FullInvoiceData;

  // ────────────────────────────────────────────────
  //  Tab Data Update Helpers (stable with useCallback)
  // ────────────────────────────────────────────────
  const updateActiveTabData = useCallback(
    (updater: (prev: FullInvoiceData) => Partial<FullInvoiceData>) => {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === activeTabId
            ? { ...tab, data: { ...tab.data, ...updater(tab.data as FullInvoiceData) } }
            : tab
        )
      );
    },
    [activeTabId]
  );

  const setRowsWrapper = useCallback(
    (val: string[] | ((prev: string[]) => string[])) => {
      updateActiveTabData((prev) => ({
        rows: typeof val === 'function' ? val(prev.rows) : val,
      }));
    },
    [updateActiveTabData]
  );

  const setTableDataWrapper = useCallback(
    (
      val: Record<string, RowData> | ((prev: Record<string, RowData>) => Record<string, RowData>)
    ) => {
      updateActiveTabData((prev) => ({
        tableData: typeof val === 'function' ? val(prev.tableData) : val,
      }));
    },
    [updateActiveTabData]
  );

  const handleItemsUpdated = useCallback(
    (items: PosInvoiceItem[], totals: any) => {
      updateActiveTabData(() => ({
        items,
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
      updateActiveTabData(() => ({ payments }));
    },
    [updateActiveTabData]
  );

  const handleNewTab = useCallback(() => {
    const newId = uuidv4();
    const newName = `Invoice #${tabs.length + 1}`;
    setTabs((prev) => [
      ...prev,
      {
        id: newId,
        name: newName,
        data: deepCloneInvoiceData(initialInvoiceData),
      },
    ]);
    setActiveTabId(newId);
  }, [tabs.length]);

  const handleCopyTab = useCallback(() => {
    if (!activeTab) return;
    const newId = uuidv4();
    const newName = `${activeTab.name} (Copy)`;
    const copiedData = deepCloneInvoiceData(activeTab.data as FullInvoiceData);
    setTabs((prev) => [...prev, { id: newId, name: newName, data: copiedData }]);
    setActiveTabId(newId);
  }, [activeTab]);

  const handleResetTab = useCallback(() => {
    if (!window.confirm('Clear current invoice data? This cannot be undone.')) return;
    updateActiveTabData(() => deepCloneInvoiceData(initialInvoiceData));
  }, [updateActiveTabData]);

  const handleCloseTab = useCallback(
    (e: React.MouseEvent | null, idToClose?: string) => {
      if (e) e.stopPropagation();

      const targetId = idToClose ?? activeTabId;
      if (!targetId) return;

      // Cannot close last remaining tab → reset instead
      if (tabs.length === 1) {
        updateActiveTabData(() => deepCloneInvoiceData(initialInvoiceData));
        return;
      }

      const tabToClose = tabs.find((t) => t.id === targetId);
      if (!tabToClose) return;

      // Remember closed tab (for restore)
      setRecentlyClosedTabs((prev) => [tabToClose, ...prev].slice(0, 5)); // keep last 5

      const remaining = tabs.filter((t) => t.id !== targetId);
      setTabs(remaining);

      // Switch to last tab if we closed the active one
      if (targetId === activeTabId) {
        setActiveTabId(remaining[remaining.length - 1]?.id || '');
      }
    },
    [tabs, activeTabId, updateActiveTabData]
  );

  const handleRestoreTab = useCallback(() => {
    if (recentlyClosedTabs.length === 0) return;

    const [toRestore, ...rest] = recentlyClosedTabs;

    setTabs((prev) => [...prev, toRestore]);
    setActiveTabId(toRestore.id);
    setRecentlyClosedTabs(rest);
  }, [recentlyClosedTabs]);

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

      const totalPaid =
        data.payments?.reduce((sum: number, p: any) => sum + (parseFloat(p.netAmount) || 0), 0) ||
        0;

      // Allow a tiny margin for floating point errors (0.01)
      const leftBalance = docAmount - totalPaid;

      if (leftBalance > 0.01) {
        alert(
          `Payment Incomplete!\n\nTotal Payable: ₹${docAmount.toFixed(2)}\nTotal Paid: ₹${totalPaid.toFixed(2)}\nRemaining Balance: ₹${leftBalance.toFixed(2)}\n\nPlease process the full payment before saving.`
        );
        return; // Stop the execution
      }

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
        group: item.group,
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

      const payload: PosInvoicePayload = {
        store: data.store || '00002',
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

      const response = await PosInvoiceService.createInvoice(payload);
      console.log('✅ API RESPONSE:', response);

      if (response.success && response.data) {
        alert(`Invoice Saved Successfully!`);

        const mappedReceipt = mapApiResponseToReceipt(response.data);
        setReceiptData(mappedReceipt);
        setShowReceipt(true);

        // Reset current tab after successful save
        updateActiveTabData(() => ({
          ...deepCloneInvoiceData(initialInvoiceData),
          billDate: new Date().toISOString().split('T')[0],
        }));
      } else {
        alert(`Failed to save invoice: ${response.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('❌ Error saving invoice:', error);
      const errMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert('Failed to save invoice: ' + errMsg);
    }
  };

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex h-auto flex-col overflow-hidden">
      <POSInvoiceHeader
        tabs={tabs}
        activeTabId={activeTabId}
        onNewTab={handleNewTab}
        onCopyTab={handleCopyTab}
        onDeleteTab={() => handleCloseTab(null, activeTabId)}
        onRestoreTab={handleRestoreTab}
        onResetTab={handleResetTab}
        onSwitchTab={setActiveTabId}
        onCloseSpecificTab={handleCloseTab}
      />

      <div className="flex-1 overflow-auto p-4 pb-5">
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

          <div
            className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-end border-t bg-white px-6 shadow-[0_-6px_10px_-4px_rgba(0,0,0,0.15)]"
            style={{ borderColor: COLORS.borderDark || '#e5e7eb' }}>
            <button
              className="mx-[5vw] flex items-center gap-2 rounded px-6 py-2 text-sm font-bold text-white shadow-md transition-all active:scale-95"
              style={{ backgroundColor: COLORS.primaryLight, color: COLORS.textSecondary }}>
              Run Promotion
            </button>
            <button
              onClick={handleSaveInvoice}
              className="flex items-center gap-2 rounded px-6 py-2 text-sm font-bold text-white shadow-md transition-all active:scale-95"
              style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
              Save Invoice
            </button>
          </div>
        </div>
      </div>

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
