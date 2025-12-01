import React from "react";
import { COLORS } from "../../../../../constants/colors";
import Attachment from "../../../../../components/Attachment";

const InvoiceFooter: React.FC = () => {
  return (
    <div
      className="w-2/3 p-4 font-sans text-sm min-w-[600px]"
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

export default InvoiceFooter;
