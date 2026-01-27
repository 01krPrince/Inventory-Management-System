import React, { useState, useEffect } from "react";
import { X, Save, Trash2, Loader2 } from "lucide-react";
// Import the API functions
import {
  createStockUnit,
  CreateStockUnitPayload,
  updateStockUnit,
  deleteStockUnit,
} from "./api/stockunitservice";

export interface StockUnitData {
  _id?: string;
  code: string;
  name: string;
  desc?: string;
  description?: string;
  roundoff_decimal?: string | number;
  roundoffDecimal?: string | number;
  uqc: string;
  [key: string]: any;
}

interface StockUnitProps {
  onClose?: () => void;
  initialData?: StockUnitData | any;
  // onSave now acts as a "Success Callback" to refresh the list in the parent
  onSave?: () => void;
  zIndex?: number;
}

interface FormDataState {
  _id?: string;
  code: string;
  name: string;
  description: string;
  roundoffDecimal: number | string;
  uqc: string;
}

export default function StockUnit({
  onClose,
  initialData,
  onSave,
  zIndex = 0,
}: StockUnitProps) {
  const overlayZIndex = zIndex + 10;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({
    code: "0054",
    name: "",
    description: "",
    roundoffDecimal: 0,
    uqc: "",
  });

  // Populate form if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id,
        code: initialData.code || "",
        name: initialData.name || "",
        description: initialData.description || initialData.desc || "",
        roundoffDecimal:
          initialData.roundoffDecimal || initialData.roundoff_decimal || 0,
        uqc: initialData.uqc || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.uqc) {
      alert("Name and UQC are required");
      return;
    }

    setIsLoading(true);

    try {
      const payload: CreateStockUnitPayload = {
        code: formData.code,
        name: formData.name,
        desc: formData.description,
        roundoff_decimal: formData.roundoffDecimal,
        uqc: formData.uqc,
      };

      if (formData._id) {
        await updateStockUnit(formData._id, payload);
      } else {
        await createStockUnit(payload);
      }

      if (onSave) onSave(); // Refresh parent list
      if (onClose) onClose(); // Close modal
    } catch (error) {
      console.error("Failed to save stock unit", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW DELETE HANDLER ---
  const handleDelete = async () => {
    if (!formData._id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Stock Unit?",
    );
    if (!confirmDelete) return;

    setIsLoading(true);

    try {
      await deleteStockUnit(formData._id);

      // Refresh parent list and close modal
      if (onSave) onSave();
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to delete stock unit", error);
      alert("Failed to delete. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const labelClass = "text-sm text-gray-700 font-normal cursor-pointer";
  const inputClass =
    "w-full border border-gray-300 px-2 py-1 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all";

  return (
    <div
      className="w-[450px] bg-white rounded-t-md shadow-xl border border-gray-400 overflow-hidden font-sans"
      style={{ zIndex: overlayZIndex }}
    >
      <div className="bg-[#104a7b] px-3 py-2 flex justify-between items-center text-white">
        <h2 className="text-sm font-semibold tracking-wide">
          Unit Of Measurement
        </h2>
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="hover:bg-white/20 rounded p-0.5 transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-12 gap-y-3 gap-x-4 items-center">
          {/* Code Input */}
          {/* <div className="col-span-4">
            <label htmlFor="code" className={labelClass}>
              Code
            </label>
          </div>
          <div className="col-span-8">
            <input
              disabled
              id="code"
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={inputClass}
            />
          </div> */}

          {/* Name Input */}
          <div className="col-span-4">
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
          </div>
          <div className="col-span-8">
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Description Input */}
          <div className="col-span-4 self-start pt-1">
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
          </div>
          <div className="col-span-8">
            <input
              id="description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`${inputClass} h-8`}
            />
          </div>

          {/* Roundoff Input */}
          <div className="col-span-4">
            <label htmlFor="roundoffDecimal" className={labelClass}>
              Roundoff Decimal
            </label>
          </div>
          <div className="col-span-8">
            <input
              id="roundoffDecimal"
              type="number"
              name="roundoffDecimal"
              value={formData.roundoffDecimal}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* UQC Dropdown */}
          <div className="col-span-4">
            <label htmlFor="uqc" className={labelClass}>
              UQC
            </label>
          </div>
          <div className="col-span-8">
            <select
              id="uqc"
              name="uqc"
              value={formData.uqc}
              onChange={handleChange}
              className={`${inputClass} bg-white appearance-none`}
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "0.5em auto",
              }}
            >
              <option value="" disabled className="text-gray-400">
                Select...
              </option>
              <option value="UQC1">UQC 1</option>
              <option value="UQC2">UQC 2</option>
            </select>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="bg-[#104a7b] px-3 py-2 flex gap-2 border-t border-blue-800">
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className={`flex items-center px-4 py-1 border border-white rounded-sm text-white text-sm font-medium transition-colors ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#0d3b63]"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-1.5" />
          )}
          {isLoading ? "Saving..." : "Save"}
        </button>

        {/* Updated Delete Button */}
        {formData._id && (
          <button
            type="button"
            onClick={handleDelete} // Linked to the new handler
            disabled={isLoading} // Disable during loading
            className={`flex items-center px-4 py-1 border border-white rounded-sm text-white text-sm font-medium transition-colors ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#0d3b63]"
            }`}
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
