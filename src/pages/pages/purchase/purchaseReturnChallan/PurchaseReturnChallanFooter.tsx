import React from "react";
import { COLORS } from "../../../../constants/colors";
import Attachment from "../../../../components/Attachment";

// --- Types ---
type InvoiceFooterProps = {
  amount?: number;
};

const PurchaseReturnChallanFooter: React.FC<InvoiceFooterProps> = ({}) => {
  return (
    <div
      className="w-full p-4 font-sans text-sm"
      style={{ backgroundColor: COLORS.white }}
    >
      <div className="flex flex-col lg:flex-row gap-8 w-2/3">
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

          {/* --- Attachment Section --- */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <label className="w-32 pt-2" style={{ color: COLORS.textPrimary }}>
              Attachment
            </label>
            <div className="flex-1">
              <Attachment />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_60px_120px] gap-2 items-center">
            <label
              className="text-xs uppercase"
              style={{ color: COLORS.textSecondary }}
            >
              Transport
            </label>
            <input
              type="text"
              defaultValue=""
              className="border rounded-sm px-2 py-1 text-right text-xs outline-none custom-input"
              style={{
                borderColor: COLORS.borderDark,
                color: COLORS.textPrimary,
              }}
            />
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

export default PurchaseReturnChallanFooter;
