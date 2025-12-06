import { useState, useEffect } from "react";
import { X, Save, Trash2, Pencil, ChevronDown, Loader2 } from "lucide-react";

// --- API Imports ---
// Adjust the path to where you saved the api/coaGroupService file
import {
  createCoaGroup,
  updateCoaGroup,
  CoaGroupInput,
  CoaGroup,
} from "../components/addItemMaster/api/chartOfAccount";

// --- Interface ---
// Aligning UI interface with API response structure
export interface COAGroupData {
  _id?: string;
  name: string;
  code: string;
  inactive: boolean;
  underGroup: string;
  nature: string;
}

interface COAGroupsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialData?: COAGroupData | null;
  onSave?: (data: CoaGroup) => void; // Pass the real backend object back
  onDelete?: (id?: string) => void;
}

// Default state
const defaultState: COAGroupData = {
  name: "",
  code: "",
  inactive: false,
  underGroup: "Turnover (Goods & Services)",
  nature: "Sales",
};

const COAGroupsModal = ({
  isOpen = false,
  onClose = () => {},
  initialData = null,
  onSave = () => {},
  onDelete = () => {},
}: COAGroupsModalProps) => {
  const [formData, setFormData] = useState<COAGroupData>(defaultState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Effect: Sync Form Data ---
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData(defaultState);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // --- Handlers ---

  const handleSave = async () => {
    // 1. Validation
    if (!formData.name) {
      alert("Name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Prepare Payload
      // We map the UI state to the API Input interface
      // Note: Include 'code' in the payload if your backend accepts it manually
      const payload: CoaGroupInput & { code: string } = {
        name: formData.name,
        code: formData.code,
        nature: formData.nature,
        inactive: formData.inactive,
        underGroup: formData.underGroup,
      };

      let result;

      // 3. API Call (Create vs Update)
      if (initialData && initialData._id) {
        // Edit Mode
        result = await updateCoaGroup(initialData._id, payload);
      } else {
        // Create Mode
        result = await createCoaGroup(payload);
      }

      // 4. Handle Response
      if (result.success && result.data) {
        onSave(result.data); // Notify parent with new data
        onClose(); // Close modal
      } else {
        alert(result.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving COA Group:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (formData._id) {
      if (window.confirm("Are you sure you want to delete this group?")) {
        // Assuming onDelete handles the API call for deletion in the parent,
        // or you can implement deleteCoaGroup API here similarly.
        onDelete(formData._id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans">
      {/* Modal Container */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
        {/* --- Header --- */}
        <div className="bg-[#0f4c81] text-white px-4 py-3 flex justify-between items-center">
          <h2 className="text-base font-medium">
            {initialData ? "Edit COA Group" : "Create COA Group"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded p-0.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- Body --- */}
        <div className="p-6 space-y-4">
          {/* Name Field */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-sm text-gray-700">Name</label>
            <div className="col-span-9">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-sm px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-[#0f4c81]"
              />
            </div>
          </div>

          {/* Code Field */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-sm text-gray-700">Code</label>
            <div className="col-span-9">
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                className="w-full border border-gray-300 rounded-sm px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-[#0f4c81]"
              />
            </div>
          </div>

          {/* Inactive Toggle */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-sm text-gray-700">Inactive</label>
            <div className="col-span-9 flex justify-end">
              <button
                onClick={() =>
                  setFormData({ ...formData, inactive: !formData.inactive })
                }
                className="relative w-14 h-7 border border-gray-300 rounded-sm bg-white flex items-center cursor-pointer overflow-hidden transition-colors"
              >
                {/* The Slider Block */}
                <div
                  className={`absolute top-0 bottom-0 w-8 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-200 ${
                    formData.inactive
                      ? "left-0 bg-red-600" // ON State style
                      : "right-0 bg-[#0f4c81]" // OFF State style (Blue)
                  }`}
                >
                  {formData.inactive ? "ON" : "OFF"}
                </div>
              </button>
            </div>
          </div>

          {/* Under Group Field */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-sm text-gray-700">
              Under Group
            </label>
            <div className="col-span-9 flex gap-1">
              <div className="relative flex-1">
                <select
                  value={formData.underGroup}
                  onChange={(e) =>
                    setFormData({ ...formData, underGroup: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-sm px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-[#0f4c81] appearance-none bg-white"
                >
                  <option>Turnover (Goods & Services)</option>
                  <option>Direct Incomes</option>
                  <option>Indirect Incomes</option>
                  <option>Liabilities</option>
                  <option>Assets</option>
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={14}
                />
              </div>
              <button className="bg-[#0f4c81] text-white p-1.5 rounded-sm hover:bg-[#0a355c] transition-colors">
                <Pencil size={14} fill="currentColor" />
              </button>
            </div>
          </div>

          {/* Nature Field */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-sm text-gray-700">Nature</label>
            <div className="col-span-9 relative">
              <select
                value={formData.nature}
                onChange={(e) =>
                  setFormData({ ...formData, nature: e.target.value })
                }
                className="w-full border border-gray-300 rounded-sm px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-[#0f4c81] appearance-none bg-white"
              >
                <option>Sales</option>
                <option>Purchases</option>
                <option>Expenses</option>
                <option>Income</option>
                <option>Liabilities</option>
                <option>Assets</option>
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={14}
              />
            </div>
          </div>
        </div>

        {/* --- Footer --- */}
        <div className="bg-[#0f4c81] px-4 py-3 flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-4 py-1.5 border border-white text-white rounded transition-colors text-sm font-medium ${
              isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-white/10"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> Save
              </>
            )}
          </button>

          {/* Only show delete if in edit mode */}
          {initialData && (
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-1.5 border border-white text-white rounded hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default COAGroupsModal;
