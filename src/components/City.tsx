import React, { useState, useEffect } from "react";
import { X, Save, Trash2, Edit2 } from "lucide-react";
import Dropdown, { ColumnDef } from "./Dropdown";

// --- Types ---
export interface CityData {
  _id?: string;
  code: string;
  name: string;
  underState: string;
}

interface CityProps {
  onClose: () => void;
  initialData?: CityData | null;
  index?: number;
}

interface DropdownItem {
  name: string;
  code?: string;
  [key: string]: any;
}

// --- Mock Data ---
const mockOptions = {
  states: [
    { name: "Bihar", code: "BR" },
    { name: "Delhi", code: "DL" },
    { name: "Maharashtra", code: "MH" },
  ],
};

const City: React.FC<CityProps> = ({ onClose, initialData, index = 50 }) => {
  // --- Z-Index Logic ---
  const overlayZIndex = index + 10;
  const dropdownZIndex = overlayZIndex + 10;
  const themeColor = "#0f3c63";

  // --- State ---
  const [formData, setFormData] = useState<CityData>({
    code: "0001",
    name: "",
    underState: "",
  });

  // --- Effect: Handle Initial Data ---
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: "0001",
        name: "",
        underState: "",
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof CityData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{ zIndex: overlayZIndex }}
    >
      {/* Container */}
      <div className="w-full max-w-xl bg-white border border-gray-300 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
        {/* --- Header --- */}
        <div
          className="flex justify-between items-center px-4 py-2 text-white"
          style={{ backgroundColor: themeColor }}
        >
          <span className="font-semibold tracking-wide text-sm">
            {initialData ? "Edit City" : "Create City"}
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

          <FormRow label="Under State">
            <div className="w-full flex">
              <Dropdown
                data={mockOptions.states}
                columns={defaultColumns}
                value={formData.underState}
                valueKey="name"
                onChange={(item) =>
                  handleChange("underState", item?.name || "")
                }
                placeholder="Select State..."
                zIndex={dropdownZIndex}
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
          {initialData && (
            <FooterBtn label="Delete" icon={<Trash2 size={16} />} />
          )}
        </div>
      </div>
    </div>
  );
};

export default City;
