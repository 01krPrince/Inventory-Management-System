import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import {
  createGstClassification,
  updateGstClassification,
  CreateGstClassificationPayload,
} from "./addItemMaster/api/gstservice";

// ---------- TYPES ----------
export interface GstFormData {
  _id?: string; // Changed from id to _id to match your API response
  type: "Goods" | "Service"; // Matching API's "Goods"/"Service" strings
  code: string;
  hsn_sac_code: string;
  hsnSacDescription: string;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
}

interface GstClassificationFormProps {
  initialData?: any; 
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const GstClassificationForm: React.FC<GstClassificationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<GstFormData>({
    type: "Goods",
    code: "",
    hsn_sac_code: "",
    hsnSacDescription: "",
    gstRate: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Sync with initialData (Edit Mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id || initialData.id,
        type: initialData.type === "Service" ? "Service" : "Goods",
        code: initialData.code || "",
        hsn_sac_code: initialData.hsn_sac_code || initialData.hsnSacCode || "",
        hsnSacDescription: initialData.hsn_description || initialData.hsnSacDescription || "",
        gstRate: Number(initialData.gstRate) || 0,
        cgst: Number(initialData.cgst) || 0,
        sgst: Number(initialData.sgst) || 0,
        igst: Number(initialData.igst) || 0,
      });
    }
  }, [initialData]);

  // Handle changes and auto-calculate tax splits
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "gstRate") {
      const rate = Number(value);
      setFormData((prev) => ({
        ...prev,
        gstRate: rate,
        cgst: rate / 2,    // 50% of GST
        sgst: rate / 2,    // 50% of GST
        igst: rate,        // 100% of GST
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hsn_sac_code) {
      setErrors({ hsn_sac_code: "Required" });
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    // EXACT body as per your requirement
    const payload: CreateGstClassificationPayload = {
      type: formData.type,
      hsn_sac_code: formData.hsn_sac_code,
      hsn_description: formData.hsnSacDescription,
      gstRate: formData.gstRate,
      cgst: formData.cgst,
      sgst: formData.sgst,
      igst: formData.igst,
      code: formData.code // Including code as it was in your JSON example
    };

    try {
      let response;
      if (formData._id) {
        response = await updateGstClassification(formData._id, payload);
      } else {
        response = await createGstClassification(payload);
      }

      if (response && response.success !== false) {
        // Pass the response data (which has the real _id) back to parent
        onSubmit(response.data || formData); 
        onCancel();
      } else {
        setApiError(response?.message || "Failed to save.");
      }
    } catch (err) {
      setApiError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded shadow border text-sm font-sans">
      <div className="bg-[#1e4e79] text-white px-4 py-2 flex justify-between items-center">
        <h2 className="font-semibold">{formData._id ? "Edit" : "Add"} GST Classification</h2>
        <button onClick={onCancel} type="button"><X size={16} /></button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {apiError && <div className="bg-red-50 text-red-600 p-2 text-xs border border-red-200">{apiError}</div>}

        {/* Row: Type & Code */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-gray-600">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="border p-1 outline-none">
              <option value="Goods">Goods (HSN)</option>
              <option value="Service">Service (SAC)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-600">Internal Code</label>
            <input name="code" value={formData.code} onChange={handleChange} className="border p-1 outline-none" placeholder="0001" />
          </div>
        </div>

        {/* Row: HSN/SAC */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-600">HSN / SAC Code <span className="text-red-500">*</span></label>
          <input 
            name="hsn_sac_code" 
            value={formData.hsn_sac_code} 
            onChange={handleChange} 
            className={`border p-1 outline-none ${errors.hsn_sac_code ? "border-red-500" : ""}`} 
          />
        </div>

        {/* Row: Description */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-600">Description</label>
          <input name="hsnSacDescription" value={formData.hsnSacDescription} onChange={handleChange} className="border p-1 outline-none" />
        </div>

        {/* Row: GST Calculation */}
        <div className="grid grid-cols-4 gap-2 border-t pt-3 mt-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-500">GST %</label>
            <input type="number" name="gstRate" value={formData.gstRate} onChange={handleChange} className="border p-1 bg-blue-50" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-500">CGST</label>
            <input type="number" value={formData.cgst} disabled className="border p-1 bg-gray-50 text-gray-400" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-500">SGST</label>
            <input type="number" value={formData.sgst} disabled className="border p-1 bg-gray-50 text-gray-400" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-500">IGST</label>
            <input type="number" value={formData.igst} disabled className="border p-1 bg-gray-50 text-gray-400" />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t mt-2">
          <button type="button" onClick={onCancel} className="px-4 py-1 text-gray-500 hover:bg-gray-100">Cancel</button>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-[#1e4e79] text-white px-6 py-1 rounded flex items-center gap-2"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {formData._id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};