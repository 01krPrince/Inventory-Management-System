import React, { useState } from "react";
import StockAdjustmentFormHeader from "./StockAdjustmentFormHeader";
import StockAdjustmentForm from "./StockAdjustmentForm";
import OrderTable from "./OrderTable";
import StockAdjustmentFooter from "./StockAdjustmentFooter";
import { COLORS } from "../../../../constants/colors";

const StockAdjustment: React.FC = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col h-screen bg-gray-100 overflow-hidden"
    >
      {!isOverlayOpen && (
        <>
          <StockAdjustmentFormHeader />
        </>
      )}

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <StockAdjustmentForm
            onOverlayChange={(isOpen) => setIsOverlayOpen(isOpen)}
          />

          {!isOverlayOpen && (
            <>
              <OrderTable />
              <StockAdjustmentFooter />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockAdjustment;
