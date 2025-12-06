import React, { useState } from "react";
import StockAdjustmentFormHeader from "./StockAdjustmentFormHeader";
import InterBranchTransferForm from "./InterBranchTransferForm";
import OrderTable from "./OrderTable";
import InvoiceFooter from "./InvoiceFooter";
import { COLORS } from "../../../../constants/colors";
import Logistics from "./Logistics";
import { LocationMaster } from "../../../../components/LocationMaster";
import { ArrowLeft } from "lucide-react";

// 1. ADD QUESTION MARKS (?) HERE
interface ModalProps {
  isOpen?: boolean; // <--- Made optional
  onClose?: () => void; // <--- Made optional
}

// 2. ADD DEFAULT VALUES HERE (= true, = empty function)
const InterBranchTransfer: React.FC<ModalProps> = ({
  isOpen = true,
  onClose = () => {},
}) => {
  if (isOpen) {
  }
  // State to track if the nested form is open
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [showLocationMaster, setShowLocationMaster] = useState(false);

  // --- View 2: Location Master Form ---
  if (showLocationMaster) {
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

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col h-screen bg-gray-100 overflow-hidden"
    >
      {/* Header (Fixed at top) */}
      {!isOverlayOpen && (
        <>
          <StockAdjustmentFormHeader />
        </>
      )}

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Pass the setter function down to the form */}
          <InterBranchTransferForm
            onOverlayChange={(isOpen) => setIsOverlayOpen(isOpen)}
          />

          {/* Conditionally render these. */}
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

export default InterBranchTransfer;
