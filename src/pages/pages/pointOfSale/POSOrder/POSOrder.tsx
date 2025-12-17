import React, { useState } from "react";
import POSOrderHeader from "./POSOrderHeader";
import POSOrderForm from "./POSOrderForm";
import OrderTable from "./OrderTable";
import POSOrderFooter from "./POSOrderFooter";
import { COLORS } from "../../../../constants/colors";

interface RowData {
  [key: string]: string | number;
}

const POSOrder: React.FC = () => {
  const [rows, setRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, RowData>>({});

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col h-screen bg-gray-100 overflow-hidden"
    >
      <POSOrderHeader />

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <POSOrderForm />

          <OrderTable
            rows={rows}
            setRows={setRows}
            tableData={tableData}
            setTableData={setTableData}
          />

          <POSOrderFooter />
        </div>
      </div>
    </div>
  );
};

export default POSOrder;
