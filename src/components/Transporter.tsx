import React, { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
// Import the Service and Types
import TransporterService, {
  TransporterPayload,
  Transporter as TransporterType,
} from "./api/transporter";

// --- Types ---

// Define Props Interface
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: TransporterType | null; // Use the Type from Service
  onSuccess: () => void; // <--- ADDED THIS to fix the error
}

// --- Local UI Helpers ---
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="text-[13px] text-gray-700 font-medium whitespace-nowrap">
    {children}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <input
    className={`w-full h-[32px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[#0f3c63] focus:ring-1 focus:ring-[#0f3c63] disabled:bg-gray-100 ${
      props.className || ""
    }`}
    {...props}
  />
);

const Transporter: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<TransporterPayload>({
    name: "",
    gstNo: "",
    websiteUrl: "",
  });

  const [, setDisplayCode] = useState("Auto-Generated");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          gstNo: initialData.gstNo,
          websiteUrl: initialData.websiteUrl,
        });
        setDisplayCode(initialData.code);
      } else {
        setFormData({
          name: "",
          gstNo: "",
          websiteUrl: "",
        });
        setDisplayCode("Auto-Generated");
      }
    }
  }, [isOpen, initialData]);

  // --- Handlers ---
  const handleChange = (field: keyof TransporterPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Basic Validation
    if (!formData.name) {
      alert("Transporter Name is required");
      return;
    }

    try {
      setIsSaving(true);
      let response;

      if (initialData && initialData._id) {
        // --- UPDATE MODE ---
        response = await TransporterService.updateTransporter(
          initialData._id,
          formData
        );
      } else {
        // --- CREATE MODE ---
        response = await TransporterService.createTransporter(formData);
      }

      if (response.success) {
        // Call the parent's onSuccess to refresh the list
        onSuccess();
      } else {
        alert("Failed to save: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving transporter:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  // Theme color matching your other components
  const themeColor = "#0f3c63";
  const isEditMode = !!initialData;

  return (
    // BACKDROP
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={!isSaving ? onClose : undefined}
    >
      {/* MODAL CONTAINER */}
      <div
        className="w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header --- */}
        <div
          style={{ backgroundColor: themeColor }}
          className="px-4 py-3 flex justify-between items-center select-none"
        >
          <h2 className="text-white text-sm font-semibold tracking-wide">
            {isEditMode ? "Edit Transporter" : "Add New Transporter"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            type="button"
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- Body Content --- */}
        <div className="p-6 space-y-4">
          {/* Name */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4">
              <Label>Transporter Name</Label>
            </div>
            <div className="col-span-8">
              <Input
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isSaving}
                autoFocus
              />
            </div>
          </div>

          {/* GST No */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4">
              <Label>GST No.</Label>
            </div>
            <div className="col-span-8">
              <Input
                placeholder="e.g. 29ABCDE1234F1Z5"
                value={formData.gstNo}
                onChange={(e) => handleChange("gstNo", e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Website */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4">
              <Label>Website URL</Label>
            </div>
            <div className="col-span-8">
              <Input
                placeholder="https://www.example.com"
                value={formData.websiteUrl}
                onChange={(e) => handleChange("websiteUrl", e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        {/* --- Footer --- */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-1.5 text-sm text-gray-700 font-medium bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{ backgroundColor: themeColor }}
            className="flex items-center gap-2 px-4 py-1.5 text-white text-sm font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{isEditMode ? "Update" : "Save"} Transporter</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transporter;
