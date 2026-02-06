import React, { useState } from 'react';
import { COLORS } from '../../../../constants/colors';
import Attachment from '../../../../components/Attachment';
import PaymentType from '../../../../components/PaymentType';

// --- PROPS INTERFACE ---
interface POSInvoiceFooterProps {
  data: any; // Full Invoice Data object
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
  const balance = docAmount - totalPaid;

  const isAdvance = balance < 0;
  const isDue = balance > 0.01;

  const statusText = isAdvance ? 'Advance Paid' : isDue ? 'Due Amount' : 'Fully Paid';

  const statusColor = isAdvance
    ? 'text-green-600 bg-green-100'
    : isDue
      ? 'text-red-600 bg-red-100'
      : 'text-gray-600 bg-gray-100';

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
      className="w-full border-t p-4 font-sans text-sm shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
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

      {/* 1. TOP PORTION: 4-COLUMN GRID FOR TOTALS */}
      <div className="mb-6 grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Row 1 */}
        <TotalRow label="Item Value (Taxable)" value={totals.amount.toFixed(2)} />

        <EditableRow
          label="Promo Discount"
          value={data.promoDiscount}
          onChange={(val) => onChange('promoDiscount', val)}
        />

        <EditableRow
          label="Promo Discount 2"
          value={data.promoDiscount2}
          onChange={(val) => onChange('promoDiscount2', val)}
        />

        <EditableRow
          label="Coupon Discount"
          value={data.couponDiscount}
          onChange={(val) => onChange('couponDiscount', val)}
        />

        {/* Row 2 */}
        <TotalRow label="Taxable Total" value={(totals.amount - totalDiscount).toFixed(2)} />

        <TotalRow label="Tax Amount" value={totals.tax.toFixed(2)} />

        <EditableRow
          label="Round Off"
          value={data.roundOff}
          onChange={(val) => onChange('roundOff', val)}
        />

        <TotalRow label="Doc Amount" value={docAmount.toFixed(2)} isBold />

        <DualInputRow
          label="Bill Discount"
          percent={data.billDiscountPercent}
          amount={data.billDiscountAmount}
          onPercentChange={handleDiscountPercentChange}
          onAmountChange={handleDiscountAmountChange}
        />

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase text-gray-500">Coupon Code</label>
          <input
            type="text"
            value={data.couponCode || ''}
            onChange={(e) => onChange('couponCode', e.target.value)}
            className="w-full rounded-sm border bg-white px-2 py-1 text-right text-xs outline-none"
            style={{ borderColor: COLORS.borderDark }}
          />
        </div>

        {/* Payment Status Display */}
        <div className="flex flex-col gap-1 lg:col-span-2">
          <label className="text-[10px] font-bold uppercase text-gray-500">
            Payment Status (Paid: ₹{totalPaid.toFixed(2)})
          </label>
          <div
            className={`flex items-center justify-between rounded px-2 py-1.5 text-[11px] font-bold ${statusColor}`}>
            <span>{statusText}</span>
            <span>Balance: ₹{Math.abs(balance).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <hr className="mb-6 border-gray-100" />

      {/* 2. BOTTOM PORTION: ATTACHMENT (Left) & REMARKS/BUTTON (Right) */}
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        {/* Attachment - Left side */}
        <div className="flex w-full flex-col gap-2 lg:w-1/2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Attachments
          </label>
          <Attachment />
        </div>

        {/* Remarks and Button - Right side */}
        <div className="flex w-full flex-col items-end gap-4 lg:w-1/2">
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Remarks
              </label>
              <span className="text-[10px] text-gray-400">{(data.remarks || '').length}/250</span>
            </div>
            <textarea
              value={data.remarks || ''}
              onChange={(e) => onChange('remarks', e.target.value)}
              className="custom-input h-20 w-full resize-none rounded-sm border bg-gray-50 p-2 text-xs outline-none transition-colors focus:bg-white"
              placeholder="Enter internal notes or customer remarks..."
              style={{
                borderColor: COLORS.borderDark,
                color: COLORS.textPrimary,
              }}
            />
          </div>

          <div className="mt-2 flex w-full justify-end">
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="custom-btn-primary w-full rounded-sm px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-md transition-all lg:w-56">
              Process Payment
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-btn-primary { background-color: ${COLORS.primary}; transition: all 0.2s; }
        .custom-btn-primary:hover { background-color: ${COLORS.primaryHover}; transform: translateY(-1px); }
        .custom-input:focus { border-color: ${COLORS.primary} !important; box-shadow: 0 0 0 1px ${COLORS.primary}20; }
      `}</style>
    </div>
  );
};

// --- SUB COMPONENTS ---

const TotalRow: React.FC<{
  label: string;
  value: string;
  isBold?: boolean;
}> = ({ label, value, isBold }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold uppercase text-gray-400">{label}</label>
    <div className="relative">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">₹</span>
      <input
        type="text"
        value={value}
        readOnly
        className={`w-full rounded-sm border py-1.5 pl-5 pr-2 text-right text-xs outline-none ${
          isBold ? 'border-blue-200 bg-blue-50 font-black' : 'bg-gray-50'
        }`}
        style={{
          borderColor: isBold ? undefined : COLORS.borderDark,
          color: COLORS.textPrimary,
        }}
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
    <label className="text-[10px] font-bold uppercase text-gray-400">{label}</label>
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
    <label className="text-[10px] font-bold uppercase text-gray-400">{label}</label>
    <div className="flex gap-1">
      <input
        type="number"
        placeholder="%"
        value={percent}
        onChange={(e) => onPercentChange(e.target.value)}
        className="w-12 rounded-sm border bg-white py-1 text-center text-xs outline-none focus:border-blue-400"
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
