import React, { useState } from "react";
import { X, Save, Trash2, Edit2 } from "lucide-react";
import Dropdown, { ColumnDef } from "./Dropdown"; // Ensure this path is correct

// --- Types ---
interface SalesExecutiveFormData {
  code: string;
  name: string;
  reportingTo: string;
  underStore: string;
  commissionRate: string;
  rateOn: string;
  amountType: string;
  email: string;
  phone: string;
  inactive: boolean;
}

interface SalesExecutiveMasterProps {
  onClose: () => void;
}

interface DropdownItem {
  name: string;
  code?: string;
  [key: string]: any;
}

// --- Mock Data ---
const mockOptions = {
  employees: [
    { name: "John Doe", code: "E001" },
    { name: "Jane Smith", code: "E002" },
  ],
  stores: [
    { name: "Main Store", code: "MAIN" },
    { name: "Branch A", code: "BR_A" },
  ],
  rateOnOptions: [
    { name: "Qty", code: "QTY" },
    { name: "Amount", code: "AMT" },
  ],
  amountTypes: [
    { name: "Taxable", code: "TAX" },
    { name: "Net", code: "NET" },
  ],
};

const SalesExecutiveMaster: React.FC<SalesExecutiveMasterProps> = ({
  onClose,
}) => {
  const [formData, setFormData] = useState<SalesExecutiveFormData>({
    code: "0001",
    name: "Default",
    reportingTo: "",
    underStore: "",
    commissionRate: "0",
    rateOn: "Qty",
    amountType: "Taxable",
    email: "",
    phone: "",
    inactive: false,
  });

  const handleChange = (field: keyof SalesExecutiveFormData, value: any) => {
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Container */}
      <div className="w-full max-w-xl bg-white border border-gray-300 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
        {/* --- Header --- */}
        <div
          className="flex justify-between items-center px-4 py-2 text-white"
          style={{ backgroundColor: themeColor }}
        >
          <span className="font-semibold tracking-wide text-sm">
            Sales Executive
          </span>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded p-0.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- Form Body --- */}
        <div className="p-6 overflow-y-auto">
          {/* Code */}
          <FormRow label="Code">
            <input
              type="text"
              readOnly
              className="w-full h-[30px] border border-gray-300 bg-gray-50 text-gray-600 px-2 outline-none focus:border-[#0f3c63] rounded-sm text-sm"
              value={formData.code}
            />
          </FormRow>

          {/* Name */}
          <FormRow label="Name" required>
            <input
              type="text"
              className="w-full h-[30px] border border-gray-300 px-2 outline-none focus:border-[#0f3c63] rounded-sm text-sm"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </FormRow>

          {/* Reporting To (Dropdown + ActionBtn) */}
          <FormRow label="Reporting To">
            <div className="w-full flex">
              <Dropdown
                data={mockOptions.employees}
                columns={defaultColumns}
                value={formData.reportingTo}
                valueKey="name"
                onChange={(item) =>
                  handleChange("reportingTo", item?.name || "")
                }
                placeholder="Select..."
              />
              <ActionBtn icon={<Edit2 size={14} />} />
            </div>
          </FormRow>

          {/* Under Store (Dropdown + ActionBtn) */}
          <FormRow label="Under Store">
            <div className="w-full flex">
              <Dropdown
                data={mockOptions.stores}
                columns={defaultColumns}
                value={formData.underStore}
                valueKey="name"
                onChange={(item) =>
                  handleChange("underStore", item?.name || "")
                }
                placeholder="Select..."
              />
              <ActionBtn icon={<Edit2 size={14} />} />
            </div>
          </FormRow>

          {/* Commission Rate */}
          <FormRow label="Commission Rate">
            <div className="w-full relative">
              <input
                type="text"
                className="w-full h-[30px] border border-gray-300 px-2 outline-none focus:border-[#0f3c63] rounded-sm text-sm text-right"
                value={formData.commissionRate}
                onChange={(e) => handleChange("commissionRate", e.target.value)}
              />
            </div>
          </FormRow>

          {/* Rate On */}
          <FormRow label="Rate On">
            <div className="w-full">
              <Dropdown
                data={mockOptions.rateOnOptions}
                columns={defaultColumns}
                value={formData.rateOn}
                valueKey="name"
                onChange={(item) => handleChange("rateOn", item?.name || "")}
                placeholder="Select..."
              />
            </div>
          </FormRow>

          {/* Amount Type */}
          <FormRow label="Amount Type">
            <div className="w-full">
              <Dropdown
                data={mockOptions.amountTypes}
                columns={defaultColumns}
                value={formData.amountType}
                valueKey="name"
                onChange={(item) =>
                  handleChange("amountType", item?.name || "")
                }
                placeholder="Select..."
              />
            </div>
          </FormRow>

          {/* Email */}
          <FormRow label="Email">
            <input
              type="email"
              className="w-full h-[30px] border border-gray-300 px-2 outline-none focus:border-[#0f3c63] rounded-sm text-sm"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </FormRow>

          {/* Phone */}
          <FormRow label="Phone">
            <input
              type="text"
              className="w-full h-[30px] border border-gray-300 px-2 outline-none focus:border-[#0f3c63] rounded-sm text-sm"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </FormRow>

          {/* Inactive Toggle */}
          <FormRow label="Inactive">
            <div className="w-full flex justify-end">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.inactive}
                  onChange={(e) => handleChange("inactive", e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f3c63]"></div>
                <span className="ml-2 text-sm font-medium text-gray-600">
                  {formData.inactive ? "ON" : "OFF"}
                </span>
              </label>
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

export default SalesExecutiveMaster;
