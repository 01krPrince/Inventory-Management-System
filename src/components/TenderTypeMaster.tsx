import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Save,
  RotateCcw,
  Trash2,
  LogOut,
  ChevronDown,
  ChevronUp,
  Edit,
} from "lucide-react";

import Dropdown, { ColumnDef } from "./Dropdown";
import ChartOfAccounts from "./ChartOfAccount";

import {
  fetchSalesAndPurchaseGL,
  SalesAndPurchaseGL,
} from "./addItemMaster/api/saleAndPurchaseGL";

export interface TenderTypeData {
  _id?: string;
  description: string;
  code: string;
  type: string;
  postingGL: string;
}

interface TenderTypeMasterProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: TenderTypeData | null;
  index?: number;
}

const mockData = {
  types: [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Wallet",
    "UPI",
    "Cheque",
    "Credit Note",
  ],
};

const glColumns: ColumnDef<SalesAndPurchaseGL>[] = [
  { header: "Code", key: "code", width: "w-24" },
  { header: "Name", key: "name", width: "w-full" },
];

const TenderTypeMaster: React.FC<TenderTypeMasterProps> = ({
  onClose,
  onSuccess,
  initialData,
  index = 50,
}) => {
  const overlayZIndex = index + 10;
  const dropdownZIndex = overlayZIndex + 20;
  const nestedModalZIndex = overlayZIndex + 30;
  const themeColor = "#0f3c63";

  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);
  const [formData, setFormData] = useState<TenderTypeData>({
    description: "",
    code: "0008",
    type: "Cash",
    postingGL: "",
  });

  const [glDataFull, setGlDataFull] = useState<SalesAndPurchaseGL[]>([]);
  const [showChartOfAccounts, setShowChartOfAccounts] = useState(false);
  const [coaFormData, setCoaFormData] = useState<SalesAndPurchaseGL | null>(
    null
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        description: "",
        code: "0008",
        type: "Cash",
        postingGL: "",
      });
    }

    const loadGLData = async () => {
      try {
        const result = await fetchSalesAndPurchaseGL();
        if (result && Array.isArray(result)) {
          setGlDataFull(result);
        }
      } catch (error) {
        console.error("Failed to load Sales/Purchase GLs", error);
      }
    };
    loadGLData();
  }, [initialData]);

  const handleChange = (field: keyof TenderTypeData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving Tender Type:", formData);
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleOpenCOA = () => {
    const currentValue = formData.postingGL;
    if (currentValue && currentValue.trim() !== "") {
      const selectedItem = glDataFull.find(
        (item) => item.name === currentValue
      );
      if (selectedItem) {
        setCoaFormData(selectedItem);
      } else {
        setCoaFormData({ name: currentValue } as SalesAndPurchaseGL);
      }
    } else {
      setCoaFormData(null);
    }
    setShowChartOfAccounts(true);
  };

  const handleSaveCOA = (savedData: SalesAndPurchaseGL) => {
    setGlDataFull((prev) => {
      const exists = prev.find((item) => item.code === savedData.code);
      if (exists) {
        return prev.map((item) =>
          item.code === savedData.code ? savedData : item
        );
      }
      return [...prev, savedData];
    });

    handleChange("postingGL", savedData.name);
    setShowChartOfAccounts(false);
  };

  const inputClass =
    "w-full h-[30px] border border-gray-300 rounded-sm px-2 text-[13px] focus:outline-none focus:border-[#0f3c63] text-gray-700 placeholder-gray-400";

  const selectClass =
    "w-full h-[30px] border border-gray-300 rounded-sm px-1 text-[13px] bg-white focus:outline-none focus:border-[#0f3c63] text-gray-700";

  const FormRow = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="grid grid-cols-12 gap-4 items-center mb-3">
      <div className="col-span-4 text-[13px] text-gray-700 font-medium">
        {label}
      </div>
      <div className="col-span-8">{children}</div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      style={{ zIndex: overlayZIndex }}
    >
      <div className="w-full max-w-[550px] bg-white rounded-sm shadow-2xl flex flex-col max-h-[90vh] border border-gray-400 h-[40vh]">
        <div
          className="flex justify-between items-center px-4 py-2 text-white"
          style={{ backgroundColor: themeColor }}
        >
          <span className="font-semibold tracking-wide text-sm">
            {initialData ? "Edit Tender Type" : "Tender Type"}
          </span>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded p-0.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f8f9fa] p-3">
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
            <button
              onClick={() => setIsBasicInfoOpen(!isBasicInfoOpen)}
              className="w-full flex justify-between items-center px-3 py-2 bg-white hover:bg-gray-50 border-b"
            >
              <div className="flex items-center gap-2 text-[#0f3c63] font-bold text-sm">
                <FileText size={16} />
                <span>Basic Information</span>
              </div>
              <div className="bg-gray-700 text-white rounded-full p-0.5">
                {isBasicInfoOpen ? (
                  <ChevronUp size={12} />
                ) : (
                  <ChevronDown size={12} />
                )}
              </div>
            </button>

            {isBasicInfoOpen && (
              <div className="p-5">
                <FormRow label="Description">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                  />
                </FormRow>

                <FormRow label="Code">
                  <input
                    type="text"
                    className={inputClass}
                    value={formData.code}
                    readOnly
                    onChange={(e) => handleChange("code", e.target.value)}
                  />
                </FormRow>

                <FormRow label="Type">
                  <select
                    className={selectClass}
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    {mockData.types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </FormRow>

                <FormRow label="Posting GL">
                  <div className="flex w-full">
                    <div className="flex-1 min-w-0">
                      <Dropdown<SalesAndPurchaseGL>
                        data={glDataFull}
                        columns={glColumns}
                        value={formData.postingGL}
                        valueKey="name"
                        onChange={(item) =>
                          handleChange("postingGL", item?.name || "")
                        }
                        placeholder="Select GL Account..."
                        zIndex={dropdownZIndex}
                      />
                    </div>
                    <button
                      onClick={handleOpenCOA}
                      className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70] transition-colors ml-[1px] h-[30px] flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </FormRow>
              </div>
            )}
          </div>
        </div>

        <div
          className="p-2 flex gap-2 border-t border-gray-300"
          style={{ backgroundColor: themeColor }}
        >
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-4 py-1.5 border border-white text-white text-xs font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors"
          >
            <Save size={14} /> Save
          </button>
          <button className="flex items-center gap-1 px-4 py-1.5 border border-white text-white text-xs font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors">
            <RotateCcw size={14} /> Clear
          </button>
          {initialData && (
            <button className="flex items-center gap-1 px-4 py-1.5 border border-white text-white text-xs font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors">
              <Trash2 size={14} /> Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-4 py-1.5 border border-white text-white text-xs font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors"
          >
            <LogOut size={14} /> Exit
          </button>
        </div>
      </div>

      {showChartOfAccounts && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
          style={{ zIndex: nestedModalZIndex }}
        >
          <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <ChartOfAccounts
              isOpen={showChartOfAccounts}
              onClose={() => setShowChartOfAccounts(false)}
              initialData={coaFormData}
              onSave={handleSaveCOA}
              index={nestedModalZIndex}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderTypeMaster;
