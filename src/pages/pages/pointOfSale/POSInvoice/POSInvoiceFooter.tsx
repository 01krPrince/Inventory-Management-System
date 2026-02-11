import React, { useState } from 'react';
import { COLORS } from '../../../../constants/colors';
import PaymentType from '../../../../components/PaymentType';
import { ChevronRight, CreditCard } from 'lucide-react';
import Attachment from '../../../../components/Attachment';

interface POSInvoiceFooterProps {
  data: any;
  totals: { qty: number; amount: number; tax: number; total: number };
  onChange: (field: string, value: any) => void;
  onPaymentUpdate: (payments: any[]) => void;
  zIndex?: number;
  onConfirm?: (payments: any[]) => void;
}

const POSInvoiceFooter: React.FC<POSInvoiceFooterProps> = ({
  data,
  totals,
  onChange,
  onPaymentUpdate,
  zIndex = 10,
}) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const totalDiscount =
    (parseFloat(data.promoDiscount) || 0) +
    (parseFloat(data.promoDiscount2) || 0) +
    (parseFloat(data.couponDiscount) || 0) +
    (parseFloat(data.billDiscountAmount) || 0);

  const docAmount = totals.total - totalDiscount + (parseFloat(data.roundOff) || 0);

  const totalPaid =
    data.payments?.reduce((sum: number, p: any) => sum + (parseFloat(p.netAmount) || 0), 0) || 0;
  const leftBalance = docAmount - totalPaid; // if totle not paid then do not acess click submit from footer show a popup

  const statusText = leftBalance > 0.01 ? 'Due Amount' : 'Fully Paid';
  const statusColor =
    leftBalance > 0.01
      ? 'text-red-700 bg-red-50 border-red-200'
      : 'text-green-700 bg-green-50 border-green-200';

  const isAdvance = 0;
  // const isDue = balance > 0.01;

  const handleDiscountPercentChange = (val: string) => {
    const percent = parseFloat(val) || 0;
    const discAmount = (totals.amount * percent) / 100;

    onChange('billDiscountPercent', val);
    onChange('billDiscountAmount', discAmount.toFixed(2));
  };

  const handleDiscountAmountChange = (val: string) => {
    const amount = parseFloat(val) || 0;
    const percent = totals.amount > 0 ? (amount / totals.amount) * 100 : 0;

    onChange('billDiscountAmount', val);
    onChange('billDiscountPercent', percent.toFixed(2));
  };

  return (
    <div
      className="w-full border-t p-4 font-sans text-sm shadow-[0_-4px_10px_rgba(0,0,0,0.05)] transition-all duration-300"
      style={{
        backgroundColor: COLORS.white,
        zIndex: zIndex,
        position: 'relative',
      }}>
      <PaymentType
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={docAmount}
        onConfirm={(payments) => onPaymentUpdate(payments)}
        zIndex={zIndex + 50}
      />

      <div className="mb-3 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-3">
            <TotalRow label="Item Value (Taxable)" value={totals.amount.toFixed(2)} readOnly />

            <ReadOnlyRow label="Promo Discount" value={data.promoDiscount || '0.00'} />

            <TotalRow
              label="Taxable Total"
              value={(totals.amount - totalDiscount).toFixed(2)}
              readOnly
            />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-3">
            <ReadOnlyRow label="Coupon Discount" value={data.couponDiscount || '0.00'} />

            <TotalRow label="Tax Amount" value={totals.tax.toFixed(2)} readOnly />

            <ReadOnlyRow label="Promo Discount 2" value={data.promoDiscount2 || '0.00'} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-3">
            <DualInputRow
              label="Bill Discount"
              percent={data.billDiscountPercent || '0.00'}
              amount={data.billDiscountAmount || '0.00'}
              onPercentChange={handleDiscountPercentChange}
              onAmountChange={handleDiscountAmountChange}
            />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">Coupon Code</label>
              <input
                type="text"
                value={data.couponCode || ''}
                onChange={(e) => onChange('couponCode', e.target.value)}
                className="w-full rounded-sm border bg-white px-2 py-1.5 text-right text-xs outline-none focus:border-blue-400"
                style={{ borderColor: COLORS.borderDark }}
              />
            </div>

            <EditableRow
              label="Round Off"
              value={data.roundOff || '0.00'}
              onChange={(val) => onChange('roundOff', val)}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-3">
            <TotalRow label="Doc Amount" value={docAmount.toFixed(2)} isBold readOnly />
            <div className="flex flex-col gap-1">
              <label className="select-none text-[10px] font-bold uppercase text-transparent">
                Action
              </label>
              <button
                onClick={() => setIsPaymentOpen(true)}
                style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
                className="group flex h-[34px] w-full items-center justify-center gap-2 rounded-sm text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-[0.98]">
                <CreditCard
                  size={14}
                  className="opacity-80 transition-transform group-hover:scale-110"
                />
                <span>Process Pay</span>
                <ChevronRight
                  size={14}
                  className="opacity-60 transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">
                Payment Status
              </label>
              <div
                className={`flex h-[34px] items-center justify-between rounded-sm border px-3 text-[11px] font-bold ${statusColor}`}>
                <span>{statusText}</span>
                <span>Bal: {isAdvance !== 0 ? Math.abs(isAdvance).toFixed(0) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4  lg:flex-row">
        <div className="flex w-full flex-col gap-1 lg:order-1 lg:w-1/2">
          <Attachment />
        </div>

        <div className="flex w-full flex-col gap-1 lg:order-2 lg:w-1/2">
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400">
              Remarks
            </label>
            <span className="text-[9px] text-gray-300">{(data.remarks || '').length}/250</span>
          </div>
          <textarea
            value={data.remarks || ''}
            onChange={(e) => onChange('remarks', e.target.value)}
            className="custom-input h-20 min-h-[80px] w-full resize-y rounded-sm border bg-gray-50 px-3 py-2 text-xs text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-400 focus:h-32 focus:bg-white focus:shadow-sm"
            placeholder="Add internal notes or special instructions..."
            maxLength={250}
            style={{
              borderColor: COLORS.borderDark,
            }}
          />
        </div>
      </div>

      <style>{`
        .custom-input:focus { 
          border-color: ${COLORS.primary} !important; 
          box-shadow: 0 0 0 1px ${COLORS.primary}20; 
        }
      `}</style>
    </div>
  );
};

// ────────────────────────────────────────────────
//  Helper Components (unchanged except styling tweaks)
// ────────────────────────────────────────────────

const TotalRow: React.FC<{
  label: string;
  value: string;
  isBold?: boolean;
  readOnly?: boolean;
}> = ({ label, value, isBold = false, readOnly = true }) => (
  <div className="flex flex-col gap-1">
    <label className="truncate text-[10px] font-bold uppercase text-gray-400" title={label}>
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">₹</span>
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        className={`w-full rounded-sm border py-1.5 pl-5 pr-2 text-right text-xs outline-none ${
          isBold
            ? 'border-blue-200 bg-blue-50 font-black text-blue-900'
            : readOnly
              ? 'cursor-not-allowed bg-gray-100 text-gray-700'
              : 'bg-gray-50 text-gray-700'
        }`}
        style={{
          borderColor: isBold ? undefined : COLORS.borderDark,
        }}
      />
    </div>
  </div>
);

const ReadOnlyRow: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="truncate text-[10px] font-bold uppercase text-gray-400" title={label}>
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">₹</span>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full cursor-not-allowed rounded-sm border bg-gray-100 py-1.5 pl-5 pr-2 text-right text-xs text-gray-700 outline-none"
        style={{ borderColor: COLORS.borderDark }}
      />
    </div>
  </div>
);

const EditableRow: React.FC<{
  label: string;
  value: string | number;
  onChange: (val: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="truncate text-[10px] font-bold uppercase text-gray-400" title={label}>
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">₹</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border bg-white py-1.5 pl-5 pr-2 text-right text-xs outline-none transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
        style={{ borderColor: COLORS.borderDark }}
      />
    </div>
  </div>
);

const DualInputRow: React.FC<{
  label: string;
  percent: string | number;
  amount: string | number;
  onPercentChange: (val: string) => void;
  onAmountChange: (val: string) => void;
}> = ({ label, percent, amount, onPercentChange, onAmountChange }) => (
  <div className="flex flex-col gap-1">
    <label className="truncate text-[10px] font-bold uppercase text-gray-400" title={label}>
      {label}
    </label>
    <div className="flex gap-1">
      <input
        type="number"
        placeholder="%"
        value={percent}
        onChange={(e) => onPercentChange(e.target.value)}
        className="w-20 rounded-sm border bg-white py-1 text-center text-xs outline-none focus:border-blue-400"
        style={{ borderColor: COLORS.borderDark }}
      />
      <div className="relative flex-1">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
          ₹
        </span>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="w-full rounded-sm border bg-white py-1.5 pl-5 pr-2 text-right text-xs outline-none focus:border-blue-400"
          style={{ borderColor: COLORS.borderDark }}
        />
      </div>
    </div>
  </div>
);

export default POSInvoiceFooter;
