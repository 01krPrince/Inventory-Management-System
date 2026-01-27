import React from "react";
import { X, Calendar, ChevronDown } from "lucide-react";

interface StockSummaryFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onView: (filters: any) => void;
}

const StockSummaryFilter: React.FC<StockSummaryFilterProps> = ({
  isOpen,
  onClose,
  onView,
}) => {
  if (!isOpen) return null;

  const inputStyle =
    "w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white appearance-none cursor-pointer";
  const labelStyle = "text-xs font-medium text-gray-700 w-1/3 pt-2";
  const fieldWrapperStyle = "flex items-start mb-2 gap-4";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-white w-[500px] rounded shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-[#1e4e7e] text-white px-4 py-2 flex justify-between items-center">
          <h2 className="text-sm font-semibold">Report Filter</h2>
          <button
            onClick={onClose}
            className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 bg-white max-h-[80vh] overflow-y-auto">
          {/* Quick Period */}
          <div className={fieldWrapperStyle}>
            <label className={labelStyle}>Quick Period</label>
            <div className="relative w-2/3">
              <select className={inputStyle}>
                <option>Quick Period</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-2.5 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          {/* From Date */}
          <div className={fieldWrapperStyle}>
            <label className={labelStyle}>From Date</label>
            <div className="relative w-2/3">
              <input
                type="text"
                defaultValue="01/04/2022"
                className={inputStyle}
              />
              <Calendar
                size={14}
                className="absolute right-2 top-2.5 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          {/* To Date */}
          <div className={fieldWrapperStyle}>
            <label className={labelStyle}>To Date</label>
            <div className="relative w-2/3">
              <input
                type="text"
                defaultValue="27/01/2026"
                className={inputStyle}
              />
              <Calendar
                size={14}
                className="absolute right-2 top-2.5 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          {/* Skip Zero Transaction */}
          <div className={fieldWrapperStyle}>
            <label className={labelStyle}>Skip Zero Transaction</label>
            <div className="w-2/3 pt-1">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#1e4e7e] focus:ring-[#1e4e7e]"
              />
            </div>
          </div>

          {/* Store */}
          <div className={fieldWrapperStyle}>
            <label className={labelStyle}>Store</label>
            <div className="relative w-2/3 group">
              <div className="flex items-center border border-gray-300 rounded px-2 py-1.5 text-xs bg-white">
                <span className="flex-grow truncate">
                  CHANDAN KHEL GHAR, GO...
                </span>
                <X
                  size={14}
                  className="text-gray-400 mr-1 hover:text-gray-600 cursor-pointer"
                />
                <ChevronDown size={14} className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* Item Group */}
          <div className={fieldWrapperStyle}>
            <label className={labelStyle}>Item Group</label>
            <div className="relative w-2/3">
              <select className={inputStyle + " text-gray-400"}>
                <option>Select</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-2.5 text-gray-500"
              />
            </div>
          </div>

          {/* Item */}
          <div className={fieldWrapperStyle}>
            <label className={labelStyle}>Item</label>
            <div className="relative w-2/3">
              <select className={inputStyle + " text-gray-400"}>
                <option>Select</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-2.5 text-gray-500"
              />
            </div>
          </div>

          {/* Item Category */}
          <div className={fieldWrapperStyle}>
            <label className={labelStyle}>Item Category</label>
            <div className="relative w-2/3">
              <select className={inputStyle + " text-gray-400"}>
                <option>Select</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-2.5 text-gray-500"
              />
            </div>
          </div>

          {/* SubItem */}
          <div className={fieldWrapperStyle}>
            <label className={labelStyle}>SubItem</label>
            <div className="relative w-2/3">
              <select className={inputStyle + " text-gray-400"}>
                <option>Select</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-2.5 text-gray-500"
              />
            </div>
          </div>

          {/* Approval Status */}
          <div className={fieldWrapperStyle}>
            <label className={labelStyle}>Approval Status</label>
            <div className="relative w-2/3 group">
              <div className="flex items-center border border-gray-300 rounded px-2 py-1.5 text-xs bg-white">
                <span className="flex-grow">Approved</span>
                <X
                  size={14}
                  className="text-gray-400 mr-1 hover:text-gray-600 cursor-pointer"
                />
                <ChevronDown size={14} className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* Item Type */}
          <div className={fieldWrapperStyle}>
            <label className={labelStyle}>Item Type</label>
            <div className="relative w-2/3">
              <select className={inputStyle + " text-gray-400"}>
                <option>Select</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-2.5 text-gray-500"
              />
            </div>
          </div>

          {/* Stock Location */}
          <div className={fieldWrapperStyle}>
            <label className={labelStyle}>Stock Location</label>
            <div className="relative w-2/3">
              <select className={inputStyle + " text-gray-400"}>
                <option>Select...</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-2.5 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#1e4e7e] p-3 flex justify-start">
          <button
            onClick={onView}
            className="bg-[#1e4e7e] border border-white/40 hover:bg-[#28609c] text-white text-xs px-4 py-1.5 rounded transition-colors shadow-inner"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockSummaryFilter;
