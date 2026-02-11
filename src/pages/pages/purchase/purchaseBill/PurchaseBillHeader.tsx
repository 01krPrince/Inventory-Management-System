import React from 'react';
import {
  OpenIcon,
  DeleteIcon,
  CopyIcon,
  CancelIcon,
  RestoreIcon,
  CalculatorIcon,
  HelpIcon,
  ConfigurationIcon,
} from '../../../../components/icons';
import { COLORS } from '../../../../constants/colors';

interface HeaderButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ label, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-[3px] border border-white/30 px-3 py-1 text-xs font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10 active:bg-white/20">
      <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default function PurchaseBillHeader() {
  return (
    <div className="w-full border-t" style={{ borderColor: COLORS.borderDark }}>
      <header
        className="flex w-full flex-wrap items-center justify-between px-4 py-1 shadow-md transition-colors duration-300"
        style={{ backgroundColor: COLORS.primary }}>
        <div className="flex items-center gap-2">
          <div className="w-0 md:w-12 lg:w-24"></div>

          <HeaderButton label="Open" icon={<OpenIcon className="h-full w-full" />} />

          <HeaderButton label="Delete" icon={<DeleteIcon className="h-full w-full" />} />

          <HeaderButton label="Copy" icon={<CopyIcon className="h-full w-full" />} />

          <HeaderButton label="Cancel" icon={<CancelIcon className="h-full w-full stroke-[3]" />} />

          <HeaderButton label="Restore" icon={<RestoreIcon className="h-full w-full" />} />
        </div>

        <div className="mt-2 flex items-center gap-2 sm:mt-0">
          <HeaderButton label="Calculator" icon={<CalculatorIcon className="h-full w-full" />} />

          <HeaderButton label="Help" icon={<HelpIcon className="h-full w-full" />} />

          <HeaderButton
            label="Configuration"
            icon={<ConfigurationIcon className="h-full w-full" />}
          />
        </div>
      </header>
    </div>
  );
}
