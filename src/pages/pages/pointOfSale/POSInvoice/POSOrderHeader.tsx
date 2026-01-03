import React from "react";
import {
  DeleteIcon,
  CopyIcon,
  RestoreIcon,
  CalculatorIcon,
  CancelIcon,
} from "../../../../components/icons";
import { COLORS } from "../../../../constants/colors";
import { PlusIcon, X, FileText } from "lucide-react";

// --- Interfaces ---

export interface InvoiceTab {
  id: string;
  name: string;
  data: {
    rows: string[];
    tableData: Record<string, any>;
  };
}

interface HeaderButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

// --- UPDATED PROPS INTERFACE ---
interface POSInvoiceHeaderProps {
  tabs: InvoiceTab[];
  activeTabId: string;
  onNewTab: () => void;
  onCopyTab: () => void;
  onDeleteTab: () => void; // Ensure this exists
  onRestoreTab: () => void; // Ensure this exists
  onResetTab: () => void; // Ensure this exists
  onSwitchTab: (id: string) => void;
  onCloseSpecificTab: (e: React.MouseEvent, id: string) => void;
}

// --- Components ---

const HeaderButton: React.FC<HeaderButtonProps> = ({
  label,
  icon,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1 border border-white/30 rounded-[3px] text-white text-xs font-medium hover:bg-white/10 hover:border-white/50 transition-colors active:bg-white/20 ${className}`}
    >
      <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      <span className="hidden xl:inline">{label}</span>
    </button>
  );
};

export default function POSInvoiceHeader({
  tabs,
  activeTabId,
  onNewTab,
  onCopyTab,
  onDeleteTab,
  onRestoreTab,
  onResetTab, // Destructure the new prop
  onSwitchTab,
  onCloseSpecificTab,
}: POSInvoiceHeaderProps) {
  return (
    <div className="w-full border-t" style={{ borderColor: COLORS.borderDark }}>
      <header
        className="flex items-center justify-between w-full px-4 py-1 shadow-md transition-colors duration-300 gap-4"
        style={{ backgroundColor: COLORS.primary }}
      >
        {/* Left Side: Configuration Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <HeaderButton
            label="New"
            icon={<PlusIcon className="w-full h-full" />}
            onClick={onNewTab}
          />

          <HeaderButton
            label="Copy"
            icon={<CopyIcon className="w-full h-full" />}
            onClick={onCopyTab}
          />

          {/* Reset Button */}
          <HeaderButton
            label="Reset"
            icon={<CancelIcon className="w-full h-full" />}
            onClick={onResetTab}
          />

          <HeaderButton
            label="Restore"
            icon={<RestoreIcon className="w-full h-full" />}
            onClick={onRestoreTab}
          />

          <HeaderButton
            label="Delete"
            icon={<DeleteIcon className="w-full h-full" />}
            onClick={onDeleteTab}
          />

          <HeaderButton
            label="Calc"
            icon={<CalculatorIcon className="w-full h-full" />}
          />
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-white/20 mx-2 shrink-0"></div>

        {/* Right Side: Tab List */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => onSwitchTab(tab.id)}
                className={`
                  group flex items-center gap-2 px-3 py-1.5 rounded-t-md cursor-pointer border-t border-x text-xs font-medium min-w-[120px] max-w-[160px] justify-between
                  ${
                    isActive
                      ? "bg-gray-100 text-[var(--theme-primary)] border-white"
                      : "bg-white/10 text-white/80 border-transparent hover:bg-white/20"
                  }
                `}
                style={isActive ? { color: COLORS.primary } : {}}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText size={12} />
                  <span className="truncate">{tab.name}</span>
                </div>

                <button
                  onClick={(e) => onCloseSpecificTab(e, tab.id)}
                  className={`p-0.5 rounded-full hover:bg-red-500 hover:text-white transition-colors ${
                    isActive ? "text-gray-400" : "text-white/60"
                  }`}
                >
                  <X size={10} />
                </button>
              </div>
            );
          })}
        </div>
      </header>
    </div>
  );
}
