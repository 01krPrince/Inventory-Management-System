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
      className="flex flex-col bg-gray-100 overflow-hidden"
    >
      <SalesInvoiceHeader />

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <SalesInvoiceForm />

          <OrderTable />

          <InvoiceFooter />

          <LedgerAttributes />
        </div>
      </div>
    </div>
  );
};

export default SalesInvoice;
