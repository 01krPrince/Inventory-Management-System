import React, { useState, useEffect } from "react";
import { X, Save, Trash2, Loader2 } from "lucide-react";

// --- Types ---

// 1. Data Structure Interface
export interface NameAndCodeData {
  _id?: string;
  code: string;
  name: string;
}

// 2. Props Interface
interface NameAndCodeMasterProps {
  title: string;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: NameAndCodeData | null;
  index?: number;
}

// --- Helper Component for Layout (MOVED OUTSIDE) ---
const FormRow = ({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div className="grid grid-cols-12 gap-2 items-center mb-4">
    <div className="col-span-3 text-gray-700 font-medium text-[13px]">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </div>
    <div className="col-span-9 flex items-center">{children}</div>
  </div>
);

const NameAndCodeMaster: React.FC<NameAndCodeMasterProps> = ({
  title,
  onClose,
  onSuccess,
  initialData,
  index = 50,
}) => {
  // --- Z-Index Logic ---
  const overlayZIndex = index + 10;
  const themeColor = "#0f3c63";

  // --- State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState<NameAndCodeData>({
    code: "0001",
    name: "",
  });

  // --- Effect: Load Initial Data if Editing ---
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset if creating new
      setFormData({ code: "0001", name: "" });
    }
  }, [initialData]);

  // --- Handlers ---
  const handleChange = (field: keyof NameAndCodeData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validate
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log(`Saving ${title}:`, formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this ${title}?`))
      return;

    setIsDeleting(true);
    try {
      console.log(`Deleting ${title}:`, formData._id);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{ zIndex: overlayZIndex }}
    >
      <div className="w-full max-w-md bg-white border border-gray-300 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div
          className="flex justify-between items-center px-4 py-2 text-white"
          style={{ backgroundColor: themeColor }}
        >
          <span className="font-semibold tracking-wide text-sm">
            {initialData ? `Edit ${title}` : `Create ${title}`}
          </span>
          <button
            onClick={onClose}
            type="button"
            className="hover:bg-white/20 rounded p-0.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {/* Code Input */}
          <FormRow label="Code">
            <input
              type="text"
              readOnly
              className="w-full h-[30px] border border-gray-300 bg-gray-50 text-gray-600 px-2 outline-none focus:border-[#0f3c63] rounded-sm text-sm cursor-not-allowed"
              value={formData.code}
            />
          </FormRow>

          {/* Name Input */}
          <FormRow label="Name" required>
            <input
              type="text"
              className="w-full h-[30px] border border-gray-300 px-2 outline-none focus:border-[#0f3c63] rounded-sm text-sm"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={`Enter ${title} Name`}
              // Added autoFocus to help UX, though not strictly required for the fix
              autoFocus={!initialData}
            />
          </FormRow>
        </div>

        {/* Footer Buttons */}
        <div
          className="p-3 flex gap-3 border-t border-gray-300 mt-auto"
          style={{ backgroundColor: themeColor }}
        >
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-1.5 border border-white text-white text-sm font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSubmitting ? "Saving..." : "Save"}
          </button>

          {/* Show Delete button only if editing (has initialData) */}
          {initialData && (
            <button
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="flex items-center gap-2 px-4 py-1.5 border border-transparent bg-red-500/10 text-white text-sm font-semibold rounded-sm hover:bg-red-600 transition-colors disabled:opacity-50 ml-auto"
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NameAndCodeMaster;
