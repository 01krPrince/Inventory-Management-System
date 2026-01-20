import React, { useState } from "react";
import StockAdjustmentFormHeader from "./StockAdjustmentFormHeader";
import StockAdjustmentForm, {
  StockAdjustmentHeaderData,
} from "./StockAdjustmentForm";
import OrderTable from "./OrderTable"; // Ensure this path is correct
import AttachmentSection from "../../../../components/AttachmentSection";
import { COLORS } from "../../../../constants/colors";

import {
  createStockAdjustment,
  StockAdjustmentItem,
  StockAdjustment as StockAdjustmentPayload,
} from "./api/StockAdjustmentService";

// --- Types ---
// This matches the RowData used inside OrderTable
export interface RowData {
  [key: string]: string | number;
}

interface FooterData {
  remarks: string;
}

const StockAdjustment: React.FC = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. Header State ---
  const [formData, setFormData] = useState<StockAdjustmentHeaderData>({
    voucherDate: new Date().toISOString().split("T")[0],
    voucherNo: "SA-3005",
    category: "",
    store: "",
    party: "",
  });

  // --- 2. Table State (LIFTED UP) ---
  // These variables hold the data for the OrderTable.
  // Because they are here, the parent has full access to the table data.
  const [rows, setRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, RowData>>({});

  // --- 3. Footer State ---
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
    // --- DEBUG LOGS ---
    console.group("StockAdjustment Submit Debug");
    console.log("1. Header Data:", formData);
    console.log("2. Table Rows IDs:", rows);
    console.log("3. Table Data Content:", tableData);
    console.log("4. Footer Data:", footerData);
    
    // --- Validation ---
    if (rows.length === 0) {
      alert("Please add at least one item to the table.");
      console.groupEnd();
      return;
    }
    if (!formData.category || !formData.store) {
      alert("Category and Store are required.");
      console.groupEnd();
      return;
    }

    setIsSubmitting(true);

// Inside handleSave ...

    const formattedItems: StockAdjustmentItem[] = rows
      .map((rowId) => tableData[rowId]) 
      .filter((row) => row && row.select && row.select !== "") 
      .map((row) => ({
        adjustmentType: String(row.reciss || "Receipt"), 

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

    console.log("5. Formatted Items for API:", formattedItems);

    if (formattedItems.length === 0) {
      alert("No valid items found. Please select an item in the rows.");
      console.warn("Validation Failed: No valid items.");
      console.groupEnd();
      setIsSubmitting(false);
      return;
    }

    // --- Construct Final Payload ---
    const payload: StockAdjustmentPayload = {
      category: formData.category,
      store: formData.store,
      party: formData.party,
      voucherDate: formData.voucherDate,
      voucherNo: formData.voucherNo,
      remarks: footerData.remarks,
      items: formattedItems,
    };

    console.log("6. Final Payload:", JSON.stringify(payload, null, 2));

    // --- API Call ---
    try {
      const result = await createStockAdjustment(payload);

      console.log("7. API Result:", result);

      if (result.success) {
        alert("Success! " + result.message);
        handleCancel(); // Reset the form on success
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("8. Submission Error:", error);
      alert("An unexpected error occurred while saving.");
    } finally {
      console.groupEnd();
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
          {/* Header Form */}
          <StockAdjustmentForm
            themeColor={COLORS.primary}
            onOverlayChange={(isOpen) => setIsOverlayOpen(isOpen)}
            data={formData}
            onDataChange={setFormData}
          />

          {!isOverlayOpen && (
            <>
              {/* Table Component 
                  Data is passed DOWN from this parent state.
                  Updates in OrderTable call setRows/setTableData, updating this parent.
              */}
              <OrderTable
                rows={rows}
                setRows={setRows}
                tableData={tableData}
                setTableData={setTableData}
              />

              {/* Footer / Attachments */}
              <AttachmentSection
                data={footerData}
                onDataChange={setFooterData}
              />

              {/* Submit Action */}
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