import React from "react";
import { Edit2 } from "lucide-react";
import { COLORS } from "../../../../constants/colors";
import Attachment from "../../../../components/Attachment";

const InvoiceFooter: React.FC = () => {
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
            <label
              className="w-32 mt-1"
              style={{ color: COLORS.textPrimary }} // Was text-gray-700
            >
              Remarks
            </label>
            <div className="flex-1 relative">
              <textarea
                className="w-full border rounded-sm p-2 h-20 outline-none resize-none text-xs custom-input"
                placeholder=""
                style={{
                  borderColor: COLORS.borderDark, // Was border-gray-300
                  color: COLORS.textPrimary,
                }}
              />
              <span
                className="absolute bottom-2 right-2 text-xs"
                style={{ color: COLORS.textMuted }} // Was text-gray-400
              >
                0/250
              </span>
            </div>
          </div>

          {/* Received Amount */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label
              className="w-32"
              style={{ color: COLORS.textPrimary }} // Was text-gray-700
            >
              Received Amount
            </label>
            <div className="w-40 relative">
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: COLORS.textMuted }} // Was text-gray-500
              >
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                className="w-full border rounded-sm py-1 pl-6 pr-2 text-right outline-none text-xs custom-input"
                style={{
                  borderColor: COLORS.borderDark, // Was border-gray-300
                  color: COLORS.textPrimary,
                }}
              />
            </div>
          </div>

          {/* Cash/Bank Ledger */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label
              className="w-32"
              style={{ color: COLORS.textPrimary }} // Was text-gray-700
            >
              Cash/Bank Ledger
            </label>
            <div className="flex-1 flex items-center gap-1">
              <div className="relative flex-1">
                <select
                  className="w-full border rounded-sm py-1 px-2 appearance-none outline-none text-xs custom-input"
                  style={{
                    borderColor: COLORS.borderDark, // Was border-gray-300
                    backgroundColor: COLORS.white,
                    color: COLORS.textPrimary,
                  }}
                >
                  <option>Cash In Hand</option>
                </select>
              </div>
              <button
                className="custom-btn-primary text-white p-1.5 rounded-sm"
                style={{ color: COLORS.white }}
              >
                <Edit2 size={12} />
              </button>
            </div>
          </div>

          {/* --- Attachment Section --- */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <label
              className="w-32 pt-2"
              style={{ color: COLORS.textPrimary }} // Was text-gray-700
            >
              Attachment
            </label>
            <Attachment />
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

          {/* Special Rows with Dual Inputs */}
          <div className="grid grid-cols-[1fr_60px_120px] gap-2 items-center">
            <label
              className="text-xs uppercase"
              style={{ color: COLORS.textSecondary }} // Was text-gray-600
            >
              DISCOUNT
            </label>
            <input
              type="text"
              defaultValue="0"
              className="border rounded-sm px-2 py-1 text-right text-xs outline-none custom-input"
              style={{
                borderColor: COLORS.borderDark, // Was border-gray-300
                color: COLORS.textPrimary,
              }}
            />
            <div className="relative">
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: COLORS.textMuted }} // Was text-gray-500
              >
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                readOnly
                className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
                style={{
                  backgroundColor: COLORS.background, // Was bg-gray-50
                  borderColor: COLORS.borderDark, // Was border-gray-300
                  color: COLORS.textSecondary,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_60px_120px] gap-2 items-center">
            <label
              className="text-xs uppercase"
              style={{ color: COLORS.textSecondary }} // Was text-gray-600
            >
              DISCOUNT %
            </label>
            <input
              type="text"
              defaultValue="0"
              className="border rounded-sm px-2 py-1 text-right text-xs outline-none custom-input"
              style={{
                borderColor: COLORS.borderDark, // Was border-gray-300
                color: COLORS.textPrimary,
              }}
            />
            <div className="relative">
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: COLORS.textMuted }} // Was text-gray-500
              >
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                readOnly
                className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
                style={{
                  backgroundColor: COLORS.background, // Was bg-gray-50
                  borderColor: COLORS.borderDark, // Was border-gray-300
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
              style={{ color: COLORS.textPrimary }} // Was text-gray-800
            >
              Doc Amount
            </label>
            <div className="relative">
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold"
                style={{ color: COLORS.textPrimary }} // Was text-gray-800
              >
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                readOnly
                className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs font-bold outline-none"
                style={{
                  backgroundColor: COLORS.background, // Was bg-gray-50
                  borderColor: COLORS.borderDark, // Was border-gray-300
                  color: COLORS.textPrimary, // Was text-gray-800
                }}
              />
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
const TotalRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <div className="grid grid-cols-[1fr_120px] gap-2 items-center">
      <label className="text-xs" style={{ color: COLORS.textSecondary }}>
        {/* Was text-gray-600 */}
        {label}
      </label>
      <div className="relative">
        <span
          className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
          style={{ color: COLORS.textMuted }} // Was text-gray-500
        >
          ₹
        </span>
        <input
          type="text"
          defaultValue={value}
          readOnly
          className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none custom-input"
          style={{
            backgroundColor: COLORS.background, // Was bg-gray-50
            borderColor: COLORS.borderDark, // Was border-gray-300
            color: COLORS.textPrimary,
          }}
        />
      </div>
    </div>
  );
};

export default InvoiceFooter;
