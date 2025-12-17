import React, { useState, useEffect } from "react";
import { X, Save, Trash2, Pencil, ArrowLeft } from "lucide-react";
import { LocationMaster } from "./LocationMaster";
import Dropdown, { ColumnDef } from "./Dropdown";
import { fetchAllLocations } from "../pages/pages/inventory/stockAdjustment/api/LocationMaster";
import {
  createDocumentCategoryInventory,
  updateDocumentCategoryInventory,
  deleteDocumentCategoryInventory,
  DocumentCategoryInventory,
} from "../pages/pages/inventory/stockAdjustment/api/DocumentCategoryInventory";

// ==========================================
// INTERFACES
// ==========================================

// UPDATED: Full interface to match LocationMaster requirements
export interface LocationData {
  _id: string;
  name: string;
  party: string;
  code: string;
  profilePic?: string;
  gstNo?: string;
  ewayUsername?: string;
  ewayPassword?: string;
  gstInUsername?: string;
  gstInPassword?: string;
  othelicense1?: string;
  othelicense2?: string;
  bankDetails?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  phone?: string;
  email?: string;
  __v?: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: DocumentCategoryInventory | null;
  onSuccess?: () => void;
}

// ==========================================
// MAIN COMPONENT: DocumentCategoryInventoryModal
// ==========================================

const DocumentCategoryInventoryModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}) => {
  // --- STATE: Form Fields ---
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [inactive, setInactive] = useState(false);
  const [specificToDocument, setSpecificToDocument] = useState("None");
  const [defaultLocation, setDefaultLocation] = useState("");

  // --- STATE: UI & Data ---
  const [showLocationMaster, setShowLocationMaster] = useState(false);
  const [locationList, setLocationList] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);

  // --- COLUMNS for Dropdown ---
  const locationColumns: ColumnDef<LocationData>[] = [
    { header: "Name", key: "name", width: "w-[40%]" },
    { header: "Party", key: "party", width: "w-[40%]" },
    { header: "Code", key: "code", width: "w-[20%]" },
  ];

  // --- EFFECT: Fetch Locations for Dropdown ---
  useEffect(() => {
    if (isOpen) {
      const loadLocations = async () => {
        try {
          const result = await fetchAllLocations();
          if (Array.isArray(result)) {
            setLocationList(result as LocationData[]);
          } else if (
            result &&
            (result as any).data &&
            Array.isArray((result as any).data)
          ) {
            setLocationList((result as any).data as LocationData[]);
          }
        } catch (error) {
          console.error("Failed to load locations for dropdown", error);
        }
      };
      loadLocations();
    }
  }, [isOpen]);

  // --- EFFECT: Populate Form ---
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || "");
        setCode(initialData.code || "");
        setInactive(initialData.inactive || false);
        setSpecificToDocument(initialData.specificToDocument || "None");
        setDefaultLocation(initialData.defaultLocation || "");
      } else {
        setName("");
        setCode("");
        setInactive(false);
        setSpecificToDocument("None");
        setDefaultLocation("");
      }
    }
  }, [isOpen, initialData]);

  // --- HANDLER: Save ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        code,
        inactive,
        specificToDocument,
        defaultLocation,
      };

      if (initialData && initialData._id) {
        await updateDocumentCategoryInventory(initialData._id, payload);
        alert("Updated successfully!");
      } else {
        await createDocumentCategoryInventory(payload);
        alert("Created successfully!");
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER: Delete ---
  const handleDelete = async () => {
    if (!initialData?._id) return;
    if (window.confirm("Are you sure you want to delete this category?")) {
      setLoading(true);
      try {
        await deleteDocumentCategoryInventory(initialData._id);
        if (onSuccess) onSuccess();
        onClose();
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Failed to delete.");
      } finally {
        setLoading(false);
      }
    }
  };

  // --- HANDLER: Location Selected from Master (The "Pencil" View) ---
  const handleLocationSelectFromMaster = (selectedLocationName: string) => {
    setDefaultLocation(selectedLocationName);
    setShowLocationMaster(false);
    fetchAllLocations().then((res: any) => {
      if (res && res.data) setLocationList(res.data);
      else if (Array.isArray(res)) setLocationList(res);
    });
  };

  if (!isOpen) return null;

  const themeBlue = "bg-[#104a7d]";
  const themeBlueHover = "hover:bg-[#0c3b63]";

  if (showLocationMaster) {
    const locationToEdit = locationList.find(
      (loc) => loc.name === defaultLocation
    );

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-5xl bg-white shadow-xl rounded-sm overflow-hidden flex flex-col h-[650px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sub-form Header */}
          <div className="p-4 border-b flex items-center gap-2 bg-gray-50">
            <button
              onClick={() => setShowLocationMaster(false)}
              className="flex items-center text-sm text-gray-600 hover:text-[#104a7d] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Inventory
            </button>
            {locationToEdit && (
              <span className="text-xs text-gray-400 border-l pl-2 ml-1">
                Editing: {locationToEdit.name}
              </span>
            )}
          </div>

          {/* Location Master Component */}
          <div className="flex-1 overflow-hidden">
            <LocationMaster
              onClose={() => setShowLocationMaster(false)}
              onSuccess={() => setShowLocationMaster(false)}
              onSelect={handleLocationSelectFromMaster}
              initialData={locationToEdit as any}
            />
          </div>
        </div>
      </div>
    );
  }

  // --- View 1: Main Inventory Form ---
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white shadow-xl rounded-sm overflow-hidden flex flex-col h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`${themeBlue} text-white px-4 py-2 flex justify-between items-center select-none`}
        >
          <h2 className="text-sm font-semibold tracking-wide">
            {initialData ? "Edit Document Category" : "New Document Category"}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          <form className="space-y-4 max-w-3xl" onSubmit={handleSave}>
            {/* Name */}
            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="text-gray-700 text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-[#104a7d] rounded-sm shadow-sm"
              />
            </div>

            {/* Code */}
            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="text-gray-700 text-sm font-medium">
                Code <span className="text-red-500">*</span>
              </label>
              <input
                disabled
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full border border-gray-300 px-2 py-1.5 text-sm bg-gray-50 focus:outline-none focus:border-[#104a7d] rounded-sm shadow-sm"
              />
            </div>

            {/* Inactive */}
            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="text-gray-700 text-sm font-medium">
                Inactive
              </label>
              <div className="flex justify-end w-full">
                <input
                  type="checkbox"
                  checked={inactive}
                  onChange={(e) => setInactive(e.target.checked)}
                  className="h-5 w-5 border-gray-300 rounded focus:ring-[#104a7d]"
                />
              </div>
            </div>

            <div className="h-2"></div>

            {/* Specific to Document */}
            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="text-gray-700 text-sm font-medium">
                Specific to Document
              </label>
              <select
                value={specificToDocument}
                onChange={(e) => setSpecificToDocument(e.target.value)}
                className="w-full border border-gray-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#104a7d] rounded-sm shadow-sm"
              >
                <option value="None">None</option>
                <option value="Invoice">Invoice</option>
                <option value="Receipt">Receipt</option>
                <option value="Purchase Order">Purchase Order</option>
              </select>
            </div>

            {/* Default Location */}
            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="text-gray-700 text-sm font-medium">
                Default Location
              </label>
              <div className="flex gap-1 w-full">
                <div className="flex-1">
                  <Dropdown<LocationData>
                    data={locationList}
                    columns={locationColumns}
                    value={defaultLocation}
                    valueKey="name"
                    placeholder="Select Default Location..."
                    onChange={(item) =>
                      setDefaultLocation(item ? item.name : "")
                    }
                  />
                </div>
                <button
                  type="button"
                  className={`${themeBlue} ${themeBlueHover} text-white px-3 py-1 rounded-sm shadow-sm transition-colors flex items-center justify-center`}
                  onClick={() => setShowLocationMaster(true)}
                  title={
                    defaultLocation
                      ? "Edit Selected Location"
                      : "Manage Locations"
                  }
                >
                  <Pencil size={14} />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div
          className={`${themeBlue} px-4 py-2 flex gap-2 border-t border-blue-800`}
        >
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-1.5 border border-white/50 text-white text-sm rounded hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            <span>
              {loading ? "Saving..." : initialData ? "Update" : "Save"}
            </span>
          </button>

          {initialData && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-1.5 border border-white/50 text-white text-sm rounded hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCategoryInventoryModal;
