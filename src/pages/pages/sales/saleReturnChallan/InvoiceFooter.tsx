import React from "react";
import { COLORS } from "../../../../constants/colors";
import Attachment from "../../../../components/Attachment";

type InvoiceFooterProps = {
  amount?: number;
};

const InvoiceFooter: React.FC<InvoiceFooterProps> = () => {
  return (
    <div
      className=" p-4 font-sans text-sm w-2/3"
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

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <label className="w-32 pt-2" style={{ color: COLORS.textPrimary }}>
              Attachment
            </label>
            <div className="flex-1">
              <Attachment />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFooter;
