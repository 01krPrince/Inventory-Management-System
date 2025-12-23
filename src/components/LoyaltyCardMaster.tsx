import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Save,
  RotateCcw,
  Trash2,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// --- Interfaces ---
export interface LoyaltyCardData {
  _id?: string; // Added ID for update logic
  description: string;
  perAmount: string;
  calculateOn: string;
  noOfPoints: string;
  redeemAmountPerPoint: string;
  minRedeemPoints: string;
  birthdayDiscount: string;
  anniversaryDiscount: string;
}

interface LoyaltyCardMasterProps {
  onClose: () => void;
  onSuccess?: () => void; // Callback for refresh after save
  initialData?: LoyaltyCardData | null; // Allow passing existing data
  index?: number;
}

const LoyaltyCardMaster: React.FC<LoyaltyCardMasterProps> = ({
  onClose,
  onSuccess,
  initialData,
  index = 50,
}) => {
  const overlayZIndex = index + 10;
  const themeColor = "#0f3c63";

  // --- State ---
  const [formData, setFormData] = useState<LoyaltyCardData>({
    description: "",
    perAmount: "0.00",
    calculateOn: "Taxable",
    noOfPoints: "0",
    redeemAmountPerPoint: "0.00",
    minRedeemPoints: "0",
    birthdayDiscount: "0",
    anniversaryDiscount: "0",
  });

  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);

  // --- Effect: Load Initial Data ---
  useEffect(() => {
    if (initialData) {
      // If editing, populate form with passed data
      setFormData(initialData);
    } else {
      // If creating new, reset to defaults
      setFormData({
        description: "",
        perAmount: "0.00",
        calculateOn: "Taxable",
        noOfPoints: "0",
        redeemAmountPerPoint: "0.00",
        minRedeemPoints: "0",
        birthdayDiscount: "0",
        anniversaryDiscount: "0",
      });
    }
  }, [initialData]);

  // --- Handlers ---
  const handleChange = (field: keyof LoyaltyCardData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving Loyalty Card Data:", formData);
    // Add your API update/create logic here
    if (onSuccess) onSuccess();
    onClose();
  };

  // --- Layout Helper ---
  const FormRow = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="grid grid-cols-12 gap-4 items-center mb-3">
      <div className="col-span-4 text-[13px] text-gray-700 font-medium">
        {label}
      </div>
      <div className="col-span-8">{children}</div>
    </div>
  );

  const inputClass =
    "w-full h-[30px] border border-gray-300 rounded-sm px-2 text-[13px] focus:outline-none focus:border-[#0f3c63] text-gray-700";
  const numberInputClass =
    "w-full h-[30px] border border-gray-300 rounded-sm px-2 text-[13px] focus:outline-none focus:border-[#0f3c63] text-right text-gray-700";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      style={{ zIndex: overlayZIndex }}
    >
      <div className="w-full max-w-[600px] bg-white rounded-sm shadow-2xl flex flex-col max-h-[90vh] border border-gray-400  h-[60vh]">
        {/* --- Header --- */}
        <div
          className="flex justify-between items-center px-4 py-2 text-white"
          style={{ backgroundColor: themeColor }}
        >
          <span className="font-semibold tracking-wide text-sm">
            {initialData ? "Edit Loyalty Card" : "Loyalty Card"}
          </span>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded p-0.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- Content --- */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-3">
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
            {/* Section Header */}
            <button
              onClick={() => setIsBasicInfoOpen(!isBasicInfoOpen)}
              className="w-full flex justify-between items-center px-3 py-2 bg-white hover:bg-gray-50 border-b"
            >
              <div className="flex items-center gap-2 text-[#0f3c63] font-bold text-sm">
                <FileText size={16} />
                <span>Basic Information</span>
              </div>
              <div className="bg-gray-700 text-white rounded-full p-0.5">
                {isBasicInfoOpen ? (
                  <ChevronUp size={12} />
                ) : (
                  <ChevronDown size={12} />
                )}
              </div>
            </button>

            {/* Form Fields */}
            {isBasicInfoOpen && (
              <div className="p-5">
                {/* Description */}
                <FormRow label="Description">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                  />
                </FormRow>

                {/* Per Amount */}
                <FormRow label="Per Amount">
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-xs text-gray-500 pointer-events-none"></span>
                    <input
                      type="text"
                      className={numberInputClass}
                      value={`₹${formData.perAmount}`}
                      onChange={(e) =>
                        handleChange(
                          "perAmount",
                          e.target.value.replace("₹", "")
                        )
                      }
                    />
                  </div>
                </FormRow>

                {/* Calculate On */}
                <FormRow label="Calculate On">
                  <select
                    className={inputClass}
                    value={formData.calculateOn}
                    onChange={(e) =>
                      handleChange("calculateOn", e.target.value)
                    }
                  >
                    <option>Taxable</option>
                    <option>Total Amount</option>
                  </select>
                </FormRow>

                {/* No. of Points */}
                <FormRow label="No. of Points">
                  <input
                    type="number"
                    className={numberInputClass}
                    value={formData.noOfPoints}
                    onChange={(e) => handleChange("noOfPoints", e.target.value)}
                  />
                </FormRow>

                {/* Redeem Amount Per Point */}
                <FormRow label="Redeem Amount Per Point">
                  <input
                    type="text"
                    className={numberInputClass}
                    value={`₹${formData.redeemAmountPerPoint}`}
                    onChange={(e) =>
                      handleChange(
                        "redeemAmountPerPoint",
                        e.target.value.replace("₹", "")
                      )
                    }
                  />
                </FormRow>

                {/* Minimum Redeem Points */}
                <FormRow label="Minimum Redeem Points">
                  <input
                    type="number"
                    className={numberInputClass}
                    value={formData.minRedeemPoints}
                    onChange={(e) =>
                      handleChange("minRedeemPoints", e.target.value)
                    }
                  />
                </FormRow>

                {/* Birthday Discount */}
                <FormRow label="Birthday Discount(%)">
                  <input
                    type="number"
                    className={numberInputClass}
                    value={formData.birthdayDiscount}
                    onChange={(e) =>
                      handleChange("birthdayDiscount", e.target.value)
                    }
                  />
                </FormRow>

                {/* Anniversary Discount */}
                <FormRow label="Anniversary Discount(%)">
                  <input
                    type="number"
                    className={numberInputClass}
                    value={formData.anniversaryDiscount}
                    onChange={(e) =>
                      handleChange("anniversaryDiscount", e.target.value)
                    }
                  />
                </FormRow>
              </div>
            )}
          </div>
        </div>

        {/* --- Footer --- */}
        <div
          className="p-2 flex gap-2 border-t border-gray-300"
          style={{ backgroundColor: themeColor }}
        >
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-4 py-1.5 border border-white text-white text-xs font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors"
          >
            <Save size={14} /> Save
          </button>
          <button className="flex items-center gap-1 px-4 py-1.5 border border-white text-white text-xs font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors">
            <RotateCcw size={14} /> Clear
          </button>
          <button className="flex items-center gap-1 px-4 py-1.5 border border-white text-white text-xs font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors">
            <Trash2 size={14} /> Delete
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-4 py-1.5 border border-white text-white text-xs font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors"
          >
            <LogOut size={14} /> Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyCardMaster;
