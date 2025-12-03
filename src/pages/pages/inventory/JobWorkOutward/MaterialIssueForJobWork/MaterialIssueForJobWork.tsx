import React, { useState } from "react";
import StockAdjustmentFormHeader from "./StockAdjustmentFormHeader";
import StockAdjustmentForm from "./StockAdjustmentForm";
import OrderTable from "./OrderTable";
import InvoiceFooter from "./InvoiceFooter";
import { COLORS } from "../../../../../constants/colors";
import Logistics from "./Logistics";
import { ArrowLeft } from "lucide-react";
import AddNewItem from "../../../../../components/addItemMaster/AddNewItem";

// 1. ADD QUESTION MARKS (?) HERE
interface ModalProps {
  isOpen?: boolean; // <--- Made optional
  onClose?: () => void; // <--- Made optional
}

// 2. ADD DEFAULT VALUES HERE (= true, = empty function)
const MaterialIssueForJobWork: React.FC<ModalProps> = ({
  isOpen = true,
  onClose = () => {},
}) => {
  if (isOpen) {
  }
  // 1. State to track if the nested form is open
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [showAddNew, setShowAddNew] = useState(false);

  // --- View 2: Add New Form (Overlay) ---
  if (showAddNew) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose} // This will now use the empty function if no prop is passed
      >
        <div
          className="w-full max-w-5xl bg-white shadow-xl rounded-sm overflow-hidden flex flex-col h-[650px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Back Button / Header Wrapper for the Sub-form */}
          <div className="p-4 border-b flex items-center gap-2 bg-gray-50">
            <button
              onClick={() => setShowAddNew(false)}
              className="flex items-center text-sm text-gray-600 hover:text-[#104a7d] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Material Issue
            </button>
          </div>

          {/* The Embedded Component (e.g., LocationMaster or specific Add New form) */}
          <div className="flex-1 overflow-hidden">
            <AddNewItem
              onClose={() => setShowAddNew(false)}
              onSuccess={() => setShowAddNew(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col h-screen bg-gray-100 overflow-hidden"
    >
      {/* Header (Fixed at top) - Only show if child overlay is NOT open */}
      {!isOverlayOpen && (
        <>
          <StockAdjustmentFormHeader />
        </>
      )}

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          {/* 2. Pass the setter function down to the form */}
          <StockAdjustmentForm
            onOverlayChange={(isOpen) => setIsOverlayOpen(isOpen)}
            // onAddNewItem={() => setShowAddNew(true)}
          />

          {/* 3. Conditionally render these. 
             If isOverlayOpen is TRUE (child form is active), these vanish.
          */}
          {!isOverlayOpen && (
            <>
              <OrderTable />
              <InvoiceFooter />
              <Logistics />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialIssueForJobWork;
