import React, { useState } from "react";
import StockAdjustmentFormHeader from "./StockAdjustmentFormHeader";
import StockAdjustmentForm, {
  StockAdjustmentHeaderData,
} from "./StockAdjustmentForm";
import OrderTable from "./OrderTable";
import AttachmentSection from "../../../../components/AttachmentSection";
import { COLORS } from "../../../../constants/colors";

import {
  createStockAdjustment,
  StockAdjustmentItem,
  StockAdjustment as StockAdjustmentPayload,
} from "./api/StockAdjustmentService";

interface RowData {
  [key: string]: string | number;
}

interface FooterData {
  remarks: string;
}

const StockAdjustment: React.FC = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<StockAdjustmentHeaderData>({
    voucherDate: new Date().toISOString().split("T")[0],
    voucherNo: "SA-3005",
    category: "",
    store: "",
    party: "",
  });

  const [rows, setRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, RowData>>({});

  const [footerData, setFooterData] = useState<FooterData>({
    remarks: "",
  });

  const handleCancel = () => {
    setRows([]);
    setTableData({});
    setFormData({
      voucherDate: new Date().toISOString().split("T")[0],
      voucherNo: "",
      category: "",
      store: "",
      party: "",
    });
    setFooterData({ remarks: "" });
  };

  const handleSave = async () => {
    if (rows.length === 0) {
      alert("Please add at least one item to the table.");
      return;
    }
    if (!formData.category || !formData.store) {
      alert("Category and Store are required.");
      return;
    }

    setIsSubmitting(true);

    const formattedItems: StockAdjustmentItem[] = rows
      .map((rowId) => tableData[rowId])
      .filter((row) => row && row.select && row.select !== "")
      .map((row) => ({
        itemcode: String(row.select || ""),
        description: String(row.desc || ""),
        packUnit: String(row.punit || ""),
        packQuantity: Number(row.pqty || 0),
        unit: String(row.unit || ""),
        quantity: Number(row.qty || 0),
        ratePer: 1,
        rate: Number(row.rate || 0),
        amount: Number(row.amount || 0),
        minRate: Number(row.minrate || 0),
        mrp: Number(row.mrp || 0),
        netRate: Number(row.netrate || 0),
        remark: String(row.remark || ""),
        printDesc: String(row.printdesc || row.desc || ""),
        serviceLocation: String(row.service || ""),
        itemBarcode: String(row.itembarcode || ""),
        bdBatchNo: String(row.bdbatchno || ""),
        bdMfgDate: "2024-01-01",
        bdExpDate: String(row.bdexpdate || "2025-12-12"),
        bdSaleRate: Number(row.bdsalerate || 0),
        itemBalance: Number(row.itembalance || 0),
        barcode: String(row.barcode || ""),
        lineLevelBarcode: String(row.linelevel || ""),
        hsnCode: String(row.hsn || ""),
        brand: String(row.brand || ""),
      }));

    if (formattedItems.length === 0) {
      alert("No valid items found to save.");
      setIsSubmitting(false);
      return;
    }

    // 3. Construct Payload
    const payload: StockAdjustmentPayload = {
      category: formData.category,
      store: formData.store,
      party: formData.party,
      voucherDate: formData.voucherDate,
      voucherNo: formData.voucherNo,
      remarks: footerData.remarks,
      items: formattedItems,
    };

    console.log("Submitting Payload:", payload);

    // 4. API Call
    try {
      const result = await createStockAdjustment(payload);

      if (result.success) {
        alert("Success! " + result.message);
        handleCancel(); // Reset Form
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onManualCancel = () => {
    if (window.confirm("Are you sure you want to clear the form?")) {
      handleCancel();
    }
  };

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col h-auto bg-gray-100 overflow-hidden relative"
    >
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 z-50 bg-black/20 flex items-center justify-center backdrop-blur-[1px]">
          <div className="bg-white p-4 rounded shadow-lg font-semibold text-gray-700">
            Saving Data...
          </div>
        </div>
      )}

      {!isOverlayOpen && (
        <StockAdjustmentFormHeader onCancel={onManualCancel} />
      )}

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <StockAdjustmentForm
            themeColor={COLORS.primary}
            onOverlayChange={(isOpen) => setIsOverlayOpen(isOpen)}
            data={formData}
            onDataChange={setFormData}
          />

          {!isOverlayOpen && (
            <>
              <OrderTable
                rows={rows}
                setRows={setRows}
                tableData={tableData}
                setTableData={setTableData}
              />

              <AttachmentSection
                data={footerData}
                onDataChange={setFooterData}
              />

              {/* Submit Button */}
              <div className="flex justify-end pb-4">
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-8 py-2 text-white font-semibold rounded shadow-md transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  {isSubmitting ? "Saving..." : "Submit Adjustment"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockAdjustment;
