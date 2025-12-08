import React, { useState, useRef, MouseEvent, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import {
  Plus,
  X,
  Search,
  Copy,
  FileText,
  BarChart2,
  ScanLine,
  Settings,
  Table,
  ExternalLink,
  FileSpreadsheet,
  DollarSign,
  List,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { COLORS } from "../../../../constants/colors";
import { fetchItems } from "../itemMaster/api/itemService";
// --- FIX: Import the type from your model file instead of defining it locally ---
import { ItemApiData } from "../itemMaster/models/ItemModel";
import AttributePanel from "../../../../components/AttributePanel";
// --- TYPES ---
interface Column {
  id: string;
  label: string;
  width: number;
  align: "left" | "center" | "right";
  sticky?: "left";
  resizable?: boolean;
}

// Interface for the Editable Row Data
interface RowData {
  [key: string]: string | number;
}

const OrderTable: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [items, setItems] = useState<ItemApiData[]>([]);
  const [tableData, setTableData] = useState<Record<number, RowData>>({});

  // Sort State
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Popup State (Item Selection List)
  const [popupState, setPopupState] = useState<{
    visible: boolean;
    top: number;
    left: number;
    activeRowIndex: number | null;
  }>({ visible: false, top: 0, left: 0, activeRowIndex: null });

  // Attribute Panel State (Form)
  const [attributePanelState, setAttributePanelState] = useState<{
    visible: boolean;
    activeRowIndex: number | null;
    tempItemData: ItemApiData | null;
  }>({ visible: false, activeRowIndex: null, tempItemData: null });

  // --- FETCH DATA ON MOUNT ---
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchItems();
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Failed to load items", error);
      }
    };
    loadItems();
  }, []);

  // --- 1. COLUMN CONFIGURATION ---
  const initialColumns: Column[] = [
    // --- FIXED COLUMNS ---
    {
      id: "sno",
      label: "SNo",
      width: 40,
      sticky: "left",
      align: "center",
      resizable: true,
    },
    {
      id: "add",
      label: "",
      width: 35,
      sticky: "left",
      align: "center",
      resizable: true,
    },
    {
      id: "del",
      label: "",
      width: 35,
      sticky: "left",
      align: "center",
      resizable: true,
    },
    {
      id: "srch",
      label: "",
      width: 35,
      sticky: "left",
      align: "center",
      resizable: true,
    },
    {
      id: "copy",
      label: "",
      width: 35,
      sticky: "left",
      align: "center",
      resizable: true,
    },
    {
      id: "reciss",
      label: "Rec Iss",
      width: 70,
      align: "right",
      sticky: "left",
      resizable: true,
    },
    {
      id: "select",
      label: "Select Item",
      width: 110,
      sticky: "left",
      align: "left",
      resizable: true,
    },
    {
      id: "desc",
      label: "Description",
      width: 180,
      sticky: "left",
      align: "left",
      resizable: true,
    },

    // --- SCROLLABLE COLUMNS ---
    {
      id: "attr",
      label: "Attribute",
      width: 40,
      align: "center",
      resizable: true,
    },
    {
      id: "widg",
      label: "Widget",
      width: 40,
      align: "center",
      resizable: true,
    },
    {
      id: "batch",
      label: "Batch",
      width: 45,
      align: "center",
      resizable: true,
    },
    {
      id: "punit",
      label: "Pack Unit",
      width: 50,
      align: "left",
      resizable: true,
    },
    {
      id: "pqty",
      label: "Pack Qty",
      width: 50,
      align: "right",
      resizable: true,
    },
    { id: "unit", label: "Unit", width: 50, align: "left", resizable: true },

    // Editable Fields
    {
      id: "qty",
      label: "Quantity",
      width: 70,
      align: "right",
      resizable: true,
    },
    {
      id: "rateper",
      label: "Rate Per",
      width: 70,
      align: "left",
      resizable: true,
    },
    { id: "rate", label: "Rate", width: 70, align: "right", resizable: true },
    {
      id: "amount",
      label: "Amount",
      width: 80,
      align: "right",
      resizable: true,
    },
    {
      id: "minrate",
      label: "Min Rate",
      width: 70,
      align: "right",
      resizable: true,
    },
    { id: "mrp", label: "MRP", width: 70, align: "right", resizable: true },
    {
      id: "netrate",
      label: "Net Rate",
      width: 80,
      align: "right",
      resizable: true,
    },
    {
      id: "remark",
      label: "Remark",
      width: 120,
      align: "left",
      resizable: true,
    },
    {
      id: "printdesc",
      label: "Print Desc",
      width: 120,
      align: "left",
      resizable: true,
    },
    {
      id: "service",
      label: "Service Location",
      width: 90,
      align: "center",
      resizable: true,
    },
    {
      id: "itembarcode",
      label: "Item Barcode",
      width: 100,
      align: "left",
      resizable: true,
    },

    // --- SYSTEM COLUMNS ---
    {
      id: "bdbatchno",
      label: "BD Batch No",
      width: 90,
      align: "left",
      resizable: false,
    },
    {
      id: "bdexpdate",
      label: "BD Exp.Date",
      width: 90,
      align: "left",
      resizable: false,
    },
    {
      id: "bdsalerate",
      label: "BD Sale rate",
      width: 90,
      align: "right",
      resizable: false,
    },
    {
      id: "itembalance",
      label: "Itembalance",
      width: 80,
      align: "right",
      resizable: false,
    },
    {
      id: "barcode",
      label: "Barcode",
      width: 100,
      align: "left",
      resizable: false,
    },
    {
      id: "linelevel",
      label: "Line Level Barcode",
      width: 110,
      align: "left",
      resizable: false,
    },
    {
      id: "hsn",
      label: "HSN Code",
      width: 70,
      align: "left",
      resizable: false,
    },
    { id: "brand", label: "Brand", width: 90, align: "left", resizable: false },
  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [rows] = useState<number[]>(Array.from({ length: 50 }, (_, i) => i));

  // --- 2. EDITING LOGIC ---
  const handleInputChange = (
    rowIndex: number,
    columnId: string,
    value: string
  ) => {
    setTableData((prev) => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [columnId]: value,
      },
    }));
  };

  // --- 3. SORTING LOGIC ---
  const handleHeaderClick = (columnId: string) => {
    const nonSortable = [
      "sno",
      "add",
      "del",
      "srch",
      "copy",
      "attr",
      "widg",
      "batch",
    ];
    if (nonSortable.includes(columnId)) return;

    setSortConfig((current) => {
      if (current?.key === columnId && current.direction === "asc") {
        return { key: columnId, direction: "desc" };
      }
      return { key: columnId, direction: "asc" };
    });
  };

  const sortedRows = useMemo(() => {
    let sortableRows = [...rows];
    if (sortConfig !== null) {
      sortableRows.sort((a, b) => {
        const rowA = tableData[a];
        const rowB = tableData[b];

        // Empty rows logic: push to bottom
        if (!rowA && !rowB) return 0;
        if (!rowA) return 1;
        if (!rowB) return -1;

        const valA = rowA[sortConfig.key] || "";
        const valB = rowB[sortConfig.key] || "";

        // String Sort
        if (typeof valA === "string" && typeof valB === "string") {
          return sortConfig.direction === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        // Numeric Sort
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableRows;
  }, [rows, tableData, sortConfig]);

  // --- 4. SELECTION & FLOW LOGIC ---

  // A. Trigger Popup
  const handleSelectClick = (
    e: React.MouseEvent<HTMLDivElement>,
    rowIndex: number
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupState({
      visible: true,
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      activeRowIndex: rowIndex,
    });
  };

  const closePopup = () => {
    setPopupState((prev) => ({
      ...prev,
      visible: false,
      activeRowIndex: null,
    }));
  };

  // B. Handle Item Selection from Popup
  const handleItemSelect = (item: ItemApiData) => {
    if (popupState.activeRowIndex !== null) {
      // Don't save to table yet. Store in temp state and open Attribute Panel.
      setAttributePanelState({
        visible: true,
        activeRowIndex: popupState.activeRowIndex,
        tempItemData: item,
      });
      closePopup(); // Close selection popup
    }
  };

  // C. Save Data from Attribute Panel to Table
  const handleAttributeSave = (attributeData: any) => {
    const { activeRowIndex, tempItemData } = attributePanelState;

    if (activeRowIndex !== null && tempItemData) {
      // 1. Prepare Base Data from API selection
      const baseRowData: RowData = {
        select: tempItemData.code || "",
        desc: tempItemData.name || "",
        unit: tempItemData.stock_unit || "",
        hsn: tempItemData.gst_classfication || "",
        brand: tempItemData.brand || "",
        qty: "1",
        amount: "0.00",
        service: "Main Store", // Default
        barcode: tempItemData.barcode || "",

        // Defaults if user cancels or doesn't change anything in Attribute Panel
        mrp: tempItemData.mrp || "0",
        rate: tempItemData.sales_rate || "0",
        rateper: tempItemData.sales_rate || "0",
        netrate: tempItemData.sales_rate || "0",
        printdesc: tempItemData.name || "",
        itembarcode: tempItemData.barcode || "",
      };

      // 2. Merge with data coming from Attribute Panel
      const finalRowData = { ...baseRowData, ...attributeData };

      // 3. Update Table State
      setTableData((prev) => ({
        ...prev,
        [activeRowIndex]: finalRowData,
      }));
    }
    closeAttributePanel();
  };

  const closeAttributePanel = () => {
    setAttributePanelState({
      visible: false,
      activeRowIndex: null,
      tempItemData: null,
    });
  };

  // --- 5. RESIZING LOGIC ---
  const resizingRef = useRef<number | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>, index: number) => {
    if (!columns[index].resizable) return;
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
    const newWidth = Math.max(30, startWidthRef.current + deltaX);
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

  const getStickyLeft = (index: number): number => {
    if (columns[index].sticky !== "left") return 0;
    let offset = 0;
    for (let i = 0; i < index; i++) {
      if (columns[i].sticky === "left") offset += columns[i].width;
    }
    return offset;
  };

  const totalWidth = columns.reduce((acc, col) => acc + col.width, 0);
  const tableContainerHeight = 36 + 36 + 10 * 24 + 14;

  return (
    <div
      className="flex flex-col h-auto font-sans text-sm overflow-hidden relative z-0"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* HEADER TOOLBAR */}
      <div
        className="flex-none flex justify-between items-center p-2 border-b z-10 relative"
        style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex items-center border h-9 w-72 rounded-sm"
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.borderDark,
            }}
          >
            <div
              className="px-2 border-r h-full flex items-center justify-center"
              style={{
                borderColor: COLORS.borderDark,
                backgroundColor: COLORS.background,
              }}
            >
              <ScanLine style={{ color: COLORS.warning }} className="w-6 h-6" />
            </div>
            <input
              type="text"
              placeholder="Scan"
              className="px-2 outline-none text-sm w-full"
              style={{ color: COLORS.textPrimary }}
            />
          </div>
        </div>
        <button
          className="custom-btn-primary px-6 py-1.5 rounded text-xs font-bold shadow-sm"
          style={{ color: COLORS.white }}
        >
          Pull From Order
        </button>
        <div className="flex items-center gap-3">
          <div
            className="flex rounded text-white h-8 items-center shadow-sm"
            style={{ backgroundColor: COLORS.primary }}
          >
            <button
              className="px-3 border-r h-full flex items-center custom-btn-primary"
              style={{ borderColor: COLORS.primaryHover }}
            >
              <List size={16} />
            </button>
            <button
              className="px-3 border-r h-full flex items-center custom-btn-primary"
              style={{ borderColor: COLORS.primaryHover }}
            >
              <Settings size={16} />
            </button>
            <button className="px-3 h-full flex items-center custom-btn-primary">
              <ExternalLink size={16} />
            </button>
          </div>
          <div className="flex gap-1">
            <button
              className="custom-btn-primary h-8 w-8 flex items-center justify-center rounded shadow-sm"
              style={{ color: COLORS.white }}
            >
              <FileSpreadsheet size={16} />
            </button>
            <button
              className="h-8 w-8 flex items-center justify-center rounded shadow-sm text-lg font-bold transition-colors"
              style={{ backgroundColor: COLORS.success, color: COLORS.white }}
            >
              <DollarSign size={16} />
            </button>
            <button
              className="custom-btn-primary h-8 w-8 flex items-center justify-center rounded shadow-sm"
              style={{ color: COLORS.white }}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TABLE AREA */}
      <div className="flex-1 p-2 relative flex flex-col z-0">
        <div
          className="w-full border shadow-sm relative overflow-hidden"
          style={{
            borderColor: COLORS.borderDark,
            backgroundColor: COLORS.white,
          }}
        >
          <div
            className="w-full overflow-auto custom-scrollbar"
            style={{ height: `${tableContainerHeight}px` }}
          >
            <div style={{ width: `${totalWidth}px` }}>
              <table className="border-collapse table-fixed w-full">
                {/* TABLE HEADER */}
                <thead className="sticky top-0 z-20">
                  <tr className="h-6">
                    {columns.map((col, index) => {
                      const isLeft = col.sticky === "left";
                      const leftOffset = isLeft
                        ? getStickyLeft(index)
                        : undefined;
                      const isSortActive = sortConfig?.key === col.id;
                      return (
                        <th
                          key={col.id}
                          style={{
                            width: `${col.width}px`,
                            left: isLeft ? leftOffset : "auto",
                            top: 0,
                            position: isLeft ? "sticky" : "relative",
                            zIndex: isLeft ? 30 : 20,
                            backgroundColor: COLORS.primary,
                            color: COLORS.white,
                            borderColor: COLORS.primaryHover,
                            cursor: "pointer",
                          }}
                          className="border-r px-1 text-xs font-normal select-none group relative hover:bg-opacity-90"
                          onClick={() => handleHeaderClick(col.id)}
                        >
                          <div
                            className={`flex w-full h-full items-center overflow-hidden ${
                              col.align === "center"
                                ? "justify-center"
                                : "justify-between px-1"
                            }`}
                          >
                            <span
                              title={col.label}
                              style={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                display: "block",
                              }}
                            >
                              {col.label}
                            </span>
                            {isSortActive && (
                              <span className="ml-1">
                                {sortConfig.direction === "asc" ? (
                                  <ArrowUp size={10} />
                                ) : (
                                  <ArrowDown size={10} />
                                )}
                              </span>
                            )}
                          </div>
                          {col.resizable && (
                            <div
                              className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 z-40 opacity-0 group-hover:opacity-100 transition-opacity"
                              onMouseDown={(e) => handleMouseDown(e, index)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody>
                  {sortedRows.map((originalIndex, visualIndex) => {
                    const rowData = tableData[originalIndex] || {};

                    return (
                      <tr
                        key={originalIndex}
                        className="h-6 border-b custom-row-hover"
                        style={{ borderColor: COLORS.border }}
                      >
                        {columns.map((col, cIdx) => {
                          const isLeft = col.sticky === "left";
                          const leftOffset = isLeft
                            ? getStickyLeft(cIdx)
                            : undefined;
                          let content: React.ReactNode = null;

                          // --- ICONS & BUTTONS ---
                          if (col.id === "sno")
                            content = (
                              <span style={{ color: COLORS.textSecondary }}>
                                {visualIndex + 1}
                              </span>
                            );
                          else if (col.id === "add")
                            content = (
                              <Plus
                                size={12}
                                className="mx-auto text-green-600 cursor-pointer"
                              />
                            );
                          else if (col.id === "del")
                            content = (
                              <X
                                size={12}
                                className="mx-auto text-red-500 cursor-pointer"
                              />
                            );
                          else if (col.id === "srch")
                            content = (
                              <Search
                                size={12}
                                className="mx-auto text-blue-500 cursor-pointer"
                              />
                            );
                          else if (col.id === "copy")
                            content = (
                              <Copy
                                size={12}
                                className="mx-auto text-orange-400 cursor-pointer"
                              />
                            );
                          else if (col.id === "attr")
                            content = (
                              <FileText
                                size={12}
                                className="mx-auto text-blue-400"
                              />
                            );
                          else if (col.id === "widg")
                            content = (
                              <BarChart2
                                size={12}
                                className="mx-auto text-blue-400"
                              />
                            );
                          else if (col.id === "batch")
                            content = (
                              <Table
                                size={12}
                                className="mx-auto text-blue-600"
                              />
                            );
                          // --- SELECT POPUP TRIGGER ---
                          else if (col.id === "select") {
                            content = (
                              <div
                                className="text-[10px] italic text-gray-400 flex justify-between cursor-pointer hover:bg-gray-50 h-full items-center px-1"
                                onClick={(e) =>
                                  handleSelectClick(e, originalIndex)
                                }
                              >
                                {rowData.select || "Select..."} <span>▶</span>
                              </div>
                            );
                          }

                          // --- EDITABLE INPUTS ---
                          else if (
                            [
                              "qty",
                              "rateper",
                              "rate",
                              "amount",
                              "mrp",
                              "netrate",
                              "remark",
                              "printdesc",
                              "service",
                              "itembarcode",
                            ].includes(col.id)
                          ) {
                            content = (
                              <input
                                type="text"
                                value={rowData[col.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    originalIndex,
                                    col.id,
                                    e.target.value
                                  )
                                }
                                className="w-full h-full bg-transparent outline-none px-1"
                                style={{
                                  textAlign:
                                    col.align === "right"
                                      ? "right"
                                      : col.align === "center"
                                      ? "center"
                                      : "left",
                                  color: COLORS.textPrimary,
                                }}
                              />
                            );
                          }

                          // --- READ ONLY DATA (Mapped) ---
                          else if (col.id === "desc")
                            content = rowData.desc || "";
                          else if (col.id === "unit")
                            content = rowData.unit || "";
                          else if (col.id === "hsn")
                            content = rowData.hsn || "";
                          else if (col.id === "barcode")
                            content = rowData.barcode || "";
                          else if (col.id === "brand")
                            content = rowData.brand || "";
                          // --- DEFAULT ---
                          else {
                            content = "";
                          }

                          const isReadOnly = !col.resizable && !col.sticky;

                          return (
                            <td
                              key={col.id}
                              style={{
                                width: `${col.width}px`,
                                left: isLeft ? leftOffset : "auto",
                                position: isLeft ? "sticky" : "static",
                                zIndex: isLeft ? 10 : "auto",
                                backgroundColor: isReadOnly
                                  ? "#FAFAFA"
                                  : COLORS.white,
                                borderColor: COLORS.border,
                              }}
                              className={`border-r px-1 text-xs overflow-hidden whitespace-nowrap ${
                                col.align === "center"
                                  ? "text-center"
                                  : col.align === "right"
                                  ? "text-right"
                                  : "text-left"
                              } ${isReadOnly ? "text-gray-500" : ""}`}
                            >
                              {content}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
                {/* FOOTER */}
                <tfoot
                  className="sticky bottom-0 z-20 shadow-[0_-1px_2px_rgba(0,0,0,0.1)]"
                  style={{ backgroundColor: COLORS.background }}
                >
                  <tr
                    className="h-9 font-bold"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {columns.map((col, cIdx) => {
                      const isLeft = col.sticky === "left";
                      const leftOffset = isLeft
                        ? getStickyLeft(cIdx)
                        : undefined;
                      const isTotalCol = [
                        "pqty",
                        "qty",
                        "amount",
                        "mrp",
                        "netrate",
                      ].includes(col.id);
                      return (
                        <td
                          key={col.id}
                          style={{
                            width: `${col.width}px`,
                            left: isLeft ? leftOffset : "auto",
                            position: "sticky",
                            bottom: 0,
                            zIndex: isLeft ? 30 : 20,
                            backgroundColor: COLORS.background,
                            borderColor: COLORS.borderDark,
                          }}
                          className={`border-r px-1 text-xs overflow-hidden whitespace-nowrap border-t-2 ${
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

      {/* --- ATTRIBUTE PANEL (Rendered conditionally) --- */}
      <AttributePanel
        isOpen={attributePanelState.visible}
        onClose={closeAttributePanel}
        onSave={handleAttributeSave}
        initialData={attributePanelState.tempItemData}
      />

      {/* --- ITEM POPUP (Rendered via Portal) --- */}
      {popupState.visible &&
        ReactDOM.createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998] cursor-default bg-transparent"
              onClick={closePopup}
            />
            <div
              className="fixed z-[9999] bg-white border shadow-xl flex flex-col rounded"
              style={{
                top: popupState.top,
                left: popupState.left,
                borderColor: COLORS.borderDark,
                width: "500px",
                maxHeight: "300px",
                transform:
                  popupState.top + 300 > window.innerHeight
                    ? "translateY(-100%)"
                    : "none",
              }}
            >
              <div
                className="flex justify-between items-center p-2 border-b h-8"
                style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
              >
                <span className="font-bold text-xs pl-1">Select Item</span>
                <button
                  onClick={closePopup}
                  className="hover:bg-red-500 hover:text-white p-0.5 rounded transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-0">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="sticky top-0 bg-gray-100 z-10 shadow-sm">
                    <tr>
                      <th className="p-1.5 border font-semibold text-gray-700 w-24">
                        Code
                      </th>
                      <th className="p-1.5 border font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="p-1.5 border font-semibold text-gray-700 w-20">
                        HSN
                      </th>
                      <th className="p-1.5 border font-semibold text-gray-700 w-24">
                        Barcode
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length > 0 ? (
                      items.map((item, idx) => (
                        <tr
                          key={item._id || idx}
                          className="border-b hover:bg-blue-50 cursor-pointer transition-colors"
                          onClick={() => handleItemSelect(item)}
                        >
                          <td className="p-1.5 border">{item.code}</td>
                          <td className="p-1.5 border">{item.name}</td>
                          <td className="p-1.5 border">
                            {item.gst_classfication}
                          </td>
                          <td className="p-1.5 border">{item.barcode}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-4 text-center text-gray-500"
                        >
                          Loading items...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>,
          document.body
        )}

      <style>{`
        .custom-btn-primary { background-color: ${COLORS.primary}; transition: background-color 0.2s; }
        .custom-btn-primary:hover { background-color: ${COLORS.primaryHover}; }
        .custom-row-hover:hover td { background-color: ${COLORS.primaryLight} !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 14px; height: 14px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: ${COLORS.scrollbarTrack}; border: 1px solid ${COLORS.border}; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: ${COLORS.scrollbarThumb}; border-radius: 10px; border: 3px solid ${COLORS.scrollbarTrack}; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: ${COLORS.scrollbarThumbHover}; }
        .custom-scrollbar::-webkit-scrollbar-corner { background: ${COLORS.scrollbarTrack}; }
      `}</style>
    </div>
  );
};

export default OrderTable;
