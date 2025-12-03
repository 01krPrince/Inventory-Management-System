import React, { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp, Globe, Edit2 } from "lucide-react";

// --- Types ---
export interface AccountFormData {
  id?: string | number; // Optional for new records
  name: string;
  code: string;
  identification: string;
  isSubledger: boolean;
  underGroup: string;
  type: string;
  accountNo: string;
  rtgsIfsc: string;
  classification: string;
  isLoanAccount: boolean;
  tdsApplicable: boolean;
  address: string;
  pan: string;
  // Attributes
  attrEmployee: boolean;
  attrGroup: boolean;
}

interface ChartOfAccountsProps {
  initialData?: AccountFormData | null; // Pass null for "Create", object for "Edit"
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AccountFormData) => void;
  onDelete?: (id: string | number) => void;
}

// --- Default State (Empty Form) ---
const defaultState: AccountFormData = {
  name: "",
  code: "00000001", // Example default sequence
  identification: "",
  isSubledger: false,
  underGroup: "",
  type: "General",
  accountNo: "",
  rtgsIfsc: "",
  classification: "",
  isLoanAccount: false,
  tdsApplicable: false,
  address: "",
  pan: "",
  attrEmployee: false,
  attrGroup: false,
};

// --- Helper Components ---

// 1. Custom Toggle Switch (Matches screenshot style)
const ToggleSwitch = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (val: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    className={`flex items-center w-16 h-6 rounded-sm transition-colors border ${
      value ? "bg-blue-900 border-blue-900" : "bg-gray-200 border-gray-300"
    }`}
  >
    <div
      className={`flex items-center justify-center w-1/2 h-full text-[10px] font-bold ${
        value ? "text-white" : "text-transparent"
      }`}
    >
      ON
    </div>
    <div
      className={`flex items-center justify-center w-1/2 h-full text-[10px] font-bold ${
        !value ? "text-gray-600" : "text-transparent"
      }`}
    >
      OFF
    </div>

    {/* The Slider Square */}
    <div
      className={`absolute w-8 h-5 bg-white shadow-sm border border-gray-300 rounded-sm transform transition-transform ${
        value ? "translate-x-8" : "translate-x-0"
      }`}
    />
  </button>
);

// 2. Form Row Layout
const FormRow = ({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="grid grid-cols-12 gap-4 items-center mb-2">
    <label className="col-span-4 text-sm text-gray-700 font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="col-span-8">{children}</div>
  </div>
);

// --- Main Component ---
const ChartOfAccounts: React.FC<ChartOfAccountsProps> = ({
  initialData,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  // State management
  const [formData, setFormData] = useState<AccountFormData>(defaultState);
  const [sections, setSections] = useState({ basic: true, attribute: true });

  // Mode detection
  const isEditMode = !!initialData;

  // Effect: Load data if in Edit mode, otherwise reset to default
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultState);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Handlers
  const handleChange = (field: keyof AccountFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section: "basic" | "attribute") => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = () => {
    // Basic validation logic could go here
    if (!formData.name || !formData.underGroup) {
      alert("Please fill required fields");
      return;
    }
    onSave(formData);
  };

  const handleClear = () => {
    setFormData(defaultState);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-sm shadow-xl flex flex-col max-h-[90vh]">
        {/* --- Header --- */}
        <div className="bg-[#1e4e79] text-white px-4 py-2 flex justify-between items-center rounded-t-sm">
          <h2 className="font-semibold text-sm">Chart of Accounts</h2>
          <button onClick={onClose} className="hover:bg-blue-800 rounded p-1">
            <X size={16} />
          </button>
        </div>

        {/* --- Scrollable Content --- */}
        <div className="overflow-y-auto p-4 flex-1">
          {/* Section: Basic */}
          <div className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer border-b border-gray-200 pb-1 mb-3"
              onClick={() => toggleSection("basic")}
            >
              <div className="flex items-center gap-2 text-[#1e4e79] font-bold text-sm">
                <span className="text-lg">📄</span> Basic
              </div>
              {sections.basic ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
            </div>

            {sections.basic && (
              <div className="space-y-1">
                {/* Name */}
                <FormRow label="Name" required>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                    <button className="bg-[#1e4e79] text-white p-1 ml-1 rounded-sm">
                      <Globe size={14} />
                    </button>
                  </div>
                </FormRow>

                {/* Code */}
                <FormRow label="Code">
                  <input
                    type="text"
                    disabled={true} // Usually code is auto-gen or locked in edit
                    className="w-full border border-gray-300 bg-gray-50 px-2 py-1 text-sm text-gray-600"
                    value={formData.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                  />
                </FormRow>

                {/* Identification */}
                <FormRow label="Identification">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                    value={formData.identification}
                    onChange={(e) =>
                      handleChange("identification", e.target.value)
                    }
                  />
                </FormRow>

                {/* Is Subledger */}
                <FormRow label="Is Subledger">
                  <ToggleSwitch
                    value={formData.isSubledger}
                    onChange={(val) => handleChange("isSubledger", val)}
                  />
                </FormRow>

                {/* Under Group */}
                <FormRow label="Under Group" required>
                  <div className="flex relative">
                    <select
                      className="w-full border border-gray-300 px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-500 appearance-none"
                      value={formData.underGroup}
                      onChange={(e) =>
                        handleChange("underGroup", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      <option value="Assets">Assets</option>
                      <option value="Liabilities">Liabilities</option>
                      <option value="Income">Income</option>
                      <option value="Expenses">Expenses</option>
                    </select>
                    <div className="absolute right-0 top-0 h-full flex items-center pr-8 pointer-events-none">
                      {/* Dropdown arrow handled by browser or custom CSS usually, kept simple here */}
                    </div>
                    <button className="bg-[#1e4e79] text-white p-1 ml-1 rounded-sm absolute right-0 top-0 h-full w-7 flex items-center justify-center">
                      <Edit2 size={12} />
                    </button>
                  </div>
                </FormRow>

                {/* Type */}
                <FormRow label="Type">
                  <select
                    className="w-full border border-gray-300 px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-500"
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                  </select>
                </FormRow>

                {/* AccountNo */}
                <FormRow label="AccountNo">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                    value={formData.accountNo}
                    onChange={(e) => handleChange("accountNo", e.target.value)}
                  />
                </FormRow>

                {/* RTGS/IFSC */}
                <FormRow label="RTGS/IFSC Code">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                    value={formData.rtgsIfsc}
                    onChange={(e) => handleChange("rtgsIfsc", e.target.value)}
                  />
                </FormRow>

                {/* Classification */}
                <FormRow label="Classification">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                    value={formData.classification}
                    onChange={(e) =>
                      handleChange("classification", e.target.value)
                    }
                  />
                </FormRow>

                {/* Is Loan Account */}
                <FormRow label="Is Loan Account">
                  <ToggleSwitch
                    value={formData.isLoanAccount}
                    onChange={(val) => handleChange("isLoanAccount", val)}
                  />
                </FormRow>

                {/* TDS Applicable */}
                <FormRow label="TDS Applicable">
                  <ToggleSwitch
                    value={formData.tdsApplicable}
                    onChange={(val) => handleChange("tdsApplicable", val)}
                  />
                </FormRow>

                {/* Address */}
                <FormRow label="Address">
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500 resize-none"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </FormRow>

                {/* PAN */}
                <FormRow label="PAN">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                    value={formData.pan}
                    onChange={(e) => handleChange("pan", e.target.value)}
                  />
                </FormRow>
              </div>
            )}
          </div>

          {/* Section: Attribute Applicable */}
          <div className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer border-b border-gray-200 pb-1 mb-3"
              onClick={() => toggleSection("attribute")}
            >
              <div className="flex items-center gap-2 text-[#1e4e79] font-bold text-sm">
                <span className="text-lg">📄</span> Attribute Applicable
              </div>
              {sections.attribute ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
            </div>

            {sections.attribute && (
              <div className="space-y-1">
                <FormRow label="Employee">
                  <ToggleSwitch
                    value={formData.attrEmployee}
                    onChange={(val) => handleChange("attrEmployee", val)}
                  />
                </FormRow>
                <FormRow label="Group">
                  <ToggleSwitch
                    value={formData.attrGroup}
                    onChange={(val) => handleChange("attrGroup", val)}
                  />
                </FormRow>
              </div>
            )}
          </div>
        </div>

        {/* --- Footer --- */}
        <div className="bg-[#1e4e79] px-4 py-2 flex gap-2 rounded-b-sm">
          <button
            onClick={handleSubmit}
            className="border border-white text-white px-4 py-1 text-sm rounded hover:bg-blue-800 transition-colors"
          >
            Save
          </button>

          <button
            onClick={handleClear}
            className="border border-white text-white px-4 py-1 text-sm rounded hover:bg-blue-800 transition-colors"
          >
            Clear
          </button>

          {isEditMode && onDelete && (
            <button
              onClick={() => onDelete(formData.id!)}
              className="border border-white text-white px-4 py-1 text-sm rounded hover:bg-red-600 transition-colors ml-auto"
            >
              Delete
            </button>
          )}

          {/* Add a fake delete button if in create mode just to match screenshot strictly, 
               or conditionally hide it as per logic above */}
          {!isEditMode && (
            <button className="border border-white text-white px-4 py-1 text-sm rounded hover:bg-blue-800 transition-colors">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartOfAccounts;
