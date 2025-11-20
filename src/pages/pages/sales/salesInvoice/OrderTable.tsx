import React, { useState, useRef, MouseEvent } from "react";
import {
  Plus,
  X,
  Search,
  Copy,
  List,
  FileText,
  BarChart2,
  ScanLine,
  Settings,
  Table,
  ExternalLink,
  FileSpreadsheet,
  DollarSign,
} from "lucide-react";

// --- TYPES ---
interface Column {
  id: string;
  label: string;
  width: number;
  fixed?: boolean;
  align: "left" | "center" | "right";
}

const OrderTable: React.FC = () => {
  // --- 1. COLUMN CONFIGURATION ---
  const initialColumns: Column[] = [
    // --- FIXED COLUMNS (First 7) ---
    { id: "sno", label: "SNo", width: 40, fixed: true, align: "center" },
    { id: "add", label: "", width: 40, fixed: true, align: "center" },
    { id: "del", label: "", width: 40, fixed: true, align: "center" },
    { id: "srch", label: "", width: 40, fixed: true, align: "center" },
    { id: "copy", label: "", width: 40, fixed: true, align: "center" },
    {
      id: "select",
      label: "Select Item",
      width: 120,
      fixed: true,
      align: "left",
    },
    {
      id: "desc",
      label: "Description",
      width: 200,
      fixed: true,
      align: "left",
    },

    // --- SCROLLABLE COLUMNS ---
    { id: "attr", label: "Attribute", width: 60, align: "center" },
    { id: "widg", label: "Widget", width: 60, align: "center" },
    { id: "sugg", label: "Suggested", width: 100, align: "center" },
    { id: "batch", label: "Batch", width: 60, align: "center" },
    { id: "punit", label: "Pack Unit", width: 80, align: "left" },
    { id: "pqty", label: "Pack Qty", width: 80, align: "right" },
    { id: "unit", label: "Unit", width: 60, align: "left" },
    { id: "qty", label: "Quantity", width: 80, align: "right" },
    { id: "free", label: "Free Qty", width: 80, align: "right" },
    { id: "rateper", label: "Rate Per", width: 80, align: "left" },
    { id: "rate", label: "Rate", width: 80, align: "right" },
    { id: "amount", label: "Amount", width: 90, align: "right" },
    { id: "minrate", label: "Min Rate", width: 80, align: "right" },
    { id: "disc", label: "Discount", width: 80, align: "right" },
    { id: "disc_perc", label: "Discount %", width: 80, align: "right" },
    { id: "taxcode", label: "Tax Code", width: 80, align: "left" },
    { id: "taxrate", label: "Tax Rate", width: 70, align: "right" },
    { id: "taxable", label: "Taxable", width: 90, align: "right" },
    { id: "taxamt", label: "TaxAmt", width: 80, align: "right" },
    { id: "mrp", label: "MRP", width: 80, align: "right" },
    { id: "netrate", label: "Net Rate", width: 90, align: "right" },
    { id: "remark", label: "Remark", width: 150, align: "left" },
    { id: "printdesc", label: "Print Desc", width: 150, align: "left" },
    { id: "service", label: "Service", width: 80, align: "center" },
    { id: "serviceloc", label: "Service Loc", width: 100, align: "left" },
    { id: "itembarcode", label: "Item Barcode", width: 120, align: "left" },
    { id: "postinggl", label: "PostingGL", width: 100, align: "left" },
    { id: "promoqty", label: "PromoQty", width: 80, align: "right" },
    { id: "promotion", label: "Promotion", width: 100, align: "left" },
    { id: "barcodedisc", label: "BarcodeDisc", width: 90, align: "right" },
    { id: "coupon", label: "Coupon", width: 80, align: "left" },
    { id: "sovno", label: "SO VNo", width: 80, align: "left" },
    { id: "sorefno", label: "SO Ref No", width: 100, align: "left" },
    { id: "sorefdate", label: "SO Ref Date", width: 100, align: "left" },
    { id: "sovdate", label: "SO VDate", width: 100, align: "left" },
    { id: "gpvno", label: "GP VNo", width: 80, align: "left" },
    { id: "gprefno", label: "GP Ref No", width: 100, align: "left" },
    { id: "gprefdate", label: "GP Ref Date", width: 100, align: "left" },
    { id: "gpvdate", label: "GP VDate", width: 100, align: "left" },
    { id: "bdbatchno", label: "BD Batch No", width: 100, align: "left" },
    { id: "bdexpdate", label: "BD Exp.Date", width: 100, align: "left" },
    { id: "bdsalerate", label: "BD Sale rate", width: 90, align: "right" },
    { id: "itembalance", label: "Itembalance", width: 90, align: "right" },
    { id: "barcode", label: "Barcode", width: 100, align: "left" },
    { id: "linelevel", label: "Line Level Barcode", width: 130, align: "left" },
    { id: "igst", label: "IGST", width: 80, align: "right" },
    { id: "cgst", label: "CGST", width: 80, align: "right" },
    { id: "sgst", label: "SGST", width: 80, align: "right" },
    { id: "hsn", label: "HSN Code", width: 80, align: "left" },
    { id: "brand", label: "Brand", width: 100, align: "left" },
  ];

  // Increase row count to demonstrate scrolling
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [rows] = useState<number[]>(
    Array.from({ length: 100 }, (_, i) => i + 1)
  );

  // Define which columns should show totals
  const totalColumns = [
    "pqty",
    "qty",
    "free",
    "amount",
    "disc",
    "disc_perc",
    "taxable",
    "taxamt",
    "igst",
    "cgst",
    "sgst",
  ];

  // --- 2. RESIZING LOGIC ---
  const resizingRef = useRef<number | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = index;
    startXRef.current = e.clientX;
    startWidthRef.current = columns[index].width;

    document.addEventListener("mousemove", handleMouseMove as any);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent) => {
    if (resizingRef.current === null) return;
    const deltaX = e.clientX - startXRef.current;
    const newWidth = Math.max(40, startWidthRef.current + deltaX);

    setColumns((prev) => {
      if (resizingRef.current === null) return prev;
      const newCols = [...prev];
      newCols[resizingRef.current] = {
        ...newCols[resizingRef.current],
        width: newWidth,
      };
      return newCols;
    });
  };

  const handleMouseUp = () => {
    resizingRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove as any);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // --- 3. STICKY OFFSET CALCULATION ---
  const getStickyLeft = (index: number): number => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      if (columns[i].fixed) {
        offset += columns[i].width;
      }
    }
    return offset;
  };

  const totalWidth = columns.reduce((acc, col) => acc + col.width, 0);

  // --- 4. HEIGHT CALCULATION ---
  // Header (36px/h-9) + Footer (36px/h-9) + 10 Rows (32px/h-8 each) + 14px Scrollbar buffer
  const tableContainerHeight = 36 + 36 + 10 * 24 + 14;

  return (
    <div className="flex flex-col h-auto bg-gray-50 font-sans text-sm overflow-hidden relative z-0">
      {/* --- HEADER TOOLBAR --- */}
      {/* LOWERED Z-INDEX: Was z-50, now z-10 to sit below external sidebars */}
      <div className="flex-none flex justify-between items-center p-2 bg-white border-b border-gray-200 z-10 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 h-9 w-72 bg-white rounded-sm">
            <div className="px-2 border-r border-gray-300 h-full flex items-center justify-center bg-gray-50">
              <ScanLine className="text-orange-500 w-6 h-6" />
            </div>
            <input
              type="text"
              placeholder="Scan"
              className="px-2 outline-none text-sm w-full text-gray-700"
            />
          </div>
        </div>

        <button className="bg-[#0e4a7b] text-white px-6 py-1.5 rounded text-xs font-bold hover:bg-blue-900 shadow-sm">
          Pull From Order
        </button>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#0e4a7b] rounded text-white h-8 items-center shadow-sm">
            <button className="px-3 border-r border-blue-800 h-full flex items-center hover:bg-blue-900">
              <List size={16} />
            </button>
            <button className="px-3 border-r border-blue-800 h-full flex items-center hover:bg-blue-900">
              <Settings size={16} />
            </button>
            <button className="px-3 h-full flex items-center hover:bg-blue-900">
              <ExternalLink size={16} />
            </button>
          </div>

          <div className="flex gap-1">
            <button className="h-8 w-8 flex items-center justify-center bg-[#0e4a7b] text-white rounded shadow-sm hover:bg-blue-900">
              <FileSpreadsheet size={16} />
            </button>
            <button className="h-8 w-8 flex items-center justify-center bg-green-600 text-white rounded shadow-sm hover:bg-green-700 text-lg font-bold">
              <DollarSign size={16} />
            </button>
            <button className="h-8 w-8 flex items-center justify-center bg-[#0e4a7b] text-white rounded shadow-sm hover:bg-blue-900">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN TABLE AREA --- */}
      <div className="flex-1 p-2 relative flex flex-col z-0">
        <div className="w-full border border-gray-300 bg-white shadow-sm relative overflow-hidden">
          {/* Scrollable Container */}
          <div
            className="w-full overflow-auto custom-scrollbar"
            style={{ height: `${tableContainerHeight}px` }}
          >
            <div style={{ width: `${totalWidth}px` }}>
              <table className="border-collapse table-fixed w-full">
                {/* --- TABLE HEADER --- */}
                {/* Header Container is Z-20 (Standard) or Z-30 (Fixed) */}
                <thead className="bg-[#0e4a7b] text-white sticky top-0 z-20">
                  <tr className="h-6">
                    {columns.map((col, index) => {
                      const leftOffset = col.fixed
                        ? getStickyLeft(index)
                        : undefined;
                      return (
                        <th
                          key={col.id}
                          style={{
                            width: `${col.width}px`,
                            left: col.fixed ? leftOffset : "auto",
                            top: 0,
                            position: "sticky",
                            // FIXED: Lowered z-index. Fixed cols=30, Scrollable=20.
                            zIndex: col.fixed ? 30 : 20,
                          }}
                          className="border-r border-blue-900 bg-[#0e4a7b] px-1 text-xs font-normal select-none group"
                        >
                          <div
                            className={`flex w-full h-full items-center ${
                              col.align === "center"
                                ? "justify-center"
                                : "justify-start px-1"
                            }`}
                          >
                            {col.label}
                          </div>
                          <div
                            // FIXED: Resizer z-index = 40 (Must be highest in table, but < sidebar)
                            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 z-40"
                            onMouseDown={(e) => handleMouseDown(e, index)}
                          />
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                {/* --- TABLE BODY --- */}
                <tbody>
                  {rows.map((rowNum, rIdx) => (
                    <tr
                      key={rIdx}
                      className="h-6 border-b border-gray-200 hover:bg-blue-50"
                    >
                      {columns.map((col, cIdx) => {
                        const leftOffset = col.fixed
                          ? getStickyLeft(cIdx)
                          : undefined;

                        let content: React.ReactNode = null;

                        if (col.id === "sno")
                          content = (
                            <span className="text-gray-600">{rowNum}</span>
                          );
                        else if (col.id === "add")
                          content = (
                            <Plus
                              size={14}
                              className="text-green-600 mx-auto cursor-pointer"
                            />
                          );
                        else if (col.id === "del")
                          content = (
                            <X
                              size={14}
                              className="text-red-600 mx-auto cursor-pointer"
                            />
                          );
                        else if (col.id === "srch")
                          content = (
                            <Search
                              size={14}
                              className="text-green-600 mx-auto cursor-pointer"
                            />
                          );
                        else if (col.id === "copy")
                          content = (
                            <Copy
                              size={14}
                              className="text-red-400 mx-auto cursor-pointer"
                            />
                          );
                        else if (col.id === "select" && rIdx === 6)
                          content = (
                            <span className="text-gray-400 text-[10px] italic flex justify-between">
                              Select... <span>▶</span>
                            </span>
                          );
                        else if (col.id === "attr")
                          content = (
                            <FileText
                              size={14}
                              className="text-blue-400 mx-auto"
                            />
                          );
                        else if (col.id === "widg")
                          content = (
                            <BarChart2
                              size={14}
                              className="text-blue-400 mx-auto"
                            />
                          );
                        else if (col.id === "sugg")
                          content = (
                            <List
                              size={14}
                              className="text-[#0e4a7b] mx-auto"
                            />
                          );
                        else if (col.id === "batch")
                          content = (
                            <Table
                              size={14}
                              className="text-[#0e4a7b] mx-auto"
                            />
                          );
                        else if (["igst", "cgst", "sgst"].includes(col.id))
                          content = "₹0.00";
                        else if (["bdsalerate", "itembalance"].includes(col.id))
                          content = "0";

                        return (
                          <td
                            key={col.id}
                            style={{
                              width: `${col.width}px`,
                              left: leftOffset,
                              position: col.fixed ? "sticky" : "static",
                              // FIXED: Body Fixed Cols = 10. Standard Cells = auto (0).
                              zIndex: col.fixed ? 10 : "auto",
                            }}
                            className={`border-r border-gray-200 bg-white px-1 text-xs overflow-hidden whitespace-nowrap ${
                              col.align === "center"
                                ? "text-center"
                                : col.align === "right"
                                ? "text-right"
                                : "text-left"
                            }`}
                          >
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>

                {/* --- TABLE FOOTER (TOTALS) --- */}
                {/* Footer z-index must match Header levels to float above body */}
                <tfoot className="bg-gray-100 sticky bottom-0 z-20 shadow-[0_-1px_2px_rgba(0,0,0,0.1)]">
                  <tr className="h-9 font-bold text-gray-700">
                    {columns.map((col, cIdx) => {
                      const leftOffset = col.fixed
                        ? getStickyLeft(cIdx)
                        : undefined;
                      const isTotalCol = totalColumns.includes(col.id);

                      return (
                        <td
                          key={col.id}
                          style={{
                            width: `${col.width}px`,
                            left: leftOffset,
                            position: "sticky",
                            bottom: 0,
                            // FIXED: Footer Fixed = 30, Scrollable = 20
                            zIndex: col.fixed ? 30 : 20,
                          }}
                          className={`border-r border-gray-300 bg-gray-50 px-1 text-xs overflow-hidden whitespace-nowrap border-t-2 border-t-gray-300 ${
                            col.align === "center"
                              ? "text-center"
                              : col.align === "right"
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          {col.id === "desc"
                            ? "TOTAL"
                            : isTotalCol
                            ? "0.00"
                            : ""}
                        </td>
                      );
                    })}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM TOOLBAR --- */}
      {/* FIXED: Lowered to z-10 */}
      <div className="flex-none h-12 bg-white border-t border-gray-200 px-4 flex justify-between items-center shadow-[0_-2px_4px_rgba(0,0,0,0.05)] z-10 relative">
        <div className="flex gap-2">
          <button className="h-8 w-8 bg-[#0e4a7b] text-white rounded flex items-center justify-center hover:bg-blue-900 shadow-sm">
            <Plus size={16} />
          </button>
          <button className="h-8 w-8 bg-[#0e4a7b] text-white rounded flex items-center justify-center hover:bg-blue-900 shadow-sm">
            <Search size={16} />
          </button>
          <button className="h-8 w-8 bg-[#0e4a7b] text-white rounded flex items-center justify-center hover:bg-blue-900 font-bold shadow-sm">
            W
          </button>
        </div>

        <div className="pr-8"></div>
      </div>

      {/* --- GLOBAL STYLES FOR SCROLLBAR --- */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 14px;
          height: 14px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #0e4a7b;
          border-radius: 10px;
          border: 3px solid #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #0c3b62;
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
            background: #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default OrderTable;
