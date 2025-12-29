import React from "react";
import { COLORS } from "../../../../constants/colors";
import Attachment from "../../../../components/Attachment";
import { EditIcon } from "lucide-react";
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";

// --- Types ---
type InvoiceFooterProps = {
  amount?: number;
};

interface LedgerOption {
  id: string;
  name: string;
}

const ActionBtn: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ icon, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-[30px] w-[30px] bg-[var(--theme-primary)] text-white flex items-center justify-center rounded-sm border border-[var(--theme-primary)] hover:opacity-90 transition-opacity ml-[-1px] z-10 shrink-0 ${className}`}
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
  <div className="flex items-center w-full relative gap-1">{children}</div>
);

const TotalRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
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
          defaultValue={value}
          readOnly
          className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none custom-input"
          style={{
            backgroundColor: COLORS.background,
            borderColor: COLORS.borderDark,
            color: COLORS.textPrimary,
          }}
        />
      </div>
    </div>
  );
};

// --- Main Component ---

const GoodsRecieptNoteFooter: React.FC<InvoiceFooterProps> = ({
  amount = -8500,
}) => {
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

  // Handler to prevent crash
  const handleFieldChange = (field: string, value: any) => {
    console.log(`Field changed: ${field}, Value:`, value);
  };

  // Define Columns for the Dropdown based on your Interface
  const ledgerColumns: ColumnDef<LedgerOption>[] = [
    { header: "Ledger Name", key: "name", width: "100%" },
  ];

  // Dummy data for the dropdown (Replace with actual data source)
  const ledgerData: LedgerOption[] = [
    { id: "1", name: "Cash Account" },
    { id: "2", name: "Bank Account" },
  ];

  return (
    <div
      className="w-full p-4 font-sans text-sm"
      style={{ backgroundColor: COLORS.white }}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* --- LEFT SECTION (Inputs & Attachments) --- */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Remarks */}
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

          {/* --- Attachment Section --- */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <label className="w-32 pt-2" style={{ color: COLORS.textPrimary }}>
              Attachment
            </label>
            <div className="flex-1">
              <Attachment />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_60px_120px] gap-2 items-center">
            <label
              className="text-xs uppercase"
              style={{ color: COLORS.textSecondary }}
            >
              Transport
            </label>
            <input
              type="text"
              defaultValue=""
              className="border rounded-sm px-2 py-1 text-right text-xs outline-none custom-input"
              style={{
                borderColor: COLORS.borderDark,
                color: COLORS.textPrimary,
              }}
            />
          </div>

          <div className="grid grid-cols-[1fr_60px_120px] gap-2 items-center">
            <label
              className="text-xs uppercase"
              style={{ color: COLORS.textSecondary }}
            >
              Advance Amount (% & ₹)
            </label>
            <input
              type="text"
              defaultValue="0"
              className="border rounded-sm px-2 py-1 text-right text-xs outline-none custom-input"
              style={{
                borderColor: COLORS.borderDark,
                color: COLORS.textPrimary,
              }}
            />
            <div className="relative">
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: COLORS.textMuted }}
              >
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                readOnly
                className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.borderDark,
                  color: COLORS.textSecondary,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <Label>Advance Ledger</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown<LedgerOption>
                  data={ledgerData}
                  columns={ledgerColumns}
                  value={""}
                  valueKey="name"
                  placeholder="Select..."
                  onChange={(val: any) =>
                    handleFieldChange("priceCategory", val)
                  }
                />
                <ActionBtn icon={<EditIcon size={14} />} />
              </InputGroup>
            </div>
          </div>
        </div>

        {/* --- RIGHT SECTION (Totals) --- */}
        <div className="w-full lg:w-[400px] flex flex-col gap-2">
          <TotalRow label="Item Value" value="0.00" />
          <TotalRow label="Discount" value="0.00" />
          <TotalRow label="Promo Discount" value="0.00" />
          <TotalRow label="Taxable" value="0.00" />
          <TotalRow label="Tax Amount" value="0.00" />

          <div className="grid grid-cols-[1fr_60px_120px] gap-2 items-center">
            <label
              className="text-xs uppercase"
              style={{ color: COLORS.textSecondary }}
            >
              Transport
            </label>
            <input
              type="text"
              defaultValue="0"
              className="border rounded-sm px-2 py-1 text-right text-xs outline-none custom-input"
              style={{
                borderColor: COLORS.borderDark,
                color: COLORS.textPrimary,
              }}
            />
            <div className="relative">
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: COLORS.textMuted }}
              >
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                readOnly
                className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.borderDark,
                  color: COLORS.textSecondary,
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-[1fr_60px_120px] gap-2 items-center">
            <label
              className="text-xs uppercase"
              style={{ color: COLORS.textSecondary }}
            >
              DISCOUNT
            </label>
            <input
              type="text"
              defaultValue="0"
              className="border rounded-sm px-2 py-1 text-right text-xs outline-none custom-input"
              style={{
                borderColor: COLORS.borderDark,
                color: COLORS.textPrimary,
              }}
            />
            <div className="relative">
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: COLORS.textMuted }}
              >
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                readOnly
                className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.borderDark,
                  color: COLORS.textSecondary,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_60px_120px] gap-2 items-center">
            <label
              className="text-xs uppercase"
              style={{ color: COLORS.textSecondary }}
            >
              Adjustment
            </label>
            <input
              type="text"
              defaultValue="0"
              className="border rounded-sm px-2 py-1 text-right text-xs outline-none custom-input"
              style={{
                borderColor: COLORS.borderDark,
                color: COLORS.textPrimary,
              }}
            />
            <div className="relative">
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: COLORS.textMuted }}
              >
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                readOnly
                className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.borderDark,
                  color: COLORS.textSecondary,
                }}
              />
            </div>
          </div>

          <TotalRow label="Round Off" value="0.00" />

          {/* Doc Amount (Bold) */}
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
                  color: COLORS.textPrimary,
                }}
              />
            </div>
          </div>

          {/* Payment Status Display */}
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

          {/* Generate EMI Button */}
          <div className="flex justify-end mt-2">
            <button
              className="custom-btn-primary text-xs font-medium px-4 py-1.5 rounded-sm shadow-sm"
              style={{ color: COLORS.white }}
            >
              Generate EMI
            </button>
          </div>
        </div>
      </div>

      {/* --- GLOBAL STYLES FOR HOVER & FOCUS --- */}
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

export default GoodsRecieptNoteFooter;
