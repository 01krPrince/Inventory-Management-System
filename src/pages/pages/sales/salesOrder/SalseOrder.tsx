import React from "react";
import SalseOrderHeader from "./SalseOrderHeader";
import SalseOrderForm from "./SalseOrderForm";
import OrderTable from "./OrderTable";
import InvoiceFooter from "./InvoiceFooter";
import { COLORS } from "../../../../constants/colors";

const SalseOrder: React.FC = () => {
  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col bg-gray-100 overflow-hidden"
    >
      <SalseOrderHeader />

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <SalseOrderForm />

          <OrderTable />

          <InvoiceFooter />
        </div>
      </div>
    </div>
  );
};

export default SalseOrder;
