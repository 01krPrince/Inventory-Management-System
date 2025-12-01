import React, { useState } from "react";
import StockAdjustmentFormHeader from "./StockAdjustmentFormHeader";
import StockAdjustmentForm from "./StockAdjustmentForm";
import OrderTable from "./OrderTable";
import InvoiceFooter from "./InvoiceFooter";
import { COLORS } from "../../../../../constants/colors";
import Logistics from "./Logistics";

const MaterialIssueForJobWork: React.FC = () => {
  // 1. State to track if the nested form is open
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

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
          {/* 2. Pass the setter function down to the form
           */}
          <StockAdjustmentForm
            onOverlayChange={(isOpen) => setIsOverlayOpen(isOpen)}
          />

          {/* 3. Conditionally render these. 
             If isOverlayOpen is TRUE, these will physically vanish from the DOM.
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
