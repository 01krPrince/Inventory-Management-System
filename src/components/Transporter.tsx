import React, { useState } from "react";
import { X, Save, Trash2, ArrowLeft } from "lucide-react";
import { LocationMaster } from "./LocationMaster";

// ==========================================
// MAIN COMPONENT: Transporter
// ==========================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Transporter: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [showLocationMaster, setShowLocationMaster] = useState(false);

  // If not open, render nothing.
  if (!isOpen) return null;

  // Custom color matching the image (Enterprise Blue)
  const themeBlue = "bg-[#104a7d]";

  // --- View 2: Location Master Form ---
  if (showLocationMaster) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-5xl bg-white shadow-xl rounded-sm overflow-hidden flex flex-col h-[650px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Back Button / Header Wrapper for the Sub-form */}
          <div className="p-4 border-b flex items-center gap-2 bg-gray-50">
            <button
              onClick={() => setShowLocationMaster(false)}
              className="flex items-center text-sm text-gray-600 hover:text-[#104a7d] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Inventory
            </button>
          </div>

          {/* The Embedded Location Master Component */}
          <div className="flex-1 overflow-hidden">
            <LocationMaster
              onClose={() => setShowLocationMaster(false)}
              onSuccess={() => setShowLocationMaster(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  // --- View 1: Main Inventory Form ---
  return (
    // BACKDROP
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* MODAL CONTAINER */}
      <div
        className="w-full max-w-4xl bg-white shadow-xl rounded-sm overflow-hidden flex flex-col h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header --- */}
        <div
          className={`${themeBlue} text-white px-4 py-2 flex justify-between items-center select-none`}
        >
          <h2 className="text-sm font-semibold tracking-wide">
            Document Category Inventory
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- Body Content --- */}
        <div className="flex-1 p-6 overflow-y-auto">
          <form className="space-y-4 max-w-3xl">
            {/* Row: Name */}
            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="text-gray-700 text-sm font-medium">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-[#104a7d] rounded-sm shadow-sm"
              />
            </div>

            {/* Row: Code */}
            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="text-gray-700 text-sm font-medium">Code</label>
              <input
                type="text"
                defaultValue="0002"
                className="w-full border border-gray-300 px-2 py-1.5 text-sm bg-gray-50 focus:outline-none focus:border-[#104a7d] rounded-sm shadow-sm"
              />
            </div>

            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="text-gray-700 text-sm font-medium">
                GST No.
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-[#104a7d] rounded-sm shadow-sm"
              />
            </div>

            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="text-gray-700 text-sm font-medium">
                Website URL
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-[#104a7d] rounded-sm shadow-sm"
              />
            </div>
          </form>
        </div>

        {/* --- Footer --- */}
        <div
          className={`${themeBlue} px-4 py-2 flex gap-2 border-t border-blue-800`}
        >
          <button className="flex items-center gap-2 px-4 py-1.5 border border-white/50 text-white text-sm rounded hover:bg-white/10 transition-colors">
            <Save size={16} />
            <span>Save</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-1.5 border border-white/50 text-white text-sm rounded hover:bg-white/10 transition-colors">
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transporter;
