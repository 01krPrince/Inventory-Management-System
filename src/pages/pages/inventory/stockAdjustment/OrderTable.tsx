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
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Settings,
  Check,
} from "lucide-react";
import { COLORS } from "../../../../constants/colors";

import AddNewItem from "../../../../components/addItemMaster/AddNewItem";

// --- API IMPORTS ---
import { fetchItems } from "../itemMaster/api/itemService";

import { StockUnitData } from "../../../../components/addItemMaster/api/types";
import { fetchStockUnits } from "../../../../components/addItemMaster/api/stockunitservice";
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
  visible: boolean; // New property to toggle visibility
}

interface RowData {
  [key: string]: string | number;
}

// --- PROPS INTERFACE ---
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

  // --- STATE ---
  const [items, setItems] = useState<ItemApiData[]>([]);
  const [, setStockUnits] = useState<StockUnitData[]>([]);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Configuration Modal State
  const [configOpen, setConfigOpen] = useState(false);
  const [configSearch, setConfigSearch] = useState("");

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
  useEffect(() => {
    if (rows.length === 0) {
      const initialRows = Array.from({ length: 15 }, () => generateRowId());
      setRows(initialRows);
      const initialData: Record<string, RowData> = {};
      initialRows.forEach((id) => {
        initialData[id] = { reciss: "Receipt", qty: 0, rate: 0, amount: 0 };
      });
      setTableData(initialData);
    }
  }, [rows.length, setRows, setTableData]);

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

  // --- COLUMN DEFINITIONS (ALL POSSIBLE COLUMNS) ---
  const initialColumns: Column[] = [
    // --- ALWAYS VISIBLE / SYSTEM COLUMNS ---
    {
      id: "sno",
      label: "SNo",
      width: 40,
      sticky: "left",
      align: "center",
      resizable: true,
      visible: true,
    },
    {
      id: "add",
      label: "",
      width: 35,
      sticky: "left",
      align: "center",
      resizable: true,
      visible: true,
    },
    {
      id: "del",
      label: "",
      width: 35,
      sticky: "left",
      align: "center",
      resizable: true,
      visible: true,
    },
    {
      id: "srch",
      label: "",
      width: 35,
      sticky: "left",
      align: "center",
      resizable: true,
      visible: true,
    },
    {
      id: "copy",
      label: "",
      width: 35,
      sticky: "left",
      align: "center",
      resizable: true,
      visible: true,
    },
    {
      id: "reciss",
      label: "Rec Iss",
      width: 80,
      align: "center",
      sticky: "left",
      resizable: true,
      visible: true,
    },
    {
      id: "select",
      label: "Select Item",
      width: 110,
      sticky: "left",
      align: "left",
      resizable: true,
      visible: true,
    },
    {
      id: "desc",
      label: "Item Name",
      width: 180,
      sticky: "left",
      align: "left",
      resizable: true,
      visible: true,
    },
    {
      id: "attr",
      label: "Attribute",
      width: 40,
      align: "center",
      resizable: true,
      visible: true,
    },
    {
      id: "widg",
      label: "Widget",
      width: 40,
      align: "center",
      resizable: true,
      visible: true,
    },
    {
      id: "batch",
      label: "Batch",
      width: 45,
      align: "center",
      resizable: true,
      visible: true,
    },

    // --- DEFAULT REQUESTED COLUMNS (Visible: True) ---
    {
      id: "unit",
      label: "Unit",
      width: 70,
      align: "left",
      resizable: true,
      visible: true,
    },
    {
      id: "qty",
      label: "Quantity",
      width: 80,
      align: "right",
      resizable: true,
      visible: true,
    },
    {
      id: "rate",
      label: "Rate",
      width: 80,
      align: "right",
      resizable: true,
      visible: true,
    },
    {
      id: "amount",
      label: "Amount",
      width: 90,
      align: "right",
      resizable: true,
      visible: true,
    },
    {
      id: "mrp",
      label: "MRP",
      width: 80,
      align: "right",
      resizable: true,
      visible: true,
    },
    {
      id: "remark",
      label: "Remark",
      width: 120,
      align: "left",
      resizable: true,
      visible: true,
    },
    {
      id: "printdesc",
      label: "Description",
      width: 150,
      align: "left",
      resizable: true,
      visible: true,
    },
    {
      id: "barcode",
      label: "Barcode",
      width: 100,
      align: "left",
      resizable: true,
      visible: true,
    },
    {
      id: "hsn",
      label: "HSN Code",
      width: 80,
      align: "left",
      resizable: true,
      visible: true,
    },
    {
      id: "brand",
      label: "Brand",
      width: 100,
      align: "left",
      resizable: true,
      visible: true,
    },

    // --- OPTIONAL / CONFIGURABLE COLUMNS (Visible: False by default) ---
    {
      id: "punit",
      label: "Pack Unit",
      width: 70,
      align: "left",
      resizable: true,
      visible: false,
    },
    {
      id: "pqty",
      label: "Pack Qty",
      width: 70,
      align: "right",
      resizable: true,
      visible: false,
    },
    {
      id: "rateper",
      label: "Rate Per",
      width: 80,
      align: "left",
      resizable: true,
      visible: false,
    },
    {
      id: "minrate",
      label: "Min Rate",
      width: 80,
      align: "right",
      resizable: true,
      visible: false,
    },
    {
      id: "netrate",
      label: "Net Rate",
      width: 80,
      align: "right",
      resizable: true,
      visible: false,
    },
    {
      id: "service",
      label: "Service Loc",
      width: 100,
      align: "center",
      resizable: true,
      visible: false,
    },
    {
      id: "itembarcode",
      label: "Item Barcode",
      width: 100,
      align: "left",
      resizable: true,
      visible: false,
    },
    {
      id: "bdbatchno",
      label: "BD Batch No",
      width: 90,
      align: "left",
      resizable: false,
      visible: false,
    },
    {
      id: "bdexpdate",
      label: "BD Exp.Date",
      width: 90,
      align: "left",
      resizable: false,
      visible: false,
    },
    {
      id: "bdsalerate",
      label: "BD Sale Rate",
      width: 90,
      align: "right",
      resizable: false,
      visible: false,
    },
    {
      id: "itembalance",
      label: "Item Balance",
      width: 80,
      align: "right",
      resizable: false,
      visible: false,
    },
    {
      id: "linelevel",
      label: "Line Lvl Barcode",
      width: 110,
      align: "left",
      resizable: false,
      visible: false,
    },
  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);

  // Derived state for rendering: only show visible columns
  const visibleColumns = useMemo(
    () => columns.filter((c) => c.visible),
    [columns]
  );

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
    setTableData((prev) => {
      const row = prev[rowId] || {};
      const newData = { ...row, [columnId]: value };

      // AUTO CALCULATION LOGIC
      if (columnId === "qty" || columnId === "rate") {
        const qty = parseFloat(
          columnId === "qty" ? value : String(row.qty || 0)
        );
        const rate = parseFloat(
          columnId === "rate" ? value : String(row.rate || 0)
        );

        if (!isNaN(qty) && !isNaN(rate)) {
          newData.amount = (qty * rate).toFixed(2);
        } else {
          newData.amount = "0.00";
        }
      }
      return { ...prev, [rowId]: newData };
    });
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
        [rowIdToDelete]: { reciss: "Receipt", qty: 0, rate: 0, amount: 0 },
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
      setTableData((prev) => ({
        ...prev,
        [newId]: { reciss: "Receipt", qty: 0, rate: 0, amount: 0 },
      }));
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

  // --- CONFIG HANDLERS ---
  const toggleColumnVisibility = (colId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  // --- POPUP HANDLERS ---
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
        reciss: "Receipt",
        select: tempItemData.code || "",
        desc: tempItemData.name || "",
        unit: tempItemData.stock_unit || "",
        hsn: tempItemData.gst_classfication || "",
        brand: tempItemData.brand || "",
        qty: "1",
        mrp: tempItemData.mrp || "0",
        rate: tempItemData.sales_rate || "0",
        barcode: tempItemData.barcode || "",
        printdesc: tempItemData.name || "",
      };

      const qty = 1;
      const rate = parseFloat(String(tempItemData.sales_rate || 0));
      baseData.amount = (qty * rate).toFixed(2);

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

  // --- RESIZING & SORTING ---
  const resizingRef = useRef<number | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleHeaderClick = (columnId: string) => {
    if (
      [
        "sno",
        "add",
        "del",
        "srch",
        "copy",
        "attr",
        "widg",
        "batch",
        "reciss",
      ].includes(columnId)
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
    if (!visibleColumns[index].resizable) return;
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = index;
    startXRef.current = e.clientX;
    startWidthRef.current = visibleColumns[index].width;
    document.addEventListener("mousemove", handleMouseMove as any);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent) => {
    if (resizingRef.current === null) return;
    // We need to find the actual ID in the master list because we are dragging via visible index
    const colId = visibleColumns[resizingRef.current!].id;

    setColumns((prev) => {
      return prev.map((col) => {
        if (col.id === colId) {
          return {
            ...col,
            width: Math.max(
              30,
              startWidthRef.current + (e.clientX - startXRef.current)
            ),
          };
        }
        return col;
      });
    });
  };

  const handleMouseUp = () => {
    resizingRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove as any);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Important: Calculate sticky left based on VISIBLE columns only
  const getStickyLeft = (idx: number) =>
    visibleColumns
      .slice(0, idx)
      .reduce((acc, col) => (col.sticky === "left" ? acc + col.width : acc), 0);

  const totals = useMemo(() => {
    const sums: Record<string, number> = { qty: 0, amount: 0, mrp: 0 };
    rows.forEach((rowId) => {
      const row = tableData[rowId];
      if (row) {
        const addVal = (field: string) => {
          const val = parseFloat(String(row[field] || "0"));
          if (!isNaN(val)) sums[field] += val;
        };
        addVal("qty");
        addVal("amount");
        addVal("mrp");
      }
    });
    return {
      qty: sums.qty.toFixed(2),
      amount: sums.amount.toFixed(2),
      mrp: sums.mrp.toFixed(2),
    };
  }, [rows, tableData]);

  if (addNewItemForm) {
    return (
      <div className="w-full">
        <div className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Form Header... */}
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

        <div className="flex items-center gap-2">
          {/* CONFIGURATION BUTTON */}
          <button
            onClick={() => setConfigOpen(true)}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600 border border-transparent hover:border-gray-300 transition-all"
            title="Configure Table Columns"
          >
            <Settings size={18} />
          </button>

          <button
            className="px-6 py-1.5 rounded text-xs font-bold text-white shadow-sm"
            style={{ backgroundColor: COLORS.primary }}
          >
            Pull From Order
          </button>
        </div>
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
            <div
              style={{ width: visibleColumns.reduce((a, c) => a + c.width, 0) }}
            >
              <table className="border-collapse table-fixed w-full">
                <thead className="sticky top-0 z-20">
                  <tr className="h-6">
                    {visibleColumns.map((col, idx) => (
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
                        {visibleColumns.map((col, cIdx) => {
                          const isLeft = col.sticky === "left";
                          let content: React.ReactNode = null;

                          // --- RENDER LOGIC SWITCH ---
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
                          else if (col.id === "reciss") {
                            content = (
                              <div className="relative w-full h-full group">
                                <div className="flex justify-between items-center h-full px-1 text-[10px]">
                                  <span
                                    style={{
                                      color:
                                        rowData.reciss === "Issue"
                                          ? "red"
                                          : "inherit",
                                    }}
                                  >
                                    {rowData.reciss || "Receipt"}
                                  </span>
                                  <ChevronDown
                                    size={10}
                                    className="text-gray-400"
                                  />
                                </div>
                                <select
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  value={rowData.reciss || "Receipt"}
                                  onChange={(e) =>
                                    handleInputChange(
                                      rowId,
                                      "reciss",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="Receipt">Receipt</option>
                                  <option value="Issue">Issue</option>
                                </select>
                              </div>
                            );
                          } else if (col.id === "select") {
                            content = (
                              <div
                                className="text-[10px] italic text-gray-400 flex justify-between cursor-pointer hover:bg-gray-100 h-full items-center px-1"
                                onClick={(e) => handleSelectClick(e, rowId)}
                              >
                                {rowData.select || "Select..."} <span>▶</span>
                              </div>
                            );
                          } else if (col.id === "amount") {
                            content = (
                              <div className="w-full h-full flex items-center justify-end px-1 bg-gray-50 text-gray-700 font-medium">
                                {rowData[col.id] || "0.00"}
                              </div>
                            );
                          } else if (
                            [
                              "qty",
                              "rate",
                              "mrp",
                              "pqty",
                              "minrate",
                              "netrate",
                              "bdsalerate",
                            ].includes(col.id)
                          ) {
                            // Numeric Inputs
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
                          } else {
                            // Text Inputs
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
                    {visibleColumns.map((col, idx) => {
                      let content: React.ReactNode = "";
                      if (col.id === "desc") content = "TOTAL";
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

      {/* --- CONFIGURATION POPUP (PORTAL + BRAND COLORS) --- */}
      {configOpen &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Click outside to close */}
            <div
              className="absolute inset-0"
              onClick={() => setConfigOpen(false)}
            />

            <div
              className="relative rounded-2xl shadow-2xl w-full max-w-sm flex flex-col border overflow-hidden transform transition-all scale-100"
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.border,
                maxHeight: "80vh",
              }}
            >
              {/* Modal Header */}
              <div
                className="flex justify-between items-center px-5 py-4 border-b"
                style={{
                  backgroundColor: COLORS.white,
                  borderColor: COLORS.border,
                }}
              >
                <div>
                  <h3
                    className="font-bold text-lg flex items-center gap-2"
                    style={{ color: COLORS.textPrimary }}
                  >
                    <Settings size={18} style={{ color: COLORS.primary }} />
                    Table Columns
                  </h3>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: COLORS.textMuted }}
                  >
                    Toggle columns to show or hide
                  </p>
                </div>
                <button
                  onClick={() => setConfigOpen(false)}
                  className="p-2 rounded-full transition-colors hover:bg-gray-100"
                  style={{ color: COLORS.textMuted }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = COLORS.danger)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = COLORS.textMuted)
                  }
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Area */}
              <div
                className="px-5 py-3 border-b"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.border,
                }}
              >
                <div className="relative group">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: COLORS.textMuted }}
                  />
                  <input
                    type="text"
                    placeholder="Find a column..."
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm outline-none transition-all shadow-sm focus:ring-1"
                    style={{
                      backgroundColor: COLORS.white,
                      borderColor: COLORS.borderDark,
                      color: COLORS.textPrimary,
                    }}
                    value={configSearch}
                    onChange={(e) => setConfigSearch(e.target.value)}
                    // Add simple focus logic via CSS or inline override
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.primary;
                      e.target.style.boxShadow = `0 0 0 1px ${COLORS.primary}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.borderDark;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Column List */}
              <div
                className="overflow-y-auto flex-1 p-3 custom-scrollbar"
                style={{ backgroundColor: COLORS.white }}
              >
                <div className="flex flex-col gap-1">
                  {columns
                    .filter(
                      (c) =>
                        !["sno", "add", "del", "srch", "copy"].includes(c.id)
                    )
                    .filter((c) =>
                      c.label.toLowerCase().includes(configSearch.toLowerCase())
                    )
                    .map((col) => (
                      <div
                        key={col.id}
                        onClick={() => toggleColumnVisibility(col.id)}
                        className="flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all duration-200 group"
                        style={{
                          backgroundColor: col.visible
                            ? COLORS.primaryLight
                            : COLORS.white,
                          borderColor: col.visible
                            ? "transparent" // or COLORS.primary if you want a border
                            : "transparent",
                        }}
                        // Hover effect override
                        onMouseEnter={(e) => {
                          if (!col.visible)
                            e.currentTarget.style.backgroundColor =
                              COLORS.background;
                        }}
                        onMouseLeave={(e) => {
                          if (!col.visible)
                            e.currentTarget.style.backgroundColor =
                              COLORS.white;
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {/* Custom Checkbox Design */}
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 shadow-sm"
                            style={{
                              backgroundColor: col.visible
                                ? COLORS.primary
                                : COLORS.white,
                              borderColor: col.visible
                                ? COLORS.primary
                                : COLORS.borderDark,
                            }}
                          >
                            <Check
                              size={12}
                              className={`transition-transform duration-200 ${
                                col.visible ? "scale-100" : "scale-0"
                              }`}
                              style={{ color: COLORS.white }}
                              strokeWidth={3}
                            />
                          </div>
                          <span
                            className="text-sm font-medium transition-colors"
                            style={{
                              color: col.visible
                                ? COLORS.primary
                                : COLORS.textSecondary,
                            }}
                          >
                            {col.label}
                          </span>
                        </div>

                        {/* Sticky Indicator */}
                        {col.sticky && (
                          <span
                            className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: COLORS.white,
                              color: COLORS.primary,
                              border: `1px solid ${COLORS.primary}40`, // 40 is opacity
                            }}
                          >
                            Fixed
                          </span>
                        )}
                      </div>
                    ))}

                  {/* Empty State */}
                  {columns.filter(
                    (c) =>
                      c.label
                        .toLowerCase()
                        .includes(configSearch.toLowerCase()) &&
                      !["sno", "add"].includes(c.id)
                  ).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 opacity-50">
                      <Search
                        size={32}
                        className="mb-2"
                        style={{ color: COLORS.textMuted }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: COLORS.textMuted }}
                      >
                        No columns found matching "{configSearch}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer: Reset Button */}
              <div
                className="p-3 border-t flex justify-end"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.border,
                }}
              >
                <button
                  onClick={() => setColumns(initialColumns)}
                  className="text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                  style={{ color: COLORS.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.neutralHover;
                    e.currentTarget.style.color = COLORS.textPrimary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = COLORS.textSecondary;
                  }}
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      <AttributePanel
        isOpen={attributePanelState.visible}
        onClose={() =>
          setAttributePanelState({ ...attributePanelState, visible: false })
        }
        onSave={handleAttributeSave}
        initialData={attributePanelState.tempItemData}
      />

      {/* --- ITEM POPUP --- */}
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
