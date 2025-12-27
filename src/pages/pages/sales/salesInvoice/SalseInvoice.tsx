import React from "react";
import SalesInvoiceHeader from "./SalesInvoiceHeader";
import SalesInvoiceForm from "./SalesInvoiceForm";
import OrderTable from "./OrderTable";
import InvoiceFooter from "./InvoiceFooter";
import LedgerAttributes from "../../../../components/LedgerAttributes";
import { COLORS } from "../../../../constants/colors";

const SalesInvoice: React.FC = () => {
  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col h-screen bg-gray-100 overflow-hidden"
    >
      {/* Header (Fixed at top) */}
      <SalesInvoiceHeader />

      {/* Main Content Area 
        - flex-1: Takes remaining height
        - overflow-auto: Allows scrolling for EVERYTHING inside (Form + Table)
      */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          {/* The Form - Will grow naturally as accordions open */}
          <SalesInvoiceForm />

          {/* The Table - Will be pushed down when form expands */}
          <OrderTable />

          <InvoiceFooter />

          <LedgerAttributes />
        </div>
      </div>
    </div>
  );
};

export default SalesInvoice;
