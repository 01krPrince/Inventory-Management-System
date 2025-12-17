import React, { useState } from "react";
import { X, Save, Trash2, Edit2 } from "lucide-react";
import Dropdown, { ColumnDef } from "./Dropdown"; // Ensure this path is correct

// --- Types ---
interface TenderTypeData {
  code: string;
  name: string;
  underCountry: string;
}

interface TenderTypeProps {
  onClose: () => void;
}

interface DropdownItem {
  name: string;
  code?: string;
  [key: string]: any;
}

// --- Mock Data ---
const mockOptions = {
  types: [
    { name: "Cash", code: "CASH" },
    { name: "Credit Card", code: "CC" },
    { name: "Wallet", code: "WLT" },
    { name: "Cheque", code: "CHQ" },
  ],
  glAccounts: [
    { name: "Cash in Hand", code: "GL001" },
    { name: "HDFC Bank", code: "GL002" },
    { name: "Petty Cash", code: "GL003" },
  ],
};

const State: React.FC<TenderTypeProps> = ({ onClose }) => {
  // --- State ---
  const [formData, setFormData] = useState<TenderTypeData>({
    code: "0001",
    name: "",
    underCountry: "",
  });

  const handleChange = (field: keyof TenderTypeData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const themeColor = "#0f3c63";

  // --- Column Definition for Dropdowns ---
  const defaultColumns: ColumnDef<DropdownItem>[] = [
    { header: "Name", key: "name", width: "w-full" },
  ];

  // --- Sub-Components ---

  const ActionBtn: React.FC<{
    icon: React.ReactNode;
    onClick?: () => void;
  }> = ({ icon, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="h-[30px] w-[30px] bg-[#0f3c63] text-white flex items-center justify-center rounded-r-sm border border-[#0f3c63] hover:opacity-90 transition-opacity z-10 shrink-0"
    >
      {icon}
    </button>
  );

  const FormRow = ({
    label,
    children,
    required,
  }: {
    label: string;
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <div className="grid grid-cols-12 gap-2 items-center mb-2">
      <div className="col-span-4 text-gray-800 font-medium text-[13px]">
        {label}
        {required && <span className="text-red-500 ml-1">★</span>}
      </div>
      <div className="col-span-8 flex items-center">{children}</div>
    </div>
  );

  const FooterBtn = ({
    label,
    icon,
    onClick,
  }: {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-1.5 border border-white text-white text-sm font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors"
    >
      {icon}
      {label}
    </button>
  );

  return (
    // Overlay
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 h-80vh">
      {/* Container */}
      <div className="w-full max-w-xl bg-white border border-gray-300 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
        {/* --- Header --- */}
        <div
          className="flex justify-between items-center px-4 py-2 text-white"
          style={{ backgroundColor: themeColor }}
        >
          <span className="font-semibold tracking-wide text-sm">State</span>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded p-0.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- Form Body --- */}
        <div className="p-6 overflow-y-auto">
          {/* Code (Read Only) */}
          <FormRow label="Code">
            <input
              type="text"
              readOnly
              className="w-full h-[30px] border border-gray-300 bg-gray-50 text-gray-600 px-2 outline-none focus:border-[#0f3c63] rounded-sm text-sm cursor-not-allowed"
              value={formData.code}
            />
          </FormRow>

          <FormRow label="Name" required>
            <input
              type="text"
              className="w-full h-[30px] border border-gray-300 px-2 outline-none focus:border-[#0f3c63] rounded-sm text-sm"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </FormRow>

          <FormRow label="Under Country">
            <div className="w-full flex">
              <Dropdown
                data={mockOptions.glAccounts}
                columns={defaultColumns}
                value={formData.underCountry}
                valueKey="name"
                onChange={(item) =>
                  handleChange("underCountry", item?.name || "")
                }
                placeholder="Select GL Account..."
              />
              <ActionBtn icon={<Edit2 size={14} />} />
            </div>
          </FormRow>
        </div>

        {/* --- Footer --- */}
        <div
          className="p-3 flex gap-3 border-t border-gray-300 mt-auto"
          style={{ backgroundColor: themeColor }}
        >
          <FooterBtn label="Save" icon={<Save size={16} />} />
          <FooterBtn label="Delete" icon={<Trash2 size={16} />} />
        </div>
      </div>
    </div>
  );
};

export default State;
