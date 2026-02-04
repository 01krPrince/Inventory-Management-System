import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { EditIcon } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import Attachment from '../../../../components/Attachment';
import Dropdown, { ColumnDef } from '../../../../components/Dropdown';
import ChartOfAccounts from '../../../../components/ChartOfAccount';
import { SalesAndPurchaseGL } from '../../../../components/addItemMaster/api/saleAndPurchaseGL';
import chartOfAccountService from '../../../../services/chartOfAccountService';

export interface PurchaseBillFooterRef {
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
    // payments: Array<{
    //   ledger: string;
    //   amount: number;
    //   remarks: string;
    // }>;
    promoDiscount: number;
    payments: Array<{
      ledger: string;
      amount: number;
      remarks: string;
    }>;
  };
}

type InvoiceFooterProps = {
  amount?: number;
  cashCredit?: string;
  currentItems?: any[];
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

const PurchaseBillFooter = forwardRef<PurchaseBillFooterRef, InvoiceFooterProps>(
  ({ cashCredit, currentItems }, ref) => {
    const remarksRef = useRef<HTMLTextAreaElement>(null);
    // const receivedAmountRef = useRef<HTMLInputElement>(null);

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
    const [payments, setPayments] = useState<{ ledger: string; amount: number; remarks: string }[]>(
      []
    );

    const [paymentAmount, setPaymentAmount] = useState<number>(0);

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

          const qty = Number(item.qty || 0);
          const rate = Number(item.rate || 0);
          const amount = Number(item.amount || qty * rate);
          const gstRate = Number(item.gstRate || 0);

          const itemTaxable = amount / (1 + gstRate / 100);

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
        calculateFinalDocAmount();
      };

      calculateFooterTotals();
    }, [currentItems]);

    useEffect(() => {
      const loadData = async () => {
        try {
          const coaResponse = await chartOfAccountService.getAllChartOfAccounts();

          console.log('🔍 FULL API RESPONSE:', coaResponse);

          const rawData = coaResponse.data;

          if (Array.isArray(rawData)) {
            console.log('📊 RAW ARRAY DATA FOUND:', rawData);

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
          } else {
            console.warn(
              '⚠️ API response is not an array. Check if it is wrapped in an object:',
              rawData
            );
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

      setPayments((prev) => {
        const updated = [...prev, newPayment];
        console.log('✅ PAYMENTS UPDATED:', updated);
        return updated;
      });

      setPaymentAmount(0);
    };

    useEffect(() => {
      if (cashCredit === 'Credit' && paymentAmount > 0) {
        const selectedGl = glOptions.find((opt) => opt.name === selectedLedger);
        if (!selectedGl) return;

        setPayments([
          {
            ledger: selectedGl.code,
            amount: paymentAmount,
            remarks: selectedGl.name,
          },
        ]);
      }
    }, [cashCredit, selectedLedger, glOptions]);

    return (
      <div
        className="w-full border-t p-4 font-sans text-sm"
        style={{ backgroundColor: COLORS.white }}>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex flex-1 flex-col gap-4">
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

            {cashCredit === 'Cash' && payments.length > 0 && (
              <div className="mt-3 rounded border border-gray-200">
                <div className="grid grid-cols-4 gap-2 bg-gray-100 p-2 text-xs font-semibold">
                  <div>Ledger</div>
                  <div className="text-right">Amount</div>
                  <div className="text-center">Action</div>
                </div>

                {payments.map((p, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 border-t p-2 text-xs">
                    <div>{p.remarks}</div>
                    <div className="text-right">₹ {p.amount.toFixed(2)}</div>

                    <div className="text-center">
                      <button
                        type="button"
                        className="text-red-600 hover:underline"
                        onClick={() => setPayments((prev) => prev.filter((_, i) => i !== index))}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Ledger Label */}
              <div className="w-32">
                <label className="text-[13px] font-medium text-gray-700">Cash/Bank Ledger</label>
              </div>

              {/* Ledger Dropdown + Edit */}
              <div className="flex flex-1 items-center gap-1">
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

              <input
                type="number"
                className="w-[200px] rounded border border-gray-300 px-2 py-1 text-sm"
                placeholder="Amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value || 0))}
              />

              {cashCredit === 'Cash' && (
                <button
                  type="button"
                  className="w-[200px] whitespace-nowrap rounded bg-amber-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-900"
                  onClick={handleAddNew}>
                  Add New
                </button>
              )}
            </div>

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

            {/* <div className="flex flex-col items-center gap-4 sm:flex-row">
              <label className="w-32 text-xs font-medium" style={{ color: COLORS.textPrimary }}>
                Transport
              </label>
              <div className="relative w-40">
                <span
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: COLORS.textMuted }}>
                  ₹
                </span>
                <input
                  ref={transportAmtRef}
                  type="text"
                  defaultValue="0.00"
                  onChange={calculateFinalDocAmount}
                />
              </div>
            </div> */}
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
