import React from "react";
import { PrinterIcon, DownloadIcon, PlusCircleIcon } from "lucide-react"; // Using proper, clear icons from lucide-react
import { COLORS } from "../../../../../constants/colors";
import { RestoreIcon } from "../../../../../components/icons";

// --- Interfaces ---
interface HeaderButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

// --- Components ---
const HeaderButton: React.FC<HeaderButtonProps> = ({
  label,
  icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1 border border-white/30 rounded-[3px] text-white text-xs font-medium hover:bg-white/10 hover:border-white/50 transition-colors active:bg-white/20"
    >
      <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default function InventoryHeader() {
  return (
    <div className="w-full border-t" style={{ borderColor: COLORS.borderDark }}>
      <header
        className="flex flex-wrap items-center justify-between w-full px-4 py-1 shadow-md transition-colors duration-300"
        style={{ backgroundColor: COLORS.primary }}
      >
        <div className="flex items-center gap-2">
          <div className="w-0 md:w-12 lg:w-24"></div>

          {/* Load Item Master Data */}
          <HeaderButton
            label="Click To Load Item Master Data"
            icon={<RestoreIcon className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {/* Print */}
          <HeaderButton
            label="Print"
            icon={<PrinterIcon className="w-4 h-4" />}
          />

          {/* Download Pre-Configured Items */}
          <HeaderButton
            label="Download Pre-Configured Items"
            icon={<DownloadIcon className="w-4 h-4" />}
          />

          {/* Create New Item Master */}
          <HeaderButton
            label="Create New Item Master"
            icon={<PlusCircleIcon className="w-4 h-4" />}
          />
        </div>
      </header>
    </div>
  );
}
