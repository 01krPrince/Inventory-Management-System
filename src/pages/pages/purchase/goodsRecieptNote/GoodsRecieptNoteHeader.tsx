import React from "react";
import {
  OpenIcon,
  DeleteIcon,
  CopyIcon,
  CancelIcon,
  RestoreIcon,
  CalculatorIcon,
  HelpIcon,
  ConfigurationIcon,
} from "../../../../components/icons";
import { COLORS } from "../../../../constants/colors";

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

export default function GoodsRecieptNoteHeader() {
  return (
    <div
      className="w-full border-t"
      style={{ borderColor: COLORS.borderDark }} // Used COLORS.borderDark
    >
      <header
        className="flex flex-wrap items-center justify-between w-full px-4 py-1 shadow-md transition-colors duration-300"
        style={{ backgroundColor: COLORS.primary }} // Used COLORS.primary
      >
        <div className="flex items-center gap-2">
          {/* Spacer for responsive alignment */}
          <div className="w-0 md:w-12 lg:w-24"></div>

          <HeaderButton
            label="Open"
            icon={<OpenIcon className="w-full h-full" />}
          />

          <HeaderButton
            label="Delete"
            icon={<DeleteIcon className="w-full h-full" />}
          />

          <HeaderButton
            label="Copy"
            icon={<CopyIcon className="w-full h-full" />}
          />

          <HeaderButton
            label="Cancel"
            icon={<CancelIcon className="w-full h-full stroke-[3]" />}
          />

          <HeaderButton
            label="Restore"
            icon={<RestoreIcon className="w-full h-full" />}
          />
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <HeaderButton
            label="Calculator"
            icon={<CalculatorIcon className="w-full h-full" />}
          />

          <HeaderButton
            label="Help"
            icon={<HelpIcon className="w-full h-full" />}
          />

          <HeaderButton
            label="Configuration"
            icon={<ConfigurationIcon className="w-full h-full" />}
          />
        </div>
      </header>
    </div>
  );
}
