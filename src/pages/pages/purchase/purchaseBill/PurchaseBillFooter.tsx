import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { EditIcon } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import Attachment from '../../../../components/Attachment';
import Dropdown, { ColumnDef } from '../../../../components/Dropdown';
import ChartOfAccounts from '../../../../components/ChartOfAccount';
import { SalesAndPurchaseGL } from '../../../../components/addItemMaster/api/saleAndPurchaseGL';
import chartOfAccountService from '../../../../services/chartOfAccountService';

// --- Interfaces ---
export interface PurchaseBillFooterRef {
  getFooterData: () => {
    remarks: string;
    receivedAmount: number;
    cashBankLedger: string;
    itemValue: number;
    discount1: number;
    discount2: number;
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
  };
}

type InvoiceFooterProps = {
  amount?: number;
  cashCredit?: string;
  // This prop receives the live data from OrderTable
  currentItems?: any[];
};

const glColumns: ColumnDef<any>[] = [
  { header: 'Code', key: 'code', width: 'w-1/4' },
  { header: 'Name', key: 'name', width: 'w-3/4' },
];

const PurchaseBillFooter = forwardRef<PurchaseBillFooterRef, InvoiceFooterProps>(
  ({ cashCredit, currentItems }, ref) => {
    const remarksRef = useRef<HTMLTextAreaElement>(null);
    const receivedAmountRef = useRef<HTMLInputElement>(null);

    // Right Section Calculation Refs
    const itemValueRef = useRef<HTMLInputElement>(null);
    const discount1Ref = useRef<HTMLInputElement>(null);
    const discount2Ref = useRef<HTMLInputElement>(null);
    const taxableRef = useRef<HTMLInputElement>(null);
    const taxAmountRef = useRef<HTMLInputElement>(null);
    const roundOffRef = useRef<HTMLInputElement>(null);
    const docAmountRef = useRef<HTMLInputElement>(null);

    // Split Fields Refs
    const transportValRef = useRef<HTMLInputElement>(null);
    const transportAmtRef = useRef<HTMLInputElement>(null);
    const otherDiscValRef = useRef<HTMLInputElement>(null);
    const otherDiscAmtRef = useRef<HTMLInputElement>(null);
    const adjustmentValRef = useRef<HTMLInputElement>(null);
    const adjustmentAmtRef = useRef<HTMLInputElement>(null);

    // --- State ---
    const [glOptions, setGlOptions] = useState<any[]>([]);
    const [selectedLedger, setSelectedLedger] = useState<string>('Cash In Hand');
    const [showChartOfAccounts, setShowChartOfAccounts] = useState(false);
    const [coaFormData, setCoaFormData] = useState<SalesAndPurchaseGL | null>(null);

    // ---------------------------------------------------------------------------
    // ✅ Helper: Calculate Final Document Amount
    // ---------------------------------------------------------------------------
    const calculateFinalDocAmount = () => {
      console.group('🧮 Final Doc Amount Calculation');

      const getVal = (ref: React.RefObject<HTMLInputElement | null>, name: string) => {
        const val = Number(ref.current?.value || 0);
        console.log(`   - ${name}: ${val}`);
        return val;
      };

      const taxable = getVal(taxableRef, 'Taxable');
      const tax = getVal(taxAmountRef, 'Tax Amount');
      const transport = getVal(transportAmtRef, 'Transport Amt');
      const otherDisc = getVal(otherDiscAmtRef, 'Other Disc Amt');
      const adjustment = getVal(adjustmentAmtRef, 'Adjustment Amt');
      const roundOff = getVal(roundOffRef, 'Round Off');

      // Math: (Taxable + Tax + Transport + Adjustment + RoundOff) - Discount
      const finalTotal = taxable + tax + transport + adjustment + roundOff - otherDisc;

      console.log(
        `   ➤ Formula: (${taxable} + ${tax} + ${transport} + ${adjustment} + ${roundOff}) - ${otherDisc}`
      );
      console.log(`   ✅ FINAL TOTAL: ${finalTotal}`);

      if (docAmountRef.current) {
        docAmountRef.current.value = finalTotal.toFixed(2);
      }

      console.groupEnd();
    };

    // ---------------------------------------------------------------------------
    // ✅ Effect: Item Changes -> Update Taxable/Tax -> Update Final Total
    // ---------------------------------------------------------------------------
    useEffect(() => {
      const calculateFooterTotals = () => {
        console.group('🧾 Footer Items Processing (INCLUSIVE LOGIC)');

        if (!currentItems || currentItems.length === 0) {
          console.warn('No items found to process.');
          console.groupEnd();
          return;
        }

        let totalItemValue = 0; // Final Bill Value
        let totalTaxable = 0; // Base Value
        let totalTaxAmount = 0; // GST Value

        currentItems.forEach((row: any, index: number) => {
          const item = row.data || row;

          const qty = Number(item.qty || 0);
          const rate = Number(item.rate || 0);
          const amount = Number(item.amount || qty * rate); // This is Inclusive Amount
          const gstRate = Number(item.gstRate || 0);

          // --- ✅ CORRECTED MATH (Reverse Calculation) ---
          // 1. Find Taxable: Amount / (1 + rate/100)
          const itemTaxable = amount / (1 + gstRate / 100);

          // 2. Find Tax: Amount - Taxable
          const itemTax = amount - itemTaxable;

          console.log(`   Row #${index + 1}:`, {
            InclusiveAmount: amount,
            GSTRate: gstRate,
            CalculatedTaxable: itemTaxable.toFixed(2),
            CalculatedTax: itemTax.toFixed(2),
          });

          totalItemValue += amount;
          totalTaxable += itemTaxable;
          totalTaxAmount += itemTax;
        });

        console.log(`   ➤ SUM Taxable: ${totalTaxable.toFixed(2)}`);
        console.log(`   ➤ SUM Tax: ${totalTaxAmount.toFixed(2)}`);
        console.log(`   ➤ SUM Total: ${totalItemValue.toFixed(2)}`);

        // Update UI Refs
        if (itemValueRef.current) itemValueRef.current.value = totalItemValue.toFixed(2);
        if (taxableRef.current) taxableRef.current.value = totalTaxable.toFixed(2);
        if (taxAmountRef.current) taxAmountRef.current.value = totalTaxAmount.toFixed(2);

        console.groupEnd();

        // Trigger Final Calculation
        calculateFinalDocAmount();
      };

      calculateFooterTotals();
    }, [currentItems]);

    // --- Load Ledgers ---
    useEffect(() => {
      const loadData = async () => {
        try {
          const coaResponse = await chartOfAccountService.getAllChartOfAccounts();
          if (coaResponse.data && coaResponse.data.success) {
            const rawData = coaResponse.data.data;
            const mappedOptions = rawData.map((item: any) => ({
              ...item,
              name: item.name,
              code: item.code || item.accountCode || '',
              label: item.name,
              value: item._id,
            }));
            setGlOptions(mappedOptions);
          }
        } catch (error) {
          console.error('Failed to load dropdown data', error);
        }
      };
      loadData();
    }, []);

    // --- Expose Data to Parent ---
    useImperativeHandle(ref, () => ({
      getFooterData: () => ({
        remarks: remarksRef.current?.value || '',
        receivedAmount: Number(receivedAmountRef.current?.value || 0),
        cashBankLedger: selectedLedger,

        itemValue: Number(itemValueRef.current?.value || 0),
        discount1: Number(discount1Ref.current?.value || 0),
        discount2: Number(discount2Ref.current?.value || 0),
        taxable: Number(taxableRef.current?.value || 0),
        taxAmount: Number(taxAmountRef.current?.value || 0),

        transportVal: Number(transportValRef.current?.value || 0),
        transportAmt: Number(transportAmtRef.current?.value || 0),
        otherDiscVal: Number(otherDiscValRef.current?.value || 0),
        otherDiscAmt: Number(otherDiscAmtRef.current?.value || 0),
        adjustmentVal: Number(adjustmentValRef.current?.value || 0),
        adjustmentAmt: Number(adjustmentAmtRef.current?.value || 0),

        roundOff: Number(roundOffRef.current?.value || 0),
        docAmount: Number(docAmountRef.current?.value || 0),
      }),
    }));

    // --- Handlers ---
    const handleOpenCOA = () => {
      const selectedItem = glOptions.find((item) => item.name === selectedLedger);
      setCoaFormData(selectedItem || ({ name: selectedLedger } as SalesAndPurchaseGL));
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

    return (
      <div
        className="w-full border-t p-4 font-sans text-sm"
        style={{ backgroundColor: COLORS.white }}>
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* --- LEFT SECTION --- */}
          <div className="flex flex-1 flex-col gap-4">
            {/* Remarks */}
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

            {/* Paid Amount */}
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <label className="w-32 text-xs font-medium" style={{ color: COLORS.textPrimary }}>
                Paid Amount
              </label>
              <div className="relative w-40">
                <span
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: COLORS.textMuted }}>
                  ₹
                </span>
                <input
                  ref={receivedAmountRef}
                  type="text"
                  defaultValue="0.00"
                  className="custom-input w-full rounded-sm border py-1 pl-6 pr-2 text-right text-xs outline-none"
                  style={{
                    borderColor: COLORS.borderDark,
                    color: COLORS.textPrimary,
                  }}
                />
              </div>
            </div>

            {/* Cash/Bank Ledger */}
            {cashCredit === 'Credit' && (
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="w-32">
                  <label className="text-[13px] font-medium text-gray-700">Cash/Bank Ledger</label>
                </div>
                <div className="flex flex-1 items-center gap-0">
                  <div className="flex-1">
                    <Dropdown
                      data={glOptions} // ✅ FIXED: Pass full data, Dropdown handles filtering
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

// ---------------------------------------------------------------------------
// ✅ Updated SplitTotalRow (Amount Only)
// ---------------------------------------------------------------------------
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
      console.log(`   -> Using Amt: ${amount}`);
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

export default PurchaseBillFooter;
