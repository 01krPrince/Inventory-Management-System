import React, { useState } from "react";
import POSOrderHeader from "./POSOrderHeader";
import POSOrderForm from "./POSOrderForm";
import OrderTable from "../../purchase/purchaseOrder/OrderTable";
import POSOrderFooter from "./POSOrderFooter";
import { COLORS } from "../../../../constants/colors";
import InvoiceA4 from "../../../../components/invoiceDownload/InvoiceA4";
import PosReceipt from "../../../../components/invoiceDownload/PosReceipt";

interface RowData {
  [key: string]: string | number;
}

const POSOrder: React.FC = () => {
  const [rows, setRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, RowData>>({});

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col bg-gray-100 overflow-hidden"
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

          <div className="mt-5 border-t-2 border-b-2 border-black flex w-full bg-gray-100 py-20 items-center justify-center">
            <div className="w-2/3">
              <InvoiceA4 />
            </div>

            <div className="w-1/3">
              <PosReceipt />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSOrder;
