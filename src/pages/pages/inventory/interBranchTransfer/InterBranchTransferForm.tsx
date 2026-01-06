import React, { useState, useEffect } from "react";
import { EditIcon, RefreshCw } from "lucide-react";
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";
import DocumentInventoryModal from "../../../../components/DocumentCategoryInventory";
import { LocationMaster } from "../../../../components/LocationMaster";
import ChartOfAccounts from "../../../../components/ChartOfAccount";
import DateInput from "../../../../components/DateInput";

import {
  fetchDocumentCategoryInventory,
  DocumentCategoryInventory,
} from "../stockAdjustment/api/DocumentCategoryInventory";

import {
  fetchAllLocations,
  LocationMaster as LocationMasterType,
} from "../stockAdjustment/api/LocationMaster";

import {
  fetchSalesAndPurchaseGL,
  SalesAndPurchaseGL,
} from "../../../../components/addItemMaster/api/saleAndPurchaseGL";

// --- EXPORT DATA TYPE FOR PARENT ---
export interface InterBranchTransferData {
  category: string;
  store: string;
  toStore: string;
  transferDate: string;
  transferNo: string;
  postingGL: string;
}

// --- UPDATE PROPS ---
export interface SalesInvoiceFormProps {
  themeColor?: string;
  onOverlayChange?: (isOpen: boolean) => void;
  // New Props for Data Binding
  data: InterBranchTransferData;
  onDataChange: (data: InterBranchTransferData) => void;
}

interface ActionBtnProps {
  icon: React.ReactElement;
  onClick?: () => void;
}

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

interface InputGroupProps {
  children: React.ReactNode;
}

const generateTransferNo = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const length = 10;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const Label: React.FC<LabelProps> = ({ children, required }) => (
  <label className="text-[13px] text-gray-700 font-medium flex items-center h-[32px] whitespace-nowrap">
    {children} {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const InputGroup: React.FC<InputGroupProps> = ({ children }) => (
  <div className="flex items-center w-full relative gap-1">{children}</div>
);

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="h-[32px] w-[32px] bg-[var(--theme-primary)] text-white flex items-center justify-center rounded-sm border border-[var(--theme-primary)] hover:opacity-90 transition-opacity ml-[-1px] z-10 shadow-sm"
  >
    {icon}
  </button>
);

const ReadOnlyInputWithGen: React.FC<{ value: string }> = ({ value }) => (
  <div className="w-full">
    <input
      type="text"
      value={value || ""}
      readOnly
      placeholder="Click button to generate"
      className="w-full h-[32px] bg-white border border-gray-300 rounded-sm px-3 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] bg-gray-50"
    />
  </div>
);

const InterBranchTransferForm: React.FC<SalesInvoiceFormProps> = ({
  themeColor = "#0f3c63",
  onOverlayChange,
  data, // <--- Receive Data from Parent
  onDataChange, // <--- Receive Updater from Parent
}) => {
  const themeStyles = {
    "--theme-primary": themeColor,
    "--theme-focus": "#60a5fa",
  } as React.CSSProperties;

  // We REMOVED the local useState for 'data' here.

  const [categoryModal, setCategoryModal] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  const [glModal, setGlModal] = useState(false);
  const [editingLocationField, setEditingLocationField] = useState<
    "store" | "toStore" | null
  >(null);

  const [categoryList, setCategoryList] = useState<DocumentCategoryInventory[]>(
    []
  );
  // Ensure LocationMasterType includes 'code' (based on your JSON)
  const [locationList, setLocationList] = useState<any[]>([]);
  const [glList, setGlList] = useState<SalesAndPurchaseGL[]>([]);

  // Columns Definitions
  const categoryColumns: ColumnDef<DocumentCategoryInventory>[] = [
    { header: "Code", key: "code", width: "w-20" },
    { header: "Name", key: "name", width: "flex-1" },
  ];
  const locationColumns: ColumnDef<LocationMasterType>[] = [
    { header: "Code", key: "code", width: "w-20" },
    { header: "Name", key: "name", width: "flex-1" },
  ];
  const glColumns: ColumnDef<SalesAndPurchaseGL>[] = [
    { header: "Name", key: "name", width: "flex-1" },
    { header: "Code", key: "code", width: "w-24" },
    { header: "Group", key: "salesGlUnderGroup", width: "w-32" },
  ];

  useEffect(() => {
    loadCategories();
    loadLocations();
    loadGLs();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await fetchDocumentCategoryInventory();
      setCategoryList(result || []);
    } catch (err) {
      console.error(err);
    }
  };
  const loadLocations = async () => {
    try {
      const result = await fetchAllLocations();
      setLocationList(result || []);
    } catch (err) {
      console.error(err);
    }
  };
  const loadGLs = async () => {
    try {
      const result = await fetchSalesAndPurchaseGL();
      setGlList(result || []);
    } catch (err) {
      console.error(err);
    }
  };

  // --- UPDATED HANDLER: Validates using .code property ---
  const handleFieldChange = (
    field: keyof InterBranchTransferData,
    value: string
  ) => {
    // 1. Validation Logic for "Store" (Source)
    if (field === "store" && value) {
      // Find the object for the NEW selection
      const newSourceStore = locationList.find((l) => l.name === value);
      // Find the object for the CURRENT existing destination
      const existingDestStore = locationList.find(
        (l) => l.name === data.toStore
      );

      // Compare using .code directly
      if (
        newSourceStore?.code &&
        existingDestStore?.code &&
        newSourceStore.code === existingDestStore.code
      ) {
        alert("Source Store and Destination Store cannot have the same Code!");
        return; // Prevent update
      }
    }

    // 2. Validation Logic for "To Store" (Destination)
    if (field === "toStore" && value) {
      // Find the object for the NEW selection
      const newDestStore = locationList.find((l) => l.name === value);
      // Find the object for the CURRENT existing source
      const existingSourceStore = locationList.find(
        (l) => l.name === data.store
      );

      // Compare using .code directly
      if (
        newDestStore?.code &&
        existingSourceStore?.code &&
        newDestStore.code === existingSourceStore.code
      ) {
        alert("Destination Store and Source Store cannot have the same Code!");
        return; // Prevent update
      }
    }

    // If validation passes, update parent
    onDataChange({
      ...data,
      [field]: value,
    });
  };

  const handleGenerateTransferNo = () => {
    const newNo = generateTransferNo();
    handleFieldChange("transferNo", newNo);
  };

  const getSelectedCategory = () =>
    categoryList.find((c) => c.name === data.category) || null;
  const getSelectedStore = () =>
    locationList.find((l) => l.name === data.store) || null;
  const getSelectedToStore = () =>
    locationList.find((l) => l.name === data.toStore) || null;
  const getSelectedGL = () =>
    glList.find((g) => g.name === data.postingGL) || null;

  const openCategoryModal = () => setCategoryModal(true);
  const openLocationModal = (field: "store" | "toStore") => {
    setEditingLocationField(field);
    setLocationModal(true);
    if (onOverlayChange) onOverlayChange(true); // Notify parent to hide headers
  };
  const closeLocationModal = () => {
    setLocationModal(false);
    setEditingLocationField(null);
    if (onOverlayChange) onOverlayChange(false);
  };

  const openGLModal = () => setGlModal(true);

  return (
    <>
      <div
        style={themeStyles}
        className="bg-white rounded-lg shadow-md border border-gray-200 p-6 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-4">
                <Label required>Category</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={categoryList}
                    columns={categoryColumns}
                    value={data.category}
                    valueKey="name"
                    onChange={(item) =>
                      handleFieldChange("category", item?.name || "")
                    }
                    placeholder="Select Category..."
                  />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={openCategoryModal}
                  />
                </InputGroup>
              </div>
            </div>
            {/* Store */}
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-4">
                <Label required>Store</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    // Filter out the selected "To Store" by name so it doesn't appear in the list
                    data={locationList.filter((l) => l.name !== data.toStore)}
                    columns={locationColumns}
                    value={data.store}
                    valueKey="name"
                    onChange={(item) =>
                      handleFieldChange("store", item?.name || "")
                    }
                    placeholder="Select Store..."
                  />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={() => openLocationModal("store")}
                  />
                </InputGroup>
              </div>
            </div>
            {/* To Store */}
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-4">
                <Label required>To Store</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    // Filter out the selected "Store" by name so it doesn't appear in the list
                    data={locationList.filter((l) => l.name !== data.store)}
                    columns={locationColumns}
                    value={data.toStore}
                    valueKey="name"
                    onChange={(item) =>
                      handleFieldChange("toStore", item?.name || "")
                    }
                    placeholder="Select Destination..."
                  />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={() => openLocationModal("toStore")}
                  />
                </InputGroup>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-4">
                <Label>Transfer Date</Label>
              </div>
              <div className="col-span-8">
                <DateInput
                  value={data.transferDate}
                  onChange={(e) =>
                    handleFieldChange("transferDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-4">
                <Label>Transfer No</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <ReadOnlyInputWithGen value={data.transferNo} />
                  <ActionBtn
                    icon={<RefreshCw size={16} />}
                    onClick={handleGenerateTransferNo}
                  />
                </InputGroup>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-4">
                <Label>Posting GL</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={glList}
                    columns={glColumns}
                    value={data.postingGL}
                    valueKey="name"
                    onChange={(item) =>
                      handleFieldChange("postingGL", item?.name || "")
                    }
                    placeholder="Select GL Account..."
                  />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={openGLModal}
                  />
                </InputGroup>
              </div>
            </div>
          </div>
        </div>

        {/* MODALS */}
        {categoryModal && (
          <div className="fixed inset-0 z-[30] flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm p-4">
            <div className="shadow-lg overflow-hidden relative">
              <DocumentInventoryModal
                isOpen={categoryModal}
                onClose={() => setCategoryModal(false)}
                initialData={getSelectedCategory()}
                onSuccess={() => loadCategories()}
              />
            </div>
          </div>
        )}

        {locationModal && (
          <div className="fixed inset-0 z-[30] flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm p-4">
            <div className="shadow-lg overflow-hidden relative">
              <LocationMaster
                onClose={closeLocationModal}
                initialData={
                  editingLocationField === "toStore"
                    ? getSelectedToStore()
                    : getSelectedStore()
                }
                onSuccess={() => loadLocations()}
              />
            </div>
          </div>
        )}

        {glModal && (
          <div className="fixed inset-0 z-[30] flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm p-4">
            <ChartOfAccounts
              isOpen={glModal}
              onClose={() => setGlModal(false)}
              initialData={getSelectedGL() as any}
              onSave={(savedItem) => {
                loadGLs();
                handleFieldChange("postingGL", savedItem.name);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default InterBranchTransferForm;
