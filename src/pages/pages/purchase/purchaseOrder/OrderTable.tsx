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
  Table,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
} from "lucide-react";
import { COLORS } from "../../../../constants/colors";

import AddNewItem from "../../../../components/addItemMaster/AddNewItem";

// --- API IMPORTS ---
import { fetchItems } from "../../inventory/itemMaster/api/itemService";

import { StockUnitData } from "../../../../components/addItemMaster/api/types";
import { fetchStockUnits } from "../../../../components/addItemMaster/api/stockunitservice";
import { ItemApiData } from "../../inventory/itemMaster/models/ItemModel";
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

interface RowData {
  [key: string]: string | number;
}

// --- PROPS INTERFACE FOR LIFTED STATE ---
interface OrderTableProps {
  rows: string[];
  setRows: React.Dispatch<React.SetStateAction<string[]>>;
  tableData: Record<string, RowData>;
  setTableData: React.Dispatch<React.SetStateAction<Record<string, RowData>>>;
}

const OrderTable: React.FC<OrderTableProps> = ({
  rows,
  setRows,
  tableData,
  setTableData,
}) => {
  // --- UTILS ---
  const generateRowId = () =>
    `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // --- STATE (Local UI State only) ---
  const [items, setItems] = useState<ItemApiData[]>([]);
  const [, setStockUnits] = useState<StockUnitData[]>([]);
  // tableData and rows are now Props
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Popups State
  const [popupState, setPopupState] = useState<{
    visible: boolean;
    top: number;
    left: number;
    activeRowId: string | null;
  }>({ visible: false, top: 0, left: 0, activeRowId: null });

  const [attributePanelState, setAttributePanelState] = useState<{
    visible: boolean;
    activeRowId: string | null;
    tempItemData: ItemApiData | null;
  }>({ visible: false, activeRowId: null, tempItemData: null });

  const [addNewItemForm, setAddNewItemForm] = useState(false);

  // --- INITIALIZATION ---

  // 1. Row Initialization Effect: Runs on mount AND when rows are cleared (length becomes 0)
  useEffect(() => {
    if (rows.length === 0) {
      const initialRows = Array.from({ length: 15 }, () => generateRowId());
      setRows(initialRows);

      const initialData: Record<string, RowData> = {};
      initialRows.forEach((id) => {
        initialData[id] = {};
      });
      setTableData(initialData);
    }
    // Dependency on rows.length ensures this runs when parent resets state
  }, [rows.length, setRows, setTableData]);

  // 2. Data Loading Effect: Runs ONLY once on mount
  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    try {
      const itemsData = await fetchItems();
      if (Array.isArray(itemsData)) setItems(itemsData);

      const unitsData = await fetchStockUnits();
      if (Array.isArray(unitsData)) setStockUnits(unitsData);
    } catch (error) {
      console.error("Failed to load table master data", error);
    }
  };

  // --- COLUMN CONFIG ---
  const initialColumns: Column[] = [
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
    { id: "unit", label: "Unit", width: 70, align: "left", resizable: true },
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
      width: 80,
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

  // --- HANDLERS ---
  const handleCreateItemClick = () => {
    setPopupState((prev) => ({ ...prev, visible: false }));
    setAddNewItemForm(true);
  };

  const handleCloseForm = () => {
    setAddNewItemForm(false);
  };

  const handleFormSuccess = async () => {
    await loadMasterData();
    setAddNewItemForm(false);
  };

  const handleInputChange = (
    rowId: string,
    columnId: string,
    value: string
  ) => {
    setTableData((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [columnId]: value },
    }));
  };

  const handleDeleteRow = (rowIdToDelete: string) => {
    if (rows.length > 15) {
      setRows((prev) => prev.filter((id) => id !== rowIdToDelete));
      setTableData((prev) => {
        const next = { ...prev };
        delete next[rowIdToDelete];
        return next;
      });
    } else {
      setTableData((prev) => ({
        ...prev,
        [rowIdToDelete]: {},
      }));
    }
  };

  const handleAddRow = (afterRowId: string) => {
    const newId = generateRowId();
    const index = rows.indexOf(afterRowId);
    if (index !== -1) {
      const newRows = [...rows];
      newRows.splice(index + 1, 0, newId);
      setRows(newRows);
    }
  };

  const handleCopyRow = (sourceRowId: string) => {
    const sourceData = tableData[sourceRowId];
    if (!sourceData) return;
    let targetRowId: string | null = null;
    const sourceIndex = rows.indexOf(sourceRowId);
    for (let i = sourceIndex + 1; i < rows.length; i++) {
      const rId = rows[i];
      if (!tableData[rId]?.select) {
        targetRowId = rId;
        break;
      }
    }
    if (!targetRowId) {
      targetRowId = generateRowId();
      setRows((prev) => [...prev, targetRowId!]);
    }
    setTableData((prev) => ({ ...prev, [targetRowId!]: { ...sourceData } }));
  };

  // --- POPUP TRIGGERS ---
  const handleSelectClick = (
    e: React.MouseEvent<HTMLDivElement>,
    rowId: string
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupState({
      visible: true,
      top: rect.bottom,
      left: rect.left,
      activeRowId: rowId,
    });
  };

  const closePopup = () => {
    setPopupState((prev) => ({ ...prev, visible: false, activeRowId: null }));
  };

  const handleAttributeClick = (rowId: string) => {
    const data = tableData[rowId];
    if (data && data.select) {
      const reconstructedItem: any = {
        code: data.select,
        name: data.desc,
        stock_unit: data.unit,
        gst_classfication: data.hsn,
        brand: data.brand,
        sales_rate: data.rate,
        mrp: data.mrp,
        barcode: data.barcode,
      };
      setAttributePanelState({
        visible: true,
        activeRowId: rowId,
        tempItemData: reconstructedItem,
      });
    }
  };

  // --- SELECTION HANDLERS ---
  const handleItemSelect = (item: ItemApiData) => {
    if (popupState.activeRowId) {
      setAttributePanelState({
        visible: true,
        activeRowId: popupState.activeRowId,
        tempItemData: item,
      });
      setPopupState((prev) => ({ ...prev, visible: false, activeRowId: null }));
    }
  };

  const handleAttributeSave = (attributeData: any) => {
    const { activeRowId, tempItemData } = attributePanelState;
    if (activeRowId && tempItemData) {
      const baseData: RowData = {
        select: tempItemData.code || "",
        desc: tempItemData.name || "",
        unit: tempItemData.stock_unit || "",
        hsn: tempItemData.gst_classfication || "",
        brand: tempItemData.brand || "",
        qty: "1",
        amount: "0.00",
        service: "Main Store",
        barcode: tempItemData.barcode || "",
        mrp: tempItemData.mrp || "0",
        rate: tempItemData.sales_rate || "0",
        rateper: tempItemData.sales_rate || "0",
        netrate: tempItemData.sales_rate || "0",
        printdesc: tempItemData.name || "",
        itembarcode: tempItemData.barcode || "",
      };
      setTableData((prev) => ({
        ...prev,
        [activeRowId]: { ...prev[activeRowId], ...baseData, ...attributeData },
      }));
    }
    setAttributePanelState({
      visible: false,
      activeRowId: null,
      tempItemData: null,
    });
  };

  // --- RESIZING & SORTING (Defined via Hooks - MUST be before early return) ---
  const resizingRef = useRef<number | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleHeaderClick = (columnId: string) => {
    if (
      ["sno", "add", "del", "srch", "copy", "attr", "widg", "batch"].includes(
        columnId
      )
    )
      return;
    setSortConfig((curr) => ({
      key: columnId,
      direction:
        curr?.key === columnId && curr.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedRowIds = useMemo(() => {
    let sortable = [...rows];
    if (sortConfig) {
      sortable.sort((a, b) => {
        const rowA = tableData[a],
          rowB = tableData[b];
        if (!rowA && !rowB) return 0;
        if (!rowA) return 1;
        if (!rowB) return -1;
        const valA = rowA[sortConfig.key] || "",
          valB = rowB[sortConfig.key] || "";
        return typeof valA === "string" && typeof valB === "string"
          ? sortConfig.direction === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA)
          : sortConfig.direction === "asc"
          ? valA < valB
            ? -1
            : 1
          : valA > valB
          ? -1
          : 1;
      });
    }
    return sortable;
  }, [rows, tableData, sortConfig]);

  const handleMouseDown = (e: MouseEvent, index: number) => {
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
    setColumns((prev) => {
      const next = [...prev];
      next[resizingRef.current!] = {
        ...next[resizingRef.current!],
        width: Math.max(
          30,
          startWidthRef.current + (e.clientX - startXRef.current)
        ),
      };
      return next;
    });
  };
  const handleMouseUp = () => {
    resizingRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove as any);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  const getStickyLeft = (idx: number) =>
    columns
      .slice(0, idx)
      .reduce((acc, col) => (col.sticky === "left" ? acc + col.width : acc), 0);

  // --- CALCULATION LOGIC (Hook - MUST be before early return) ---
  const totals = useMemo(() => {
    const sums: Record<string, number> = {
      pqty: 0,
      qty: 0,
      amount: 0,
      mrp: 0,
      netrate: 0,
    };
    rows.forEach((rowId) => {
      const row = tableData[rowId];
      if (row) {
        const addVal = (field: string) => {
          const val = parseFloat(String(row[field] || "0"));
          if (!isNaN(val)) sums[field] += val;
        };
        addVal("pqty");
        addVal("qty");
        addVal("amount");
        addVal("mrp");
        addVal("netrate");
      }
    });
    return {
      pqty: sums.pqty.toFixed(2),
      qty: sums.qty.toFixed(2),
      amount: sums.amount.toFixed(2),
      mrp: sums.mrp.toFixed(2),
      netrate: sums.netrate.toFixed(2),
    };
  }, [rows, tableData]);

  // --- CONDITIONAL RENDER (Moved to BOTTOM to prevent Hook Error) ---
  if (addNewItemForm) {
    return (
      <div className="w-full">
        <div className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <button
              onClick={handleCloseForm}
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Item Master
            </button>
          </div>
          <AddNewItem
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
            initialData={undefined}
          />
        </div>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div
      className="flex flex-col h-auto font-sans text-sm overflow-hidden relative z-0"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* HEADER */}
      <div
        className="flex-none flex justify-between items-center p-2 border-b z-10 relative bg-white"
        style={{ borderColor: COLORS.border }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex items-center border h-9 w-72 rounded-sm bg-white"
            style={{ borderColor: COLORS.borderDark }}
          >
            <div className="px-2 border-r h-full flex items-center justify-center bg-gray-50">
              <ScanLine className="w-6 h-6 text-orange-500" />
            </div>
            <input
              type="text"
              placeholder="Scan"
              className="px-2 outline-none text-sm w-full"
            />
          </div>
        </div>
        <button
          className="px-6 py-1.5 rounded text-xs font-bold text-white shadow-sm"
          style={{ backgroundColor: COLORS.primary }}
        >
          Pull From Order
        </button>
      </div>

      {/* TABLE */}
      <div className="flex-1 p-2 relative flex flex-col z-0">
        <div
          className="w-full border shadow-sm relative overflow-hidden bg-white"
          style={{ borderColor: COLORS.borderDark }}
        >
          <div
            className="w-full overflow-auto custom-scrollbar"
            style={{ height: "400px" }}
          >
            <div style={{ width: columns.reduce((a, c) => a + c.width, 0) }}>
              <table className="border-collapse table-fixed w-full">
                <thead className="sticky top-0 z-20">
                  <tr className="h-6">
                    {columns.map((col, idx) => (
                      <th
                        key={col.id}
                        style={{
                          width: col.width,
                          left:
                            col.sticky === "left"
                              ? getStickyLeft(idx)
                              : undefined,
                          position:
                            col.sticky === "left" ? "sticky" : "relative",
                          zIndex: col.sticky === "left" ? 30 : 20,
                          backgroundColor: COLORS.primary,
                          color: "white",
                          borderColor: COLORS.primaryHover,
                        }}
                        className="border-r px-1 text-xs font-normal cursor-pointer relative group"
                        onClick={() => handleHeaderClick(col.id)}
                      >
                        <div
                          className={`flex w-full h-full items-center ${
                            col.align === "center"
                              ? "justify-center"
                              : "justify-between px-1"
                          }`}
                        >
                          <span className="truncate">{col.label}</span>
                          {sortConfig?.key === col.id &&
                            (sortConfig.direction === "asc" ? (
                              <ArrowUp size={10} />
                            ) : (
                              <ArrowDown size={10} />
                            ))}
                        </div>
                        {col.resizable && (
                          <div
                            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100"
                            onMouseDown={(e) => handleMouseDown(e, idx)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedRowIds.map((rowId, vIdx) => {
                    const rowData = tableData[rowId] || {};
                    return (
                      <tr
                        key={rowId}
                        className="h-6 border-b hover:bg-blue-50"
                        style={{ borderColor: COLORS.border }}
                      >
                        {columns.map((col, cIdx) => {
                          const isLeft = col.sticky === "left";
                          let content: React.ReactNode = null;

                          if (col.id === "sno")
                            content = (
                              <span className="text-gray-500">{vIdx + 1}</span>
                            );
                          else if (col.id === "add")
                            content = (
                              <Plus
                                size={12}
                                className="mx-auto text-green-600 cursor-pointer"
                                onClick={() => handleAddRow(rowId)}
                              />
                            );
                          else if (col.id === "del")
                            content = (
                              <X
                                size={12}
                                className="mx-auto text-red-500 cursor-pointer"
                                onClick={() => handleDeleteRow(rowId)}
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
                                onClick={() => handleCopyRow(rowId)}
                              />
                            );
                          else if (col.id === "attr")
                            content = (
                              <FileText
                                size={12}
                                className="mx-auto text-blue-400 cursor-pointer"
                                onClick={() => handleAttributeClick(rowId)}
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
                          else if (col.id === "select") {
                            content = (
                              <div
                                className="text-[10px] italic text-gray-400 flex justify-between cursor-pointer hover:bg-gray-100 h-full items-center px-1"
                                onClick={(e) => handleSelectClick(e, rowId)}
                              >
                                {rowData.select || "Select..."} <span>▶</span>
                              </div>
                            );
                          } else if (
                            col.id === "unit" ||
                            col.id === "rateper"
                          ) {
                            content = (
                              <div className="w-full h-full flex justify-between items-center px-1 cursor-pointer hover:bg-gray-100 group min-h-[24px]">
                                <span>{rowData[col.id] || ""}</span>
                              </div>
                            );
                          } else if (
                            ["qty", "rate", "amount", "mrp"].includes(col.id)
                          ) {
                            // --- EDITABLE INPUTS ---
                            content = (
                              <input
                                type="text"
                                className="w-full h-full bg-transparent outline-none px-1 text-right"
                                value={rowData[col.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    rowId,
                                    col.id,
                                    e.target.value
                                  )
                                }
                              />
                            );
                          } else if (
                            [
                              "desc",
                              "hsn",
                              "barcode",
                              "brand",
                              "punit",
                              "pqty",
                              "minrate",
                              "netrate",
                            ].includes(col.id)
                          ) {
                            // --- READ ONLY TEXT ---
                            content = rowData[col.id] || "";
                          } else {
                            // --- DEFAULT INPUT ---
                            content = (
                              <input
                                type="text"
                                className="w-full h-full bg-transparent outline-none px-1"
                                value={rowData[col.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    rowId,
                                    col.id,
                                    e.target.value
                                  )
                                }
                              />
                            );
                          }

                          const isReadOnly = !col.resizable && !col.sticky;
                          return (
                            <td
                              key={col.id}
                              style={{
                                width: col.width,
                                left: isLeft ? getStickyLeft(cIdx) : undefined,
                                position: isLeft ? "sticky" : "static",
                                zIndex: isLeft ? 10 : "auto",
                                backgroundColor: isReadOnly
                                  ? "#FAFAFA"
                                  : "white",
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
                <tfoot className="sticky bottom-0 z-20 bg-gray-50">
                  <tr className="h-9 font-bold">
                    {columns.map((col, idx) => {
                      let content: React.ReactNode = "";
                      if (col.id === "desc") content = "TOTAL";
                      else if (col.id === "pqty") content = totals.pqty;
                      else if (col.id === "qty") content = totals.qty;
                      else if (col.id === "amount") content = totals.amount;

                      return (
                        <td
                          key={col.id}
                          style={{
                            left:
                              col.sticky === "left"
                                ? getStickyLeft(idx)
                                : undefined,
                            position:
                              col.sticky === "left" ? "sticky" : "static",
                            zIndex: col.sticky === "left" ? 30 : 20,
                            backgroundColor: COLORS.background,
                          }}
                          className="border-r border-t-2 px-1 text-xs text-right"
                        >
                          {content}
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

      <AttributePanel
        isOpen={attributePanelState.visible}
        onClose={() =>
          setAttributePanelState({ ...attributePanelState, visible: false })
        }
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
              {/* HEADER WITH + ICON */}
              <div
                className="flex justify-between items-center p-2 border-b h-8"
                style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
              >
                <span className="font-bold text-xs pl-1">Select Item</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCreateItemClick}
                    className="hover:bg-green-600 hover:text-white p-0.5 rounded transition-colors"
                    title="Create New Item"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={closePopup}
                    className="hover:bg-red-500 hover:text-white p-0.5 rounded transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: ${COLORS.scrollbarThumb}; border: 3px solid transparent; background-clip: content-box; border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: ${COLORS.scrollbarTrack}; }
      `}</style>
    </div>
  );
};

export default OrderTable;
