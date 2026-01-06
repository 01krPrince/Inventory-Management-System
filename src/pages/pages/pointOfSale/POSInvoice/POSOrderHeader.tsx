import React, { useRef } from "react";
import {
  DeleteIcon,
  CopyIcon,
  RestoreIcon,
  CalculatorIcon,
  CancelIcon,
} from "../../../../components/icons";
import { COLORS } from "../../../../constants/colors";
import { PlusIcon, X, FileText, ChevronLeft, ChevronRight } from "lucide-react";

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

interface POSInvoiceHeaderProps {
  tabs: InvoiceTab[];
  activeTabId: string;
  onNewTab: () => void;
  onCopyTab: () => void;
  onDeleteTab: () => void;
  onRestoreTab: () => void;
  onResetTab: () => void;
  onSwitchTab: (id: string) => void;
  onCloseSpecificTab: (e: React.MouseEvent, id: string) => void;
}

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
  onResetTab,
  onSwitchTab,
  onCloseSpecificTab,
}: POSInvoiceHeaderProps) {
  // 1. Create a Ref for the scrollable container
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // 2. Scroll Logic
  const handleScroll = (direction: "left" | "right") => {
    if (tabsContainerRef.current) {
      const scrollAmount = 150;
      const currentScroll = tabsContainerRef.current.scrollLeft;

      tabsContainerRef.current.scrollTo({
        left:
          direction === "left"
            ? currentScroll - scrollAmount
            : currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const ArrowButton = ({
    onClick,
    icon,
  }: {
    onClick: () => void;
    icon: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white transition-colors active:bg-white/30"
    >
      {icon}
    </button>
  );

  return (
    <div className="w-full border-t" style={{ borderColor: COLORS.borderDark }}>
      <header
        className="flex items-center justify-between w-full px-4 py-1 shadow-md transition-colors duration-300 gap-4"
        style={{ backgroundColor: COLORS.primary }}
      >
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

        <div className="flex-1 flex items-center min-w-0 gap-2">
          <div
            ref={tabsContainerRef}
            className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <div
                  key={tab.id}
                  onClick={() => onSwitchTab(tab.id)}
                  className={`
                  group flex items-center gap-2 px-3 py-1.5 rounded-t-md cursor-pointer border-t border-x text-xs font-medium min-w-[120px] max-w-[160px] justify-between shrink-0
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

          <div className="flex items-center gap-0.5 bg-black/20 rounded px-1 py-0.5 shrink-0 ml-1">
            <ArrowButton
              onClick={() => handleScroll("left")}
              icon={<ChevronLeft size={16} />}
            />
            <div className="w-px h-4 bg-white/20 mx-0.5"></div>
            <ArrowButton
              onClick={() => handleScroll("right")}
              icon={<ChevronRight size={16} />}
            />
          </div>
        </div>
      </header>
    </div>
  );
}
