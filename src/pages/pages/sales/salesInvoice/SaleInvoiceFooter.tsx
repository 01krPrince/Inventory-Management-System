import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { EditIcon, TrashIcon } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import Attachment from '../../../../components/Attachment';
import Dropdown, { ColumnDef } from '../../../../components/Dropdown';
import ChartOfAccounts from '../../../../components/ChartOfAccount';
import { SalesAndPurchaseGL } from '../../../../components/addItemMaster/api/saleAndPurchaseGL';
import chartOfAccountService from '../../../../services/chartOfAccountService';

export interface SaleInvoiceFooterRef {
  getFooterData: () => {
    remarks: string;
    receivedAmount: number;
    cashBankLedger: string;
    itemValue: number;
    discount1: number;
    discount2: number;
    // promoDiscount: number;
    taxable: number;
    taxAmount: number;
    transportVal: number;
    transportAmt: number;
    otherDiscVal: number;
    otherDiscAmt: number;
    adjustmentVal: number;
    adjustmentAmt: number;
    roundOff: number;
    docAmount: number;
    promoDiscount: number;
    payments: Array<{
      ledger: string;
      amount: number;
      remarks: string;
    }>;
  };
  resetFooter: () => void;

  validatePayment: () => { isValid: boolean; message: string };
}

type InvoiceFooterProps = {
  amount?: number;
  cashCredit?: string;
  currentItems?: any[];
  onExpenseChange?: (totalExpense: number) => void;
};

interface GlOption {
  _id: string;
  name: string;
  code: string;
  type?: string;
  underGroup: string;
  nature: string;
  label: string;
  value: string;
  underGroupCode?: string;
}

const glColumns: ColumnDef<any>[] = [
  { header: 'Code', key: 'code', width: 'w-1/5' },
  { header: 'Name', key: 'name', width: 'w-2/5' },
  { header: 'Group', key: 'underGroup', width: 'auto' },
];

const SaleInvoiceFooter = forwardRef<SaleInvoiceFooterRef, InvoiceFooterProps>(
  ({  currentItems, onExpenseChange }, ref) => {
    const remarksRef = useRef<HTMLTextAreaElement>(null);

    const itemValueRef = useRef<HTMLInputElement>(null);
    const discount1Ref = useRef<HTMLInputElement>(null);
    const discount2Ref = useRef<HTMLInputElement>(null);
    const taxableRef = useRef<HTMLInputElement>(null);
    const taxAmountRef = useRef<HTMLInputElement>(null);
    const roundOffRef = useRef<HTMLInputElement>(null);
    const docAmountRef = useRef<HTMLInputElement>(null);

    const transportValRef = useRef<HTMLInputElement>(null);
    const transportAmtRef = useRef<HTMLInputElement>(null);
    const otherDiscValRef = useRef<HTMLInputElement>(null);
    const otherDiscAmtRef = useRef<HTMLInputElement>(null);
    const adjustmentValRef = useRef<HTMLInputElement>(null);
    const adjustmentAmtRef = useRef<HTMLInputElement>(null);
    const promoDiscountRef = useRef<HTMLInputElement>(null);

    const [glOptions, setGlOptions] = useState<GlOption[]>([]);
    const [selectedLedger, setSelectedLedger] = useState<string>('Cash In Hand');
    const [showChartOfAccounts, setShowChartOfAccounts] = useState(false);
    const [coaFormData, setCoaFormData] = useState<SalesAndPurchaseGL | null>(null);

    // --- PAYMENT STATES ---
    const [payments, setPayments] = useState<{ ledger: string; amount: number; remarks: string }[]>(
      []
    );
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [totalDocAmount, setTotalDocAmount] = useState<number>(0);

    // --- CALCULATE BALANCE ---
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    // Use toFixed(2) to prevent floating point errors (e.g. 0.00000001)
    const remainingBalance = parseFloat((totalDocAmount - totalPaid).toFixed(2));

    // --- AUTO FILL AMOUNT ---
    useEffect(() => {
      if (remainingBalance > 0) {
        setPaymentAmount(remainingBalance);
      } else {
        setPaymentAmount(0);
      }
    }, [remainingBalance]);

    // --- CALCULATION LOGIC ---
    const calculateFinalDocAmount = () => {
      console.group('🧮 Final Doc Amount Calculation');

      const getVal = (ref: React.RefObject<HTMLInputElement | null>, _: string) => {
        const val = Number(ref.current?.value || 0);
        return val;
      };

      const taxable = getVal(taxableRef, 'Taxable');
      const tax = getVal(taxAmountRef, 'Tax Amount');
      const transport = getVal(transportAmtRef, 'Transport Amt');
      const otherDisc = getVal(otherDiscAmtRef, 'Other Disc Amt');
      const adjustment = getVal(adjustmentAmtRef, 'Adjustment Amt');
      const roundOff = getVal(roundOffRef, 'Round Off');

      const finalTotal = taxable + tax + transport + adjustment + roundOff - otherDisc;

      if (docAmountRef.current) {
        docAmountRef.current.value = finalTotal.toFixed(2);
      }

      if (onExpenseChange) {
       // Sum up what you consider "Extra Expense" for Net Rate calculation
       // Usually: Transport + Adjustment (Discount usually reduces rate, but depends on your logic)
       const totalExpense = transport + adjustment; // Add/Remove fields as per your logic
       onExpenseChange(totalExpense);
    }

      setTotalDocAmount(finalTotal);

      console.groupEnd();
    };

    useEffect(() => {
      const calculateFooterTotals = () => {
        console.group('🧾 Footer Items Processing (INCLUSIVE LOGIC)');

        if (!currentItems || currentItems.length === 0) {
          console.warn('No items found to process.');
          console.groupEnd();
          return;
        }

        let totalItemValue = 0;
        let totalTaxable = 0;
        let totalTaxAmount = 0;

        currentItems.forEach((row: any, index: number) => {
          const item = row.data || row;
          console.log(index);
          const qty = Number(item.qty || 0);
          const rate = Number(item.rate || 0);
          const amount = Number(item.amount || qty * rate);
          const gstRate = Number(item.gstRate || 0);

          const itemTaxable = amount / (1 + gstRate / 100);
          const itemTax = amount - itemTaxable;

          totalItemValue += amount;
          totalTaxable += itemTaxable;
          totalTaxAmount += itemTax;
        });

        if (itemValueRef.current) itemValueRef.current.value = totalItemValue.toFixed(2);
        if (taxableRef.current) taxableRef.current.value = totalTaxable.toFixed(2);
        if (taxAmountRef.current) taxAmountRef.current.value = totalTaxAmount.toFixed(2);

        console.groupEnd();
        calculateFinalDocAmount();
      };

      calculateFooterTotals();
    }, [currentItems]);

    useEffect(() => {
      const loadData = async () => {
        try {
          const coaResponse = await chartOfAccountService.getAllChartOfAccounts();
          const rawData = coaResponse.data;

          if (Array.isArray(rawData)) {
            const mappedOptions = rawData.map((item: any) => ({
              ...item,
              name: item.name || '',
              code: item.code || item.identification || 'N/A',
              underGroup:
                typeof item.underGroup === 'object' ? item.underGroup?.name : item.underGroup || '',
              nature: item.nature || 'N/A',
              label: item.name,
              value: item._id,
              type: item.type,
            }));

            const filtered = mappedOptions.filter(
              (item: any) => item.type === 'Bank' || item.type === 'Cash'
            );

            setGlOptions(filtered);
          }
        } catch (error) {
          console.error('❌ Failed to load chart of accounts:', error);
        }
      };
      loadData();
    }, []);

    useImperativeHandle(ref, () => ({
      getFooterData: () => {
        return {
          remarks: remarksRef.current?.value || '',
          receivedAmount: paymentAmount,
          cashBankLedger: selectedLedger,

          payments,

          itemValue: parseFloat(itemValueRef.current?.value || '0'),
          discount1: parseFloat(discount1Ref.current?.value || '0'),
          discount2: parseFloat(discount2Ref.current?.value || '0'),
          promoDiscount: parseFloat(promoDiscountRef.current?.value || '0'),
          taxable: parseFloat(taxableRef.current?.value || '0'),
          taxAmount: parseFloat(taxAmountRef.current?.value || '0'),
          transportVal: parseFloat(transportValRef.current?.value || '0'),
          transportAmt: parseFloat(transportAmtRef.current?.value || '0'),
          otherDiscVal: parseFloat(otherDiscValRef.current?.value || '0'),
          otherDiscAmt: parseFloat(otherDiscAmtRef.current?.value || '0'),
          adjustmentVal: parseFloat(adjustmentValRef.current?.value || '0'),
          adjustmentAmt: parseFloat(adjustmentAmtRef.current?.value || '0'),
          roundOff: parseFloat(roundOffRef.current?.value || '0'),
          docAmount: parseFloat(docAmountRef.current?.value || '0'),
        };
      },
      resetFooter: () => {
        setPayments([]);
        setPaymentAmount(0);
        setSelectedLedger('Cash In Hand');

        setTotalDocAmount(0);

        const resetRef = (ref: React.RefObject<HTMLInputElement | null>, val: string = '0.00') => {
          if (ref.current) ref.current.value = val;
        };

        if (remarksRef.current) remarksRef.current.value = '';

        resetRef(itemValueRef);
        resetRef(discount1Ref);
        resetRef(discount2Ref);
        resetRef(promoDiscountRef);
        resetRef(taxableRef);
        resetRef(taxAmountRef);

        resetRef(transportAmtRef);
        resetRef(otherDiscAmtRef);
        resetRef(adjustmentAmtRef);
        resetRef(roundOffRef);

        resetRef(docAmountRef);
      },
      validatePayment: () => {
    // We use a small tolerance (0.01) to avoid issues with tiny decimal differences
    if (remainingBalance > 0.01) {
      return { 
        isValid: false, 
        message: `Outstanding Balance of ₹${remainingBalance.toFixed(2)} remains. Please add the payment.` 
      };
    }
    
    // Optional: Check if the user typed an amount but forgot to click "ADD"
    if (paymentAmount > 0 && payments.length === 0) {
       return {
         isValid: false,
         message: `You entered ₹${paymentAmount} but didn't click the 'ADD +' button.`
       };
    }

    return { isValid: true, message: '' };
  }
    }));

    const handleOpenCOA = () => {
      const selectedItem = glOptions.find((item) => item.name === selectedLedger);

      const dataToSet =
        (selectedItem as unknown as SalesAndPurchaseGL) ||
        ({ name: selectedLedger } as SalesAndPurchaseGL);

      setCoaFormData(dataToSet);
      setShowChartOfAccounts(true);
    };

    const handleSaveCOA = (savedData: SalesAndPurchaseGL) => {
      if (savedData?.name) {
        setSelectedLedger(savedData.name);
        window.location.reload();
      }
      setShowChartOfAccounts(false);
    };

    const ActionBtn = ({ onClick, icon }: any) => (
      <button
        type="button"
        onClick={onClick}
        className="z-10 ml-[-1px] flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-sm text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: COLORS.primary, borderColor: COLORS.primary }}>
        {icon}
      </button>
    );

    const handleAddNew = () => {
      const selectedGl = glOptions.find((opt) => opt.name === selectedLedger);

      if (!selectedGl || paymentAmount <= 0) return;

      const newPayment = {
        ledger: selectedGl.code,
        amount: paymentAmount,
        remarks: selectedGl.name,
      };

      setPayments((prev) => [...prev, newPayment]);
    };

    return (
      <div
        className="w-full border-t p-4 font-sans text-sm"
        style={{ backgroundColor: COLORS.white }}>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            {/* Remarks Section */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <label
                className="mt-1 w-32 text-xs font-medium"
                style={{ color: COLORS.textPrimary }}>
                Remarks
              </label>
              <div className="relative flex-1">
                <textarea
                  ref={remarksRef}
                  className="custom-input h-20 w-full resize-none rounded-sm border p-2 text-xs outline-none"
                  placeholder="Enter remarks here..."
                  style={{
                    borderColor: COLORS.borderDark,
                    color: COLORS.textPrimary,
                  }}
                />
              </div>
            </div>

            {/* --- PAYMENT LIST DISPLAY (Shows only if payments exist) --- */}
            {payments.length > 0 && (
              <div className="mt-2 rounded border border-gray-200">
                <div className="grid grid-cols-[2fr_1fr_80px] bg-gray-100 p-2 text-xs font-semibold">
                  <div>Ledger</div>
                  <div className="text-right">Amount</div>
                  <div className="text-center">Action</div>
                </div>
                {payments.map((p, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[2fr_1fr_80px] items-center border-t p-2 text-xs">
                    <div>{p.remarks}</div>
                    <div className="text-right font-medium">₹ {p.amount.toFixed(2)}</div>
                    <div className="text-center">
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setPayments((prev) => prev.filter((_, i) => i !== index))}>
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {/* Total Paid Footer in the list */}
                <div className="grid grid-cols-[2fr_1fr_80px] border-t bg-gray-50 p-2 text-xs font-bold text-gray-700">
                  <div className="pr-2 text-right">Total Paid:</div>
                  <div className="text-right">₹ {totalPaid.toFixed(2)}</div>
                  <div></div>
                </div>
              </div>
            )}

            {/* --- PAYMENT INPUT ROW (Only Visible if Balance > 0) --- */}
            {remainingBalance > 0 && (
              <div className="flex flex-col gap-2 rounded border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-end">
                {/* Ledger Selection */}
                <div className="min-w-[200px] flex-1">
                  <label className="mb-1 block text-[11px] font-medium text-gray-500">
                    Select Payment Mode
                  </label>
                  <div className="flex items-center gap-1">
                    <div className="flex-1">
                      <Dropdown
                        data={glOptions}
                        columns={glColumns}
                        value={selectedLedger}
                        valueKey="name"
                        placeholder="Select Ledger..."
                        onChange={(item) => setSelectedLedger(item?.name || '')}
                      />
                    </div>
                    <ActionBtn icon={<EditIcon size={14} />} onClick={handleOpenCOA} />
                  </div>
                </div>

                {/* Amount Input */}
                <div className="w-[120px]">
                  <label className="mb-1 block w-auto text-[11px] font-medium text-gray-500">
                    Amount ({remainingBalance.toFixed(2)} left)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                    placeholder="Amount"
                    value={paymentAmount}
                    // Prevent negative input typing
                    min="0"
                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>

                {/* Add Button */}
                <button
                  type="button"
                  className="h-[34px] rounded bg-green-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-green-700 active:translate-y-[1px]"
                  onClick={handleAddNew}>
                  ADD +
                </button>
              </div>
            )}

            {/* Attachment */}
            <div className="mt-2 flex flex-col gap-4 sm:flex-row">
              <label
                className="w-32 pt-2 text-xs font-medium"
                style={{ color: COLORS.textPrimary }}>
                Attachment
              </label>
              <div className="flex-1">
                <Attachment />
              </div>
            </div>
          </div>

          {/* --- RIGHT SECTION (Totals) --- */}
          <div className="flex w-full flex-col gap-2 lg:w-[400px]">
            <TotalRow label="Item Value" inputRef={itemValueRef} defaultValue="0.00" />
            <TotalRow label="Discount" inputRef={discount1Ref} defaultValue="0.00" />
            <TotalRow label="Discount" inputRef={discount2Ref} defaultValue="0.00" />
            <TotalRow label="Taxable" inputRef={taxableRef} defaultValue="0.00" />
            <TotalRow label="Tax Amount" inputRef={taxAmountRef} defaultValue="0.00" />

            {/* Split Rows */}
            <SplitTotalRow
              label="Transport"
              amtRef={transportAmtRef}
              taxableRef={taxableRef}
              onUpdate={calculateFinalDocAmount}
            />
            <SplitTotalRow
              label="Discount"
              amtRef={otherDiscAmtRef}
              taxableRef={taxableRef}
              onUpdate={calculateFinalDocAmount}
            />
            <SplitTotalRow
              label="Adjustment"
              amtRef={adjustmentAmtRef}
              taxableRef={taxableRef}
              onUpdate={calculateFinalDocAmount}
            />

            {/* Round Off */}
            <div className="grid grid-cols-[1fr_120px] items-center gap-2">
              <label className="text-xs" style={{ color: COLORS.textSecondary }}>
                Round Off
              </label>
              <div className="relative">
                <span
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: COLORS.textMuted }}>
                  ₹
                </span>
                <input
                  ref={roundOffRef}
                  type="text"
                  defaultValue="0.00"
                  onChange={calculateFinalDocAmount}
                  className="w-full rounded-sm border py-1 pl-5 pr-2 text-right text-xs outline-none"
                  style={{
                    backgroundColor: COLORS.background,
                    borderColor: COLORS.borderDark,
                    color: COLORS.textPrimary,
                  }}
                />
              </div>
            </div>

            {/* Doc Amount */}
            <div className="mt-1 grid grid-cols-[1fr_120px] items-center gap-2">
              <label className="text-xs font-bold" style={{ color: COLORS.textPrimary }}>
                Doc Amount
              </label>
              <div className="relative">
                <span
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold"
                  style={{ color: COLORS.textPrimary }}>
                  ₹
                </span>
                <input
                  ref={docAmountRef}
                  type="text"
                  defaultValue="0.00"
                  readOnly
                  className="w-full rounded-sm border py-1 pl-5 pr-2 text-right text-xs font-bold outline-none"
                  style={{
                    backgroundColor: COLORS.background,
                    borderColor: COLORS.borderDark,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {showChartOfAccounts && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
            style={{ zIndex: 1000 }}>
            <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded bg-white shadow-lg">
              <ChartOfAccounts
                isOpen={showChartOfAccounts}
                onClose={() => setShowChartOfAccounts(false)}
                initialData={coaFormData}
                onSave={handleSaveCOA}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

const TotalRow = ({ label, inputRef, defaultValue }: any) => (
  <div className="grid grid-cols-[1fr_120px] items-center gap-2">
    <label className="text-xs" style={{ color: COLORS.textSecondary }}>
      {label}
    </label>
    <div className="relative">
      <span
        className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
        style={{ color: COLORS.textMuted }}>
        ₹
      </span>
      <input
        ref={inputRef}
        type="text"
        defaultValue={defaultValue}
        readOnly
        className="w-full rounded-sm border py-1 pl-5 pr-2 text-right text-xs outline-none"
        style={{
          backgroundColor: COLORS.background,
          borderColor: COLORS.borderDark,
          color: COLORS.textPrimary,
        }}
      />
    </div>
  </div>
);

interface SplitRowProps {
  label: string;
  amtRef: React.RefObject<HTMLInputElement | null>;
  taxableRef: React.RefObject<HTMLInputElement | null>;
  onUpdate: () => void;
}

const SplitTotalRow = ({ label, amtRef, taxableRef, onUpdate }: SplitRowProps) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`[${label}] Amount Changed:`, e.target.value);

    const amount = parseFloat(e.target.value);
    const taxable = parseFloat(taxableRef.current?.value || '0');

    if (!isNaN(amount) && taxable >= 0) {
      if (amtRef.current) {
        amtRef.current.value = amount.toFixed(2);
      }
    } else if (e.target.value === '') {
      if (amtRef.current) amtRef.current.value = '0.00';
    }

    onUpdate();
  };

  return (
    <div className="grid grid-cols-[1fr_120px] items-center gap-2">
      <label className="text-xs" style={{ color: COLORS.textSecondary }}>
        {label}
      </label>

      {/* Amount Box (₹) */}
      <div className="relative">
        <span
          className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
          style={{ color: COLORS.textMuted }}>
          ₹
        </span>
        <input
          ref={amtRef}
          type="text"
          defaultValue="0.00"
          onChange={handleAmountChange}
          className="w-full rounded-sm border py-1 pl-5 pr-2 text-right text-xs outline-none"
          style={{
            borderColor: COLORS.borderDark,
            color: COLORS.textPrimary,
          }}
        />
      </div>
    </div>
  );
};

export default SaleInvoiceFooter;
