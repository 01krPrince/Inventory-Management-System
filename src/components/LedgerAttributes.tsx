import React from "react";
import { EditIcon, ChevronRight } from "lucide-react";
import { COLORS } from "../constants/colors";

const LedgerAttributes: React.FC = () => {
  return (
    <div
      className="w-full p-4 font-sans"
      style={{ backgroundColor: COLORS.white }}
    >
      {/* Section Title */}
      <h3
        className="text-sm font-medium mb-3"
        style={{ color: COLORS.textPrimary }}
      >
        Financial Posting (Ledger) Attributes - Select if applicable
      </h3>

      {/* Form Rows Container */}
      <div className="flex flex-col gap-3 max-w-3xl">
        {/* Row 1: Employee */}
        <AttributeRow label="Employee" />

        {/* Row 2: Group */}
        <AttributeRow label="Group" />
      </div>

      {/* --- GLOBAL STYLES FOR THIS COMPONENT --- */}
      <style>{`
        /* Reuse the primary button style */
        .custom-btn-primary {
          background-color: ${COLORS.primary};
          transition: background-color 0.2s;
        }
        .custom-btn-primary:hover {
          background-color: ${COLORS.primaryHover};
        }

        /* Custom Focus State for Inputs */
        .custom-input:focus {
          border-color: ${COLORS.info} !important; 
        }
      `}</style>
    </div>
  );
};

// --- Reusable Row Component ---
interface AttributeRowProps {
  label: string;
}

const AttributeRow: React.FC<AttributeRowProps> = ({ label }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      {/* Label */}
      <label className="w-32 text-sm" style={{ color: COLORS.textPrimary }}>
        {label}
      </label>

      {/* Input Group */}
      <div className="flex-1 flex items-center gap-1">
        {/* Input Field Wrapper with Icon */}
        <div className="relative flex-1 cursor-pointer group">
          <input
            type="text"
            placeholder="Select..."
            readOnly
            className="w-full border rounded-sm py-1.5 px-3 text-xs outline-none cursor-pointer custom-input"
            style={{
              borderColor: COLORS.borderDark,
              backgroundColor: COLORS.white,
              color: COLORS.textSecondary,
            }}
          />
          {/* Right Arrow Icon */}
          <ChevronRight
            size={14}
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
            strokeWidth={2.5}
            style={{ color: COLORS.textPrimary }}
          />
        </div>

        {/* Edit Button */}
        <button
          className="custom-btn-primary p-1.5 rounded-sm transition-colors flex-shrink-0"
          style={{ color: COLORS.white }}
        >
          <EditIcon size={14} />
        </button>
      </div>
    </div>
  );
};

export default LedgerAttributes;
