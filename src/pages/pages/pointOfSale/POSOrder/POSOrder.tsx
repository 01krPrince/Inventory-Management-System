import React from "react";
import POSOrderHeader from "./POSOrderHeader";
import POSOrderForm from "./POSOrderForm";
import OrderTable from "./OrderTable";
import POSOrderFooter from "./POSOrderFooter";
import LedgerAttributes from "./LedgerAttributes";
import { COLORS } from "../../../../constants/colors";

const POSOrder: React.FC = () => {
  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col h-screen bg-gray-100 overflow-hidden"
    >
      <POSOrderHeader />

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <POSOrderForm />

          <OrderTable />

          <POSOrderFooter />

          <LedgerAttributes />
        </div>
      </div>
    </div>
  );
};

export default POSOrder;
