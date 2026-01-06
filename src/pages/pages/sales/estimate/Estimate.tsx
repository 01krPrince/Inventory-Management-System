import React from "react";
import EstimateHeader from "./EstimateHeader";
import EstimateForm from "./EstimateForm";
import OrderTable from "./OrderTable";
import EstimateFooter from "./EstimateFooter";
import { COLORS } from "../../../../constants/colors";

const Estimate: React.FC = () => {
  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col bg-gray-100 overflow-hidden"
    >
      <EstimateHeader />

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <EstimateForm />

          <OrderTable />

          <EstimateFooter />
        </div>
      </div>
    </div>
  );
};

export default Estimate;
