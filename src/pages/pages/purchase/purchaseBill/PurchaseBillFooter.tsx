import React, { useState, useEffect } from "react";
import { EditIcon } from "lucide-react";
import { COLORS } from "../../../../constants/colors";
import Attachment from "../../../../components/Attachment";
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";

import ChartOfAccounts from "../../../../components/ChartOfAccount";

import {
  SalesAndPurchaseGL,
  fetchSalesAndPurchaseGL,
} from "../../../../components/addItemMaster/api/saleAndPurchaseGL";

// --- Types ---
type InvoiceFooterProps = {
  amount?: number;
  remarks: string;
  onRemarksChange: (val: string) => void;
  selectedLedger?: string;
  onLedgerChange?: (val: string) => void;
};

// --- Sub-Components ---

const ActionBtn: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ icon, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-[30px] w-[30px] bg-[var(--theme-primary)] text-white flex items-center justify-center rounded-sm border border-[var(--theme-primary)] hover:opacity-90 transition-opacity ml-[-1px] z-10 shrink-0 ${className}`}
    style={{ backgroundColor: COLORS.primary }}
  >
    <span className="flex items-center justify-center">{icon}</span>
  </button>
);

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="text-[13px] text-gray-700 font-medium flex items-center h-[30px] whitespace-nowrap">
    {children} {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const InputGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center w-full relative gap-0">{children}</div>
);

const TotalRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="grid grid-cols-[1fr_120px] gap-2 items-center">
    <label className="text-xs" style={{ color: COLORS.textSecondary }}>
      {label}
    </label>
    <div className="relative">
      <span
        className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
        style={{ color: COLORS.textMuted }}
      >
        ₹
      </span>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
        style={{
          backgroundColor: COLORS.background,
          borderColor: COLORS.borderDark,
          color: COLORS.textPrimary,
        }}
      />
    </div>
  </div>
);

// --- Main Component ---

const PurchaseBillFooter: React.FC<InvoiceFooterProps> = ({
  amount = -8500,
  remarks,
  onRemarksChange,
  selectedLedger: externalLedger,
  onLedgerChange,
}) => {
  // --- States ---
  const [glOptions, setGlOptions] = useState<SalesAndPurchaseGL[]>([]);
  const [internalLedger, setInternalLedger] = useState<string>("Cash In Hand");
  const [showCOA, setShowCOA] = useState(false);
  const [coaFormData, setCoaFormData] = useState<SalesAndPurchaseGL | null>(
    null,
  );

  const currentLedger = externalLedger || internalLedger;

  // --- Data Loading ---
  const loadLedgers = async () => {
    try {
      const glData = await fetchSalesAndPurchaseGL();
      if (Array.isArray(glData)) {
        const mappedData = glData.map((item) => ({
          ...item,
          label: item.name,
          value: item._id,
        }));
        setGlOptions(mappedData);
      }
    } catch (error) {
      console.error("Error loading ledger data:", error);
    }
  };

  useEffect(() => {
    loadLedgers();
  }, []);

  // --- Handlers ---
  const handleOpenCOA = () => {
    // Find existing data if editing, or pass name for creation
    const selectedItem = glOptions.find((item) => item.name === currentLedger);
    setCoaFormData(
      selectedItem || ({ name: currentLedger } as SalesAndPurchaseGL),
    );
    setShowCOA(true);
  };

  const handleSaveCOA = (savedData: SalesAndPurchaseGL) => {
    const savedName = savedData?.name;
    if (savedName) {
      if (onLedgerChange) onLedgerChange(savedName);
      else setInternalLedger(savedName);
      loadLedgers(); // Refresh the list
    }
    setShowCOA(false);
  };

  const ledgerColumns: ColumnDef<SalesAndPurchaseGL>[] = [
    { header: "Code", key: "code", width: "w-24" },
    { header: "Ledger Name", key: "name", width: "w-full" },
  ];

  // Logic for Payment Status
  const isAdvance = amount > 0;
  const isDue = amount < 0;
  const statusText = isAdvance
    ? "Advance Paid"
    : isDue
      ? "Due Amount"
      : "Fully Paid";
  const statusColor = isAdvance
    ? "text-green-600 bg-green-100"
    : isDue
      ? "text-red-600 bg-red-100"
      : "text-gray-600 bg-gray-100";

  return (
    <div
      className="w-full p-4 font-sans text-sm border-t"
      style={{ backgroundColor: COLORS.white }}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* --- LEFT SECTION --- */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Remarks */}
          <div className="flex flex-col sm:flex-row gap-4">
            <label
              className="w-32 mt-1 text-xs font-medium"
              style={{ color: COLORS.textPrimary }}
            >
              Remarks
            </label>
            <div className="flex-1 relative">
              <textarea
                className="w-full border rounded-sm p-2 h-20 outline-none resize-none text-xs custom-input"
                placeholder="Enter remarks here..."
                value={remarks}
                onChange={(e) => onRemarksChange(e.target.value)}
                style={{
                  borderColor: COLORS.borderDark,
                  color: COLORS.textPrimary,
                }}
              />
              <span
                className="absolute bottom-2 right-2 text-[10px]"
                style={{ color: COLORS.textMuted }}
              >
                {remarks.length}/250
              </span>
            </div>
          </div>

          {/* Paid Amount Input */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label
              className="w-32 text-xs font-medium"
              style={{ color: COLORS.textPrimary }}
            >
              Paid Amount
            </label>
            <div className="w-40 relative">
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: COLORS.textMuted }}
              >
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                className="w-full border rounded-sm py-1 pl-6 pr-2 text-right outline-none text-xs custom-input"
                style={{
                  borderColor: COLORS.borderDark,
                  color: COLORS.textPrimary,
                }}
              />
            </div>
          </div>

          {/* Cash/Bank Ledger with Chart of Accounts functionality */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-32">
              <Label>Cash/Bank Ledger</Label>
            </div>
            <div className="flex-1">
              <InputGroup>
                <div className="flex-1">
                  <Dropdown<SalesAndPurchaseGL>
                    data={glOptions}
                    columns={ledgerColumns}
                    value={currentLedger}
                    valueKey="name"
                    placeholder="Select Ledger..."
                    onChange={(item) => {
                      if (onLedgerChange) onLedgerChange(item?.name || "");
                      else setInternalLedger(item?.name || "");
                    }}
                  />
                </div>
                <ActionBtn
                  icon={<EditIcon size={14} />}
                  onClick={handleOpenCOA}
                />
              </InputGroup>
            </div>
          </div>

          {/* Attachment Section */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <label
              className="w-32 pt-2 text-xs font-medium"
              style={{ color: COLORS.textPrimary }}
            >
              Attachment
            </label>
            <div className="flex-1">
              <Attachment />
            </div>
          </div>
        </div>

        {/* --- RIGHT SECTION (Totals) --- */}
        <div className="w-full lg:w-[400px] flex flex-col gap-2">
          <TotalRow label="Item Value" value="0.00" />
          <TotalRow label="Discount" value="0.00" />
          <TotalRow label="Taxable" value="0.00" />
          <TotalRow label="Tax Amount" value="0.00" />
          <TotalRow label="Round Off" value="0.00" />

          {/* Doc Amount */}
          <div className="grid grid-cols-[1fr_120px] gap-2 items-center mt-1">
            <label
              className="text-xs font-bold"
              style={{ color: COLORS.textPrimary }}
            >
              Doc Amount
            </label>
            <div className="relative">
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                readOnly
                className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs font-bold outline-none"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.borderDark,
                }}
              />
            </div>
          </div>

          {/* Payment Status */}
          <div className="grid grid-cols-[1fr_160px] gap-2 items-center mt-1">
            <label className="text-xs font-bold text-gray-800">
              Payment Status
            </label>
            <div
              className={`flex items-center justify-between px-2 py-1 rounded text-xs font-bold ${statusColor}`}
            >
              <span>{statusText}</span>
              <span>
                {isAdvance && "+"}
                {isDue && "-"} ₹{Math.abs(amount).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <button className="custom-btn-primary text-white text-xs font-medium px-4 py-1.5 rounded-sm shadow-sm">
              Generate EMI
            </button>
          </div>
        </div>
      </div>

      {/* --- Chart of Accounts Modal --- */}
      {showCOA && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
          style={{ zIndex: 1000 }}
        >
          <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <ChartOfAccounts
              isOpen={showCOA}
              onClose={() => setShowCOA(false)}
              initialData={coaFormData}
              onSave={handleSaveCOA}
            />
          </div>
        </div>
      )}

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

export default PurchaseBillFooter;
