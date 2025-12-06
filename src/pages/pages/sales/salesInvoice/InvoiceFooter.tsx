import React from "react";
import { Edit2 } from "lucide-react";

const COLORS = {
  white: "#ffffff",
  textPrimary: "#111827", // gray-900
  textSecondary: "#374151", // gray-700
  textMuted: "#9CA3AF", // gray-400
  borderDark: "#D1D5DB", // gray-300
  background: "#F9FAFB", // gray-50
  primary: "#2563EB", // blue-600
  primaryHover: "#1D4ED8", // blue-700
  info: "#3B82F6",
};
import Attachment from "../../../../components/Attachment";

type InvoiceFooterProps = {
  amount?: number; // Made optional with a default value handling
};

const InvoiceFooter: React.FC<InvoiceFooterProps> = ({ amount = -8500 }) => {
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
      <div className="flex flex-col lg:flex-row gap-8">
        {/* --- LEFT SECTION (Inputs & Attachments) --- */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Remarks */}
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

          {/* Received Amount */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label className="w-32" style={{ color: COLORS.textPrimary }}>
              Received Amount
            </label>
            <div className="w-40 relative">
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: COLORS.textMuted }}
              >
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                className="w-full border rounded-sm py-1 pl-6 pr-2 text-right outline-none text-xs custom-input"
                style={{
                  borderColor: COLORS.borderDark,
                  color: COLORS.textPrimary,
                }}
              />
            </div>
          </div>

          {/* Cash/Bank Ledger */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label className="w-32" style={{ color: COLORS.textPrimary }}>
              Cash/Bank Ledger
            </label>
            <div className="flex-1 flex items-center gap-1">
              <div className="relative flex-1">
                <select
                  className="w-full border rounded-sm py-1 px-2 appearance-none outline-none text-xs custom-input"
                  style={{
                    borderColor: COLORS.borderDark,
                    backgroundColor: COLORS.white,
                    color: COLORS.textPrimary,
                  }}
                >
                  <option>Cash In Hand</option>
                  <option>Bank Account</option>
                </select>
              </div>
              <button
                className="custom-btn-primary text-white p-1.5 rounded-sm flex items-center justify-center"
                style={{ color: COLORS.white }}
              >
                <Edit2 size={12} />
              </button>
            </div>
          </div>

          {/* --- Attachment Section --- */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <label className="w-32 pt-2" style={{ color: COLORS.textPrimary }}>
              Attachment
            </label>
            <div className="flex-1">
              <Attachment />
            </div>
          </div>
        </div>

        {/* --- RIGHT SECTION (Totals) --- */}
        <div className="w-full lg:w-[400px] flex flex-col gap-2">
          <TotalRow label="Item Value" value="0.00" />
          <TotalRow label="Promo Discount" value="0.00" />
          <TotalRow label="Promo Discount 2" value="0.00" />
          <TotalRow label="Coupon Discount" value="0.00" />
          <TotalRow label="Discount" value="0.00" />
          <TotalRow label="Discount %" value="0.00" />
          <TotalRow label="Taxable" value="0.00" />
          <TotalRow label="Tax Amount" value="0.00" />

          {/* Special Rows with Dual Inputs (Discount) */}
          <div className="grid grid-cols-[1fr_60px_120px] gap-2 items-center">
            <label
              className="text-xs uppercase"
              style={{ color: COLORS.textSecondary }}
            >
              DISCOUNT
            </label>
            <input
              type="text"
              defaultValue="0"
              className="border rounded-sm px-2 py-1 text-right text-xs outline-none custom-input"
              style={{
                borderColor: COLORS.borderDark,
                color: COLORS.textPrimary,
              }}
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
                defaultValue="0.00"
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

          {/* Special Rows with Dual Inputs (Discount %) */}
          <div className="grid grid-cols-[1fr_60px_120px] gap-2 items-center">
            <label
              className="text-xs uppercase"
              style={{ color: COLORS.textSecondary }}
            >
              DISCOUNT %
            </label>
            <input
              type="text"
              defaultValue="0"
              className="border rounded-sm px-2 py-1 text-right text-xs outline-none custom-input"
              style={{
                borderColor: COLORS.borderDark,
                color: COLORS.textPrimary,
              }}
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
                defaultValue="0.00"
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

          <TotalRow label="Round Off" value="0.00" />

          {/* Doc Amount (Bold) */}
          <div className="grid grid-cols-[1fr_120px] gap-2 items-center mt-1">
            <label
              className="text-xs font-bold"
              style={{ color: COLORS.textPrimary }}
            >
              Doc Amount
            </label>
            <div className="relative">
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold"
                style={{ color: COLORS.textPrimary }}
              >
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

          {/* Payment Status Display */}
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

          {/* Generate EMI Button */}
          <div className="flex justify-end mt-2">
            <button
              className="custom-btn-primary text-xs font-medium px-4 py-1.5 rounded-sm shadow-sm"
              style={{ color: COLORS.white }}
            >
              Generate EMI
            </button>
          </div>
        </div>
      </div>

      {/* --- GLOBAL STYLES FOR HOVER & FOCUS --- */}
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

// --- Sub Component for simple rows ---
type TotalRowProps = {
  label: string;
  value: string;
};

const TotalRow: React.FC<TotalRowProps> = ({ label, value }) => {
  return (
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
          className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none custom-input"
          style={{
            backgroundColor: COLORS.background,
            borderColor: COLORS.borderDark,
            color: COLORS.textPrimary,
          }}
        />
      </div>
    </div>
  );
};

export default InvoiceFooter;
