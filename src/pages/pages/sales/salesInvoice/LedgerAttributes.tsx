import React from "react";
import { Edit2, ChevronRight } from "lucide-react";

const LedgerAttributes: React.FC = () => {
  return (
    <div className="w-full bg-white p-4 font-sans">
      {/* Section Title */}
      <h3 className="text-sm text-gray-800 font-medium mb-3">
        Financial Posting (Ledger) Attributes - Select if applicable
      </h3>

      {/* Form Rows Container */}
      <div className="flex flex-col gap-3 max-w-3xl">
        {/* Row 1: Employee */}
        <AttributeRow label="Employee" />

        {/* Row 2: Group */}
        <AttributeRow label="Group" />
      </div>
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
      <label className="w-32 text-sm text-gray-700">{label}</label>

      {/* Input Group */}
      <div className="flex-1 flex items-center gap-1">
        {/* Input Field Wrapper with Icon */}
        <div className="relative flex-1 cursor-pointer group">
          <input
            type="text"
            placeholder="Select..."
            readOnly
            className="w-full border border-gray-300 rounded-sm py-1.5 px-3 text-xs text-gray-600 placeholder-gray-400 outline-none focus:border-blue-500 bg-white cursor-pointer"
          />
          {/* Right Arrow Icon */}
          <ChevronRight
            size={14}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-800 pointer-events-none"
            strokeWidth={2.5}
          />
        </div>

        {/* Edit Button */}
        <button className="bg-[#0e4a7b] text-white p-1.5 rounded-sm hover:bg-blue-900 transition-colors flex-shrink-0">
          <Edit2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default LedgerAttributes;
