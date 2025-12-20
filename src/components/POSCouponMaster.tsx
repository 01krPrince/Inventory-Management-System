import React, { useState, useEffect } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  EditIcon,
  Save,
  Trash2,
  RotateCcw,
} from "lucide-react";

// --- Custom Component Import ---
import Dropdown, { ColumnDef } from "./Dropdown";

// --- Types & Interfaces ---
export interface POSCouponFormData {
  _id?: string; // Optional ID for existing coupons
  codeNo: string;
  validUpTo: string;
  calculation: string;
  value: string;
  maxAmount: string;
  useType: string;
  itemSet: string;
}

interface POSCouponMasterProps {
  onClose: () => void;
  index?: number;
  initialData?: POSCouponFormData | null;
}

// --- Static Data for Dropdowns ---
const calculationOptions = [
  { id: 1, label: "Percentage" },
  { id: 2, label: "Fixed Amount" },
];

const useTypeOptions = [
  { id: 1, label: "SingleUse" },
  { id: 2, label: "MultipleUse" },
  { id: 3, label: "SingleUsePerParty" },
];

const itemSetOptions = [
  { id: 1, name: "All Items", code: "ALL" },
  { id: 2, name: "Electronics", code: "ELEC" },
  { id: 3, name: "Clothing", code: "CLOTH" },
];

const simpleColumns: ColumnDef<any>[] = [
  { header: "Name", key: "label", width: "w-full" },
];

const itemSetColumns: ColumnDef<any>[] = [
  { header: "Name", key: "name", width: "flex-1" },
  { header: "Code", key: "code", width: "w-24" },
];

const POSCouponMaster: React.FC<POSCouponMasterProps> = ({
  onClose,
  index = 50,
  initialData,
}) => {
  const themeColor = "#1e5386";
  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);

  // Form State
  const [formData, setFormData] = useState<POSCouponFormData>({
    codeNo: "",
    validUpTo: "20/12/2025",
    calculation: "Percentage",
    value: "0.00",
    maxAmount: "0.00",
    useType: "SingleUse",
    itemSet: "",
  });

  // --- DUAL FUNCTIONALITY LOGIC ---
  // If initialData is provided, we are in EDIT mode. Otherwise, CREATE mode.
  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id,
        codeNo: initialData.codeNo || "",
        validUpTo: initialData.validUpTo || "20/12/2025",
        calculation: initialData.calculation || "Percentage",
        value: initialData.value || "0.00",
        maxAmount: initialData.maxAmount || "0.00",
        useType: initialData.useType || "SingleUse",
        itemSet: initialData.itemSet || "",
      });
    } else {
      // Reset to defaults for Create mode
      setFormData({
        codeNo: "",
        validUpTo: "20/12/2025",
        calculation: "Percentage",
        value: "0.00",
        maxAmount: "0.00",
        useType: "SingleUse",
        itemSet: "",
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof POSCouponFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setFormData({
      codeNo: "",
      validUpTo: "20/12/2025",
      calculation: "Percentage",
      value: "0.00",
      maxAmount: "0.00",
      useType: "SingleUse",
      itemSet: "",
    });
  };

  // Internal Helper Components
  const FormLabel = ({
    children,
    required,
  }: {
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <label className="text-[13px] text-gray-700 font-normal py-1">
      {children} {required && <span className="text-red-600 font-bold">*</span>}
    </label>
  );

  const inputClass =
    "w-full h-[30px] border border-gray-300 rounded-sm px-2 text-[13px] outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      style={{ zIndex: index }}
    >
      <div className="w-full max-w-[650px] bg-white rounded-sm shadow-xl flex flex-col overflow-hidden border border-gray-300">
        {/* --- Header --- */}
        <div
          className="flex justify-between items-center px-3 py-1.5 text-white"
          style={{ backgroundColor: themeColor }}
        >
          <span className="text-[14px] font-medium tracking-wide">
            POS Coupon Master {initialData ? "(Edit)" : "(Add)"}
          </span>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- Content Area --- */}
        <div className="flex-1 bg-white p-1 overflow-y-auto">
          <div className="border border-gray-200">
            <button
              onClick={() => setIsBasicInfoOpen(!isBasicInfoOpen)}
              className="w-full flex justify-between items-center px-3 py-2 bg-white border-b border-gray-100"
            >
              <div className="flex items-center gap-2 text-[#1e5386] font-bold text-[14px]">
                <BookOpen size={16} />
                <span>Basic Information</span>
              </div>
              <div className="bg-gray-100 rounded-full p-0.5 border border-gray-300">
                {isBasicInfoOpen ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </div>
            </button>

            {isBasicInfoOpen && (
              <div className="p-6 space-y-2 max-w-[500px]">
                {/* Code No */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <FormLabel required>Code No</FormLabel>
                  </div>
                  <div className="col-span-8">
                    <input
                      type="text"
                      placeholder="Code"
                      className={inputClass}
                      value={formData.codeNo}
                      onChange={(e) => handleChange("codeNo", e.target.value)}
                    />
                  </div>
                </div>

                {/* Valid Up To */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <FormLabel>Valid Up To</FormLabel>
                  </div>
                  <div className="col-span-8">
                    <input
                      type="text"
                      className={inputClass}
                      value={formData.validUpTo}
                      onChange={(e) =>
                        handleChange("validUpTo", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Calculation */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <FormLabel>Calculation</FormLabel>
                  </div>
                  <div className="col-span-8">
                    <Dropdown
                      data={calculationOptions}
                      columns={simpleColumns}
                      value={formData.calculation}
                      valueKey="label"
                      onChange={(item) =>
                        handleChange("calculation", item ? item.label : "")
                      }
                      placeholder="Select Calculation"
                    />
                  </div>
                </div>

                {/* Value */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <FormLabel>Value</FormLabel>
                  </div>
                  <div className="col-span-8">
                    <input
                      type="text"
                      className={`${inputClass} text-right`}
                      value={formData.value}
                      onChange={(e) => handleChange("value", e.target.value)}
                    />
                  </div>
                </div>

                {/* Max Amount */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <FormLabel>Max Amount</FormLabel>
                  </div>
                  <div className="col-span-8 relative">
                    <span className="absolute left-2 top-1.5 text-gray-500 text-[13px]">
                      ₹
                    </span>
                    <input
                      type="text"
                      className={`${inputClass} text-right`}
                      value={formData.maxAmount}
                      onChange={(e) =>
                        handleChange("maxAmount", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Use Type */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <FormLabel>Use Type</FormLabel>
                  </div>
                  <div className="col-span-8">
                    <Dropdown
                      data={useTypeOptions}
                      columns={simpleColumns}
                      value={formData.useType}
                      valueKey="label"
                      onChange={(item) =>
                        handleChange("useType", item ? item.label : "")
                      }
                      placeholder="Select Use Type"
                    />
                  </div>
                </div>

                {/* Item Set */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <FormLabel>Item Set</FormLabel>
                  </div>
                  <div className="col-span-8 flex gap-1">
                    <div className="flex-1">
                      <Dropdown
                        data={itemSetOptions}
                        columns={itemSetColumns}
                        value={formData.itemSet}
                        valueKey="name"
                        onChange={(item) =>
                          handleChange("itemSet", item ? item.name : "")
                        }
                        placeholder="Select..."
                      />
                    </div>
                    <button className="h-[30px] min-w-[30px] bg-[#1e5386] text-white flex items-center justify-center rounded-sm hover:bg-[#153f66] transition-colors">
                      <EditIcon size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- Footer --- */}
        <div
          className="p-2 flex justify-between items-center border-t border-gray-200"
          style={{ backgroundColor: themeColor }}
        >
          <div className="flex gap-1.5">
            <FooterBtn
              icon={<Save size={14} />}
              label={initialData ? "Update" : "Save"}
            />
            <FooterBtn
              icon={<RotateCcw size={14} />}
              label="Clear"
              onClick={handleClear}
            />
            <FooterBtn
              icon={<Trash2 size={14} />}
              label="Delete"
              disabled={!initialData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FooterBtn = ({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-1.5 px-3 py-1 border border-white/40 text-white text-[12px] font-medium rounded-sm transition-all ${
      disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-white hover:text-[#1e5386]"
    }`}
  >
    {icon} {label}
  </button>
);

export default POSCouponMaster;
