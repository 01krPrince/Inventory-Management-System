import React, { useState, useEffect } from "react";
import { X, Save, Trash2, EditIcon, Loader2 } from "lucide-react";
import {
  createItemBrand,
  CreateBrandPayload,
  updateItemBrand,
} from "./api/brandservice";
import SalesExecutiveMaster from "../SalesExecutiveMaster";
import Dropdown, { ColumnDef } from "../Dropdown";

import {
  fetchSalesExecutives,
  SalesExecutiveData,
} from "./api/salesExecutiveService";

// --- Interfaces ---
export interface BrandData {
  _id: string;
  name: string;
  code: string;
  salesman?: string;
  image?: string;
}

interface BrandProps {
  onClose: () => void;
  initialData?: BrandData;
  index?: number; // Added for dynamic z-indexing
}

const Brand: React.FC<BrandProps> = ({ onClose, initialData, index = 50 }) => {
  // Logic: Calculate Z-Index for nested components
  const overlayZIndex = index + 10;

  // --- State Management ---
  const [data, setData] = useState({
    _id: "",
    code: "0029",
    name: "",
    salesman: "",
    image: null as string | null,
  });

  const [isLoading, setIsLoading] = useState(false);

  // State for Sales Executive Logic
  const [salesExecutiveList, setSalesExecutiveList] = useState<
    SalesExecutiveData[]
  >([]);
  const [isSaleExecutiveOpen, setIsSaleExecutiveOpen] =
    useState<boolean>(false);
  const [selectedExecutiveForEdit, setSelectedExecutiveForEdit] = useState<
    SalesExecutiveData | undefined
  >(undefined);

  // --- 1. Initialization Effect (Handle Edit Mode) ---
  useEffect(() => {
    if (initialData) {
      setData({
        _id: initialData._id,
        code: initialData.code,
        name: initialData.name,
        salesman: initialData.salesman || "",
        image: initialData.image || null,
      });
    } else {
      setData({
        _id: "",
        code: "0029",
        name: "",
        salesman: "",
        image: null,
      });
    }
  }, [initialData]);

  // --- 2. Fetch Sales Executives ---
  const loadSalesExecutives = async () => {
    try {
      const executives = await fetchSalesExecutives();
      if (executives) {
        setSalesExecutiveList(executives);
      }
    } catch (error) {
      console.error("Error loading sales executives", error);
    }
  };

  useEffect(() => {
    loadSalesExecutives();
  }, [isSaleExecutiveOpen]);

  // --- 3. Dropdown Configuration ---
  const salesExecutiveColumns: ColumnDef<SalesExecutiveData>[] = [
    { header: "Amount Type", key: "amountType", width: "w-1/4" },
    { header: "Name", key: "name", width: "w-1/2" },
    { header: "Email", key: "email", width: "w-1/3" },
  ];

  // --- 4. Image Handling ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setData((prev) => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => setData((prev) => ({ ...prev, image: null }));

  // --- 5. Handlers ---
  const handleOpenSalesExecutive = (e: React.MouseEvent) => {
    e.preventDefault();
    if (data.salesman) {
      const existing = salesExecutiveList.find(
        (item) => item.name === data.salesman
      );
      setSelectedExecutiveForEdit(existing);
    } else {
      setSelectedExecutiveForEdit(undefined);
    }
    setIsSaleExecutiveOpen(true);
  };

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

      if (data._id) {
        // --- UPDATE LOGIC (Edit Mode) ---
        const response = await updateItemBrand(data._id, payload);

        if (response.success) {
          alert("Brand Updated Successfully!");
          onClose(); // Close the modal
        } else {
          alert(`Error updating brand: ${response.message}`);
        }
      } else {
        // --- CREATE LOGIC (New Mode) ---
        const response = await createItemBrand(payload);

        if (response.success) {
          alert("Brand Created Successfully!");
          onClose();
        } else {
          alert(`Error creating brand: ${response.message}`);
        }
      }
    } catch (error) {
      console.error("Failed to save brand:", error);
      alert("An unexpected error occurred while saving.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    // You might want to call a delete API here if data._id exists
    setData({ ...data, name: "", salesman: "", image: null });
  };

  return (
    <div className="w-[450px] bg-white border border-gray-300 shadow-lg font-sans text-sm relative">
      <div className="bg-[#104a8e] text-white px-4 py-2 flex justify-between items-center select-none">
        <h3 className="font-semibold text-base">
          {data._id ? "Edit Brand" : "Create Brand"}
        </h3>
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
            className="w-full border border-gray-300 px-2 py-1 focus:outline-none bg-gray-50 text-gray-600"
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
            <div className="flex-1 min-w-0">
              <Dropdown
                data={salesExecutiveList}
                columns={salesExecutiveColumns}
                value={data.salesman}
                valueKey="name"
                onChange={(item) =>
                  setData({ ...data, salesman: item?.name || "" })
                }
                placeholder="Select Salesman..."
              />
            </div>
            <button
              onClick={handleOpenSalesExecutive}
              className="bg-[#104a8e] text-white px-3 flex items-center justify-center hover:bg-blue-800 rounded-r-sm ml-[1px]"
              title={
                data.salesman ? "Edit Selected Salesman" : "Create New Salesman"
              }
            >
              <EditIcon size={12} />
            </button>
          </div>
        </div>

        <div className="flex items-start mt-1">
          <label className="w-24 text-gray-700 font-medium shrink-0 pt-1">
            Image
          </label>
          <div className="flex flex-col gap-2">
            <div className="relative w-40 h-44 bg-gray-200 border-2 border-dashed border-gray-500 flex items-center justify-center">
              {data.image ? (
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
              ) : (
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
      </div>

      {isSaleExecutiveOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          // Apply Dynamic Z-Index
          style={{ zIndex: overlayZIndex }}
        >
          <div className="bg-white rounded shadow-lg">
            <SalesExecutiveMaster
              onClose={() => setIsSaleExecutiveOpen(false)}
              initialData={selectedExecutiveForEdit}
              index={overlayZIndex}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Brand;
