import React, { useState } from "react";
import { COLORS } from "../../../../constants/colors";

import Attachment from "../../../../components/Attachment";
import PaymentType from "../../../../components/PaymentType";

type InvoiceFooterProps = {
  amount?: number; // Calculated Due/Advance Amount
};

const POSInvoiceFooter: React.FC<InvoiceFooterProps> = ({ amount = 8500 }) => {
  // --- POPUP STATE ---
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Logic for Payment Status
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
      className="w-full p-4 font-sans text-sm"
      style={{ backgroundColor: COLORS.white }}
    >
      <PaymentType
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={Math.abs(amount)}
        zIndex={1000}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="w-32 mt-1" style={{ color: COLORS.textPrimary }}>
              Remarks
            </label>
            <div className="flex-1 relative">
              <textarea
                className="w-full border rounded-sm p-2 h-20 outline-none resize-none text-xs custom-input"
                placeholder=""
                style={{
                  borderColor: COLORS.borderDark,
                  color: COLORS.textPrimary,
                }}
              />
              <span
                className="absolute bottom-2 right-2 text-xs"
                style={{ color: COLORS.textMuted }}
              >
                0/250
              </span>
            </div>
          </div>

          {/* Attachment Section */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <label className="w-32 pt-2" style={{ color: COLORS.textPrimary }}>
              Attachment
            </label>
            <div className="flex-1">
              <Attachment />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[400px] flex flex-col gap-2">
          <TotalRow label="Item Value" value="0.00" />
          <TotalRow label="Promo Discount" value="0.00" />
          <TotalRow label="Promo Discount 2" value="0.00" />
          <TotalRow label="Coupon Discount" value="0.00" />
          <TotalRow label="Discount" value="0.00" />
          <TotalRow label="Discount %" value="0.00" />
          <TotalRow label="Taxable" value="0.00" />
          <TotalRow label="Tax Amount" value="0.00" />

          <DualInputRow label="DISCOUNT" value="0.00" />

          <DualInputRow label="DISCOUNT %" value="0.00" />

          <TotalRow label="Round Off" value="0.00" />

          <div className="grid grid-cols-[1fr_120px] gap-2 items-center mt-1">
            <label
              className="text-xs font-bold"
              style={{ color: COLORS.textPrimary }}
            >
              Doc Amount
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold">
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                readOnly
                className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs font-bold outline-none"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.borderDark,
                  color: COLORS.textPrimary,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_120px] gap-2 items-center mt-1">
            <label className="text-xs" style={{ color: COLORS.textPrimary }}>
              Apply Coupon Code
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full border rounded-sm py-1 px-2 text-right text-xs font-bold outline-none"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.borderDark,
                  color: COLORS.textPrimary,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_160px] gap-2 items-center mt-1">
            <label className="text-xs font-bold text-gray-800">
              Payment Status
            </label>
            <div
              className={`flex items-center justify-between px-2 py-1 rounded text-xs font-bold ${statusColor}`}
            >
              <span>{statusText}</span>
              <span>
                {isAdvance && "+"}
                {isDue && "-"} ₹{Math.abs(amount).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="custom-btn-primary text-xs font-medium px-4 py-1.5 rounded-sm shadow-sm"
              style={{ color: COLORS.white }}
            >
              Payment
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-btn-primary {
          background-color: ${COLORS.primary};
          transition: background-color 0.2s;
        }
        .custom-btn-primary:hover {
          background-color: ${COLORS.primaryHover};
        }
        .custom-input:focus {
          border-color: ${COLORS.info} !important;
        }
      `}</style>
    </div>
  );
};

const TotalRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="grid grid-cols-[1fr_120px] gap-2 items-center">
    <label className="text-xs" style={{ color: COLORS.textSecondary }}>
      {label}
    </label>
    <div className="relative">
      <span
        className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
        style={{ color: COLORS.textMuted }}
      >
        ₹
      </span>
      <input
        type="text"
        defaultValue={value}
        readOnly
        className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
        style={{
          backgroundColor: COLORS.background,
          borderColor: COLORS.borderDark,
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
  <div className="grid grid-cols-[1fr_60px_120px] gap-2 items-center">
    <label
      className="text-xs uppercase"
      style={{ color: COLORS.textSecondary }}
    >
      {label}
    </label>
    <input
      type="text"
      defaultValue="0"
      className="border rounded-sm px-2 py-1 text-right text-xs outline-none custom-input"
      style={{ borderColor: COLORS.borderDark, color: COLORS.textPrimary }}
    />
    <div className="relative">
      <span
        className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
        style={{ color: COLORS.textMuted }}
      >
        ₹
      </span>
      <input
        type="text"
        defaultValue={value}
        readOnly
        className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
        style={{
          backgroundColor: COLORS.background,
          borderColor: COLORS.borderDark,
          color: COLORS.textSecondary,
        }}
      />
    </div>
  </div>
);

export default POSInvoiceFooter;
