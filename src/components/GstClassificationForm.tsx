import React, { useState, useEffect, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import {
  createGstClassification,
  CreateGstClassificationPayload,
} from "./addItemMaster/api/itemService";

// ---------- TYPES ----------
export interface GstFormData {
  type: "HSN" | "SAC";
  code: string;
  hsn_sac_code: string;
  hsnSacDescription: string;
}

interface GstClassificationFormProps {
  initialData?: GstFormData;
  onSubmit: (data: GstFormData) => void;
  onCancel: () => void;
}

const GST_TYPE_OPTIONS: Array<GstFormData["type"]> = ["HSN", "SAC"];

export const GstClassificationForm: React.FC<GstClassificationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<GstFormData>({
    type: "HSN",
    code: "",
    hsn_sac_code: "",
    hsnSacDescription: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // --- FIX 1: Robust Initialization ---
  // We manually map fields to ensure that even if initialData has slightly
  // different keys (camelCase vs snake_case) or missing fields, it loads correctly.
  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || "HSN",
        code: initialData.code || "",
        // Check both snake_case and camelCase just to be safe regarding what the parent passes
        hsn_sac_code:
          initialData.hsn_sac_code || (initialData as any).hsnSacCode || "",
        hsnSacDescription:
          initialData.hsnSacDescription ||
          (initialData as any).hsn_description ||
          "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError(null);
  };

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.type) newErrors.type = "Required";

    // --- FIX 2: Consistent Error Keys ---
    // Use the same key name 'hsn_sac_code' for the error as the state
    if (!formData.hsn_sac_code) newErrors.hsn_sac_code = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    const payload: CreateGstClassificationPayload = {
      type: formData.type,
      code: formData.code,
      hsn_sac_code: formData.hsn_sac_code,
      hsn_description: formData.hsnSacDescription,
    };

    const response = await createGstClassification(payload);

    if (response) {
      onSubmit(formData);
      onCancel();
    } else {
      setApiError("Failed to save classification. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-md bg-white rounded shadow border text-sm">
      <div className="bg-[#1e4e79] text-white px-4 py-2 flex justify-between items-center">
        <h2>GST Classification</h2>
        <button onClick={onCancel} disabled={isSubmitting}>
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        {apiError && (
          <div className="bg-red-50 text-red-600 p-2 border border-red-200 rounded text-xs">
            {apiError}
          </div>
        )}

        {/* Type */}
        <div className="grid grid-cols-12 gap-2 items-center">
          <label className="col-span-4">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={isSubmitting}
            className="col-span-8 border px-2 py-1 outline-none focus:border-[#1e4e79]"
          >
            {GST_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Code */}
        <div className="grid grid-cols-12 gap-2 items-center">
          <label className="col-span-4">Code</label>
          <input
            name="code"
            value={formData.code || ""}
            onChange={handleChange}
            disabled={isSubmitting}
            className="col-span-8 border px-2 py-1 outline-none focus:border-[#1e4e79]"
          />
        </div>

        {/* HSN/SAC Code */}
        <div className="grid grid-cols-12 gap-2 items-center">
          <label className="col-span-4">
            HSN / SAC <span className="text-red-500">*</span>
          </label>
          <div className="col-span-8 flex">
            <input
              name="hsn_sac_code" // Added name attribute for generic handleChange
              // --- FIX 3: Fallback Value ---
              // Added || "" to ensure input is never undefined (which causes display issues)
              value={formData.hsn_sac_code || ""}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`flex-1 border px-2 py-1 outline-none focus:border-[#1e4e79] ${
                errors.hsn_sac_code ? "border-red-500" : ""
              }`}
              placeholder="Enter HSN/SAC Code"
            />
          </div>
        </div>
        {/* Updated error key to match validate function */}
        {errors.hsn_sac_code && (
          <p className="text-xs text-red-500 text-right">
            {errors.hsn_sac_code}
          </p>
        )}

        {/* Description */}
        <div className="grid grid-cols-12 gap-2 items-center">
          <label className="col-span-4">Description</label>
          <input
            name="hsnSacDescription"
            value={formData.hsnSacDescription || ""}
            onChange={handleChange}
            disabled={isSubmitting}
            className="col-span-8 border px-2 py-1 outline-none focus:border-[#1e4e79]"
          />
        </div>

        <div className="flex justify-end pt-2 border-t mt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="mr-2 px-4 py-1 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1e4e79] text-white px-4 py-1 rounded flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
