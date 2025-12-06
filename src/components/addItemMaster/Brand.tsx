import React, { useState } from "react";
import {
  X,
  Save,
  Trash2,
  Pencil,
  Download,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { createItemBrand, CreateBrandPayload } from "./api/itemService";

interface BrandProps {
  onClose: () => void;
}

const Brand: React.FC<BrandProps> = ({ onClose }) => {
  const [data, setData] = useState({
    code: "0029",
    name: "",
    salesman: "",
    image: null as string | null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setData({ ...data, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => setData({ ...data, image: null });

  const handleSave = async () => {
    if (!data.name.trim()) {
      alert("Brand Name is required");
      return;
    }

    setIsLoading(true);

    try {
      const payload: CreateBrandPayload = {
        name: data.name,
        salesman: data.salesman || undefined,
        image: data.image || null,
      };

      const response = await createItemBrand(payload);

      if (response.success) {
        alert("Brand Created Successfully!");
        console.log("Saved Brand:", response.data);
        onClose();
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Failed to save brand:", error);
      alert("An unexpected error occurred while saving.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () =>
    setData({ ...data, name: "", salesman: "", image: null });

  return (
    <div className="w-[450px] bg-white border border-gray-300 shadow-lg font-sans text-sm">
      <div className="bg-[#104a8e] text-white px-4 py-2 flex justify-between items-center select-none">
        <h3 className="font-semibold text-base">Brand</h3>
        <button
          onClick={onClose}
          className="hover:text-gray-200 transition-colors"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center">
          <label className="w-24 text-gray-700 font-medium shrink-0">
            Code
          </label>
          <input
            type="text"
            value={data.code}
            readOnly
            className="w-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-blue-500 bg-gray-50 text-gray-600"
          />
        </div>

        <div className="flex items-center">
          <label className="w-24 text-gray-700 font-medium shrink-0">
            Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-blue-500"
            placeholder="Enter brand name"
          />
        </div>

        <div className="flex items-center">
          <label className="w-24 text-gray-700 font-medium shrink-0">
            Salesman
          </label>
          <div className="flex w-full">
            <select
              value={data.salesman}
              onChange={(e) => setData({ ...data, salesman: e.target.value })}
              className="w-full border border-gray-300 px-2 py-1 text-gray-600 focus:outline-none focus:border-blue-500 appearance-none rounded-none border-r-0"
            >
              <option value="">Select...</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
            </select>
            <button className="bg-[#104a8e] text-white px-3 flex items-center justify-center hover:bg-blue-800">
              <Pencil size={12} />
            </button>
          </div>
        </div>

        <div className="flex items-start mt-1">
          <label className="w-24 text-gray-700 font-medium shrink-0 pt-1">
            Image
          </label>
          <div className="flex flex-col gap-2">
            <div className="relative w-40 h-44 bg-gray-200 border-2 border-dashed border-gray-500 flex items-center justify-center">
              {data.image && (
                <>
                  <img
                    src={data.image}
                    alt="Brand"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-[#104a8e] text-white p-1 shadow-sm hover:bg-blue-800"
                  >
                    <X size={12} />
                  </button>
                </>
              )}

              {!data.image && (
                <div className="relative w-24 h-24 bg-[#3b82f6] rounded-full overflow-hidden border-4 border-white shadow-sm flex items-end justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full mb-[-10px]"></div>
                </div>
              )}
            </div>

            <label className="bg-[#104a8e] text-white px-4 py-1.5 text-xs font-medium self-start hover:bg-blue-800 transition-colors cursor-pointer">
              Browse
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-[#104a8e] p-2 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-1.5 border border-white text-white hover:bg-white/10 transition-colors rounded-[2px] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            <span>{isLoading ? "Saving..." : "Save"}</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-1.5 border border-white text-white hover:bg-white/10 transition-colors rounded-[2px]"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>

        <div className="flex border border-white rounded-[2px] overflow-hidden">
          <button className="flex items-center gap-2 px-3 py-1.5 text-white hover:bg-white/10 transition-colors border-r border-white/30">
            <Download size={14} />
            <span>Import</span>
          </button>
          <button className="px-1.5 py-1.5 text-white hover:bg-white/10 transition-colors">
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Brand;
