import React from "react";
import { COLORS } from "../../../../constants/colors";
import Attachment from "../../../../components/Attachment";

// --- 1. Define Interfaces for Props ---
interface FooterData {
  remarks: string;
}

interface InvoiceFooterProps {
  data: FooterData;
  onDataChange: (data: FooterData) => void;
}

const InvoiceFooter: React.FC<InvoiceFooterProps> = ({
  data,
  onDataChange,
}) => {
  return (
    <div
      className="w-2/3 p-4 font-sans text-sm min-w-[600px]"
      style={{ backgroundColor: COLORS.white }}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="w-32 mt-1" style={{ color: COLORS.textPrimary }}>
              Remarks
            </label>
            <div className="flex-1 relative">
              <textarea
                className="w-full border rounded-sm p-2 h-20 outline-none resize-none text-xs custom-input"
                placeholder="Enter remarks..."
                // --- 2. Bind Data to Parent State ---
                value={data.remarks || ""}
                onChange={(e) =>
                  onDataChange({ ...data, remarks: e.target.value })
                }
                style={{
                  borderColor: COLORS.borderDark,
                  color: COLORS.textPrimary,
                }}
                maxLength={250}
              />
              <span
                className="absolute bottom-2 right-2 text-xs"
                style={{ color: COLORS.textMuted }}
              >
                {/* --- 3. Update Character Count Dynamically --- */}
                {(data.remarks || "").length}/250
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <label className="w-32 pt-2" style={{ color: COLORS.textPrimary }}>
              Attachment
            </label>
            {/* If Attachment needs to pass data back, you would pass props here too */}
            <Attachment />
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

export default InvoiceFooter;
