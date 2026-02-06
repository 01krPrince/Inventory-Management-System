import React, { useState } from "react";
import { COLORS } from "../../../../constants/colors";
import Attachment from "../../../../components/Attachment";
import PaymentType from "../../../../components/PaymentType";

type InvoiceFooterProps = {
  amount?: number;
  zIndex?: number;
};

const POSInvoiceFooter: React.FC<InvoiceFooterProps> = ({
  amount = 8500,
  zIndex = 10,
}) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const isAdvance = amount > 0;
  const isDue = amount < 0;

  const statusText = isAdvance
    ? "Advance Paid"
    : isDue
    ? "Due Amount"
    : "Fully Paid";
  const statusColor = isAdvance
    ? "text-green-600 bg-green-100"
    : isDue
    ? "text-red-600 bg-red-100"
    : "text-gray-600 bg-gray-100";

  return (
    <div
      className="w-full p-4 font-sans text-sm border-t shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
      style={{
        backgroundColor: COLORS.white,
        zIndex: zIndex,
        position: "relative",
      }}
    >
      <PaymentType
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={Math.abs(amount)}
        zIndex={zIndex + 50}
      />

      {/* 1. TOP PORTION: 4-COLUMN GRID FOR TOTALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 mb-6">
        <TotalRow label="Item Value" value="0.00" />
        <TotalRow label="Promo Discount" value="0.00" />
        <TotalRow label="Promo Discount 2" value="0.00" />
        <TotalRow label="Coupon Discount" value="0.00" />

        <TotalRow label="Taxable" value="0.00" />
        <TotalRow label="Tax Amount" value="0.00" />
        <TotalRow label="Round Off" value="0.00" />
        <TotalRow
          label="Doc Amount"
          value={Math.abs(amount).toFixed(2)}
          isBold
        />

        <DualInputRow label="Discount" value="0.00" />
        <DualInputRow label="Discount %" value="0.00" />

        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-gray-500">
            Coupon Code
          </label>
          <input
            type="text"
            className="w-full border rounded-sm py-1 px-2 text-right text-xs outline-none bg-gray-50"
            style={{ borderColor: COLORS.borderDark }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-gray-500">
            Payment Status
          </label>
          <div
            className={`flex items-center justify-between px-2 py-1 rounded text-[11px] font-bold ${statusColor}`}
          >
            <span>{statusText}</span>
            <span>₹{Math.abs(amount).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <hr className="mb-6 border-gray-100" />

      {/* 2. BOTTOM PORTION: ATTACHMENT (Left) & REMARKS/BUTTON (Right) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Attachment - Left side */}
        <div className="w-full lg:w-1/2 flex flex-col gap-2">
          <label className="font-bold text-xs uppercase text-gray-500 tracking-wider">
            Attachments
          </label>
          <Attachment />
        </div>

        {/* Remarks and Button - Right side */}
        <div className="w-full lg:w-1/2 flex flex-col items-end gap-4">
          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-xs uppercase text-gray-500 tracking-wider">
                Remarks
              </label>
              <span className="text-[10px] text-gray-400">0/250</span>
            </div>
            <textarea
              className="w-full border rounded-sm p-2 h-20 outline-none resize-none text-xs custom-input bg-gray-50"
              placeholder="Enter internal notes or customer remarks..."
              style={{
                borderColor: COLORS.borderDark,
                color: COLORS.textPrimary,
              }}
            />
          </div>

          <div className="w-full flex justify-end mt-2">
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="w-full lg:w-56 custom-btn-primary text-xs font-black px-6 py-3 rounded-sm shadow-md uppercase tracking-widest transition-all"
              style={{ color: COLORS.white }}
            >
              Process Payment
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-btn-primary { background-color: ${COLORS.primary}; transition: all 0.2s; }
        .custom-btn-primary:hover { background-color: ${COLORS.primaryHover}; transform: translateY(-1px); }
        .custom-input:focus { border-color: ${COLORS.primary} !important; box-shadow: 0 0 0 1px ${COLORS.primary}20; background-color: white; }
      `}</style>
    </div>
  );
};

const TotalRow: React.FC<{
  label: string;
  value: string;
  isBold?: boolean;
}> = ({ label, value, isBold }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] uppercase font-bold text-gray-400">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
        ₹
      </span>
      <input
        type="text"
        value={value}
        readOnly
        className={`w-full border rounded-sm py-1.5 pl-5 pr-2 text-right text-xs outline-none ${
          isBold ? "font-black bg-blue-50 border-blue-200" : "bg-gray-50"
        }`}
        style={{
          borderColor: isBold ? undefined : COLORS.borderDark,
          color: COLORS.textPrimary,
        }}
      />
    </div>
  </div>
);

const DualInputRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] uppercase font-bold text-gray-400">
      {label}
    </label>
    <div className="flex gap-1">
      <input
        type="text"
        placeholder="%"
        className="w-12 border rounded-sm py-1 text-center text-xs outline-none"
        style={{ borderColor: COLORS.borderDark }}
      />
      <div className="relative flex-1">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
          ₹
        </span>
        <input
          type="text"
          value={value}
          readOnly
          className="w-full border rounded-sm py-1.5 pl-5 pr-2 text-right text-xs outline-none bg-gray-50"
          style={{ borderColor: COLORS.borderDark }}
        />
      </div>
    </div>
  </div>
);

export default POSInvoiceFooter;
