import React, { useState } from "react"; // useMemo
import POSInvoiceHeader from "./POSOrderHeader";
import POSInvoideForm from "./POSOrderForm";
import OrderTable from "./OrderTable";
import POSInvoiceFooter from "./POSOrderFooter";
import { COLORS } from "../../../../constants/colors";

// --- UPDATED INTERFACE ---
interface RowData {
  [key: string]: string | number | boolean;
}

const POSInvoice: React.FC = () => {
  const [rows, setRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, RowData>>({});

  // --- CALCULATION LOGIC ---
  // const totalAmount = useMemo(() => {
  //   return Object.values(tableData).reduce((acc, row) => {
  //     const amt = parseFloat(String(row.amount || "0"));
  //     return acc + (isNaN(amt) ? 0 : amt);
  //   }, 0);
  // }, [tableData]);

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col min-h-screen overflow-hidden"
    >
      <POSInvoiceHeader />

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4 max-w-[1600px] mx-auto">
          {/* Top Form Section */}
          <POSInvoideForm />

          {/* Main Items Table */}
          <div className="bg-white rounded shadow-sm border border-gray-200">
            <OrderTable
              rows={rows}
              setRows={setRows}
              tableData={tableData}
              setTableData={setTableData}
            />
          </div>

          {/* Footer with Totals and Payment Trigger */}
          <div className="bg-white rounded shadow-sm border border-gray-200">
            <POSInvoiceFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSInvoice;
