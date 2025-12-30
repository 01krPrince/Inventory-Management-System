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
  ShieldCheck,
  Clock,
  DollarSign,
  RotateCcw,
} from "lucide-react";
import { COLORS } from "../../../../constants/colors";

import AddNewItem from "../../../../components/addItemMaster/AddNewItem";

import { fetchItems } from "../../inventory/itemMaster/api/itemService";
import { StockUnitData } from "../../../../components/addItemMaster/api/types";
import { fetchStockUnits } from "../../../../components/addItemMaster/api/stockunitservice";
import { ItemApiData } from "../../inventory/itemMaster/models/ItemModel";
import AttributePanel from "../../../../components/AttributePanel";
import PullFromOrderModal from "../../../../components/PullFromOrderModal";

interface Column {
  id: string;
  label: string;
  width: number;
  align: "left" | "center" | "right";
  sticky?: "left";
  resizable?: boolean;
  visible: boolean;
}

interface RowData {
  [key: string]: string | number;
}

interface WarrantyOption {
  id: string;
  label: string;
  price: number;
}

const getStandardWarranties = (itemText: string): WarrantyOption[] => {
  if (!itemText) return [];
  const text = String(itemText).toLowerCase();

  if (text.includes("bat") || text.includes("elec") || text.startsWith("1")) {
    return [
      { id: "w1", label: "6 Months", price: 0 },
      { id: "w2", label: "1 Year", price: 500 },
      { id: "w3", label: "2 Years", price: 1200 },
    ];
  }
  if (text.includes("pad") || text.includes("glove")) {
    return [{ id: "w4", label: "3 Months Repair", price: 0 }];
  }
  return [];
};

interface OrderTableProps {
  rows: string[];
  setRows: React.Dispatch<React.SetStateAction<string[]>>;
  tableData: Record<string, RowData>;
  setTableData: React.Dispatch<React.SetStateAction<Record<string, RowData>>>;
}

const DEFAULT_COLUMNS: Column[] = [
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
    id: "warranty",
    label: "Warranty",
    width: 110,
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
    id: "manual_rate",
    label: "Manual Rate",
    width: 120,
    align: "left",
    resizable: true,
    visible: true,
  },
  {
    id: "tacCode",
    label: "Tax Code",
    width: 120,
    align: "left",
    resizable: true,
    visible: true,
  },
  {
    id: "taxRate",
    label: "Tax Rate",
    width: 120,
    align: "left",
    resizable: true,
    visible: true,
  },
  {
    id: "netRate",
    label: "Net Rate",
    width: 120,
    align: "left",
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

const OrderTable: React.FC<OrderTableProps> = ({
  rows,
  setRows,
  tableData,
  setTableData,
}) => {
  const generateRowId = () =>
    `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const [items, setItems] = useState<ItemApiData[]>([]);
  const [, setStockUnits] = useState<StockUnitData[]>([]);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [configOpen, setConfigOpen] = useState(false);
  const [configSearch, setConfigSearch] = useState("");

  const [popupState, setPopupState] = useState<{
    visible: boolean;
    top: number;
    left: number;
    activeRowId: string | null;
  }>({ visible: false, top: 0, left: 0, activeRowId: null });

  const [warrantyPopup, setWarrantyPopup] = useState<{
    visible: boolean;
    top: number;
    left: number;
    activeRowId: string | null;
    options: WarrantyOption[];
  }>({ visible: false, top: 0, left: 0, activeRowId: null, options: [] });

  const [newWarranty, setNewWarranty] = useState({ duration: "", price: "" });

  const [attributePanelState, setAttributePanelState] = useState<{
    visible: boolean;
    activeRowId: string | null;
    tempItemData: ItemApiData | null;
  }>({ visible: false, activeRowId: null, tempItemData: null });

  const [addNewItemForm, setAddNewItemForm] = useState(false);

  useEffect(() => {
    if (rows.length === 0) {
      const initialRows = Array.from({ length: 15 }, () => generateRowId());
      setRows(initialRows);
      const initialData: Record<string, RowData> = {};
      initialRows.forEach((id) => {
        initialData[id] = {
          reciss: "Receipt",
          qty: 0,
          rate: 0,
          amount: 0,
          warranty: "",
        };
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

  const [columns, setColumns] = useState<Column[]>(
    JSON.parse(JSON.stringify(DEFAULT_COLUMNS))
  );

  const [isPullModalOpen, setIsPullModalOpen] = useState<boolean>(false);

  const visibleColumns = useMemo(
    () => columns.filter((c) => c.visible),
    [columns]
  );

  const handleResetDefault = () => {
    setColumns(JSON.parse(JSON.stringify(DEFAULT_COLUMNS)));
    setConfigSearch("");
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
        [rowIdToDelete]: {
          reciss: "Receipt",
          qty: 0,
          rate: 0,
          amount: 0,
          warranty: "",
        },
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
        [newId]: {
          reciss: "Receipt",
          qty: 0,
          rate: 0,
          amount: 0,
          warranty: "",
        },
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

  // --- POPUP HANDLERS (Select Item) ---
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

  // --- WARRANTY POPUP HANDLERS ---
  const handleWarrantyClick = (
    e: React.MouseEvent<HTMLDivElement>,
    rowId: string
  ) => {
    e.stopPropagation();
    const rowData = tableData[rowId];
    const options = getStandardWarranties(String(rowData?.select || ""));
    const rect = e.currentTarget.getBoundingClientRect();

    setWarrantyPopup({
      visible: true,
      top: rect.bottom,
      left: rect.left,
      activeRowId: rowId,
      options: options,
    });
    setNewWarranty({ duration: "", price: "" });
  };

  const closeWarrantyPopup = () => {
    setWarrantyPopup((prev) => ({
      ...prev,
      visible: false,
      activeRowId: null,
    }));
  };

  const handleWarrantySelect = (w: WarrantyOption) => {
    if (warrantyPopup.activeRowId) {
      const displayString = w.price > 0 ? `${w.label} (+₹${w.price})` : w.label;
      handleInputChange(warrantyPopup.activeRowId, "warranty", displayString);
      closeWarrantyPopup();
    }
  };

  const handleAddCustomWarranty = () => {
    if (!newWarranty.duration) return;
    if (warrantyPopup.activeRowId) {
      const price = parseFloat(newWarranty.price) || 0;
      const label = newWarranty.duration;
      const displayString = price > 0 ? `${label} (+₹${price})` : label;
      handleInputChange(warrantyPopup.activeRowId, "warranty", displayString);
      closeWarrantyPopup();
    }
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
        "warranty",
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

  const toggleColumnVisibility = (colId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId ? { ...col, visible: !col.visible } : col
      )
    );
  };

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
          <AddNewItem
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
            initialData={undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-auto font-sans text-sm overflow-hidden relative z-0"
      style={{ backgroundColor: COLORS.background }}
    >
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
          <button
            onClick={() => setConfigOpen(true)}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600 border border-transparent hover:border-gray-300 transition-all"
            title="Configure Table Columns"
          >
            <Settings size={18} />
          </button>

          <button
            className="px-6 py-1.5 rounded text-xs font-bold text-white shadow-sm flex items-center gap-2"
            style={{ backgroundColor: COLORS.primary }}
            onClick={() => setIsPullModalOpen(true)}
          >
            <BarChart2 size={14} />
            Analyze & Import
          </button>

          {isPullModalOpen &&
            ReactDOM.createPortal(
              <PullFromOrderModal
                isOpen={isPullModalOpen}
                onClose={() => setIsPullModalOpen(false)}
              />,
              document.body
            )}
        </div>
      </div>

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
                          } else if (col.id === "warranty") {
                            const displayValue = rowData.warranty || "Select";
                            const hasSelection = !!rowData.warranty;
                            content = (
                              <div
                                className="w-full h-full px-1 flex items-center justify-between cursor-pointer hover:bg-gray-100 text-[10px] text-gray-700"
                                onClick={(e) => handleWarrantyClick(e, rowId)}
                              >
                                <span
                                  className={
                                    hasSelection
                                      ? "text-blue-700 font-medium truncate"
                                      : "text-gray-400 italic truncate"
                                  }
                                >
                                  {displayValue}
                                </span>
                                <ChevronDown
                                  size={10}
                                  className="text-gray-400"
                                />
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

                          const isReadOnly =
                            !col.resizable &&
                            !col.sticky &&
                            col.id !== "warranty";
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

      {configOpen &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
              className="absolute inset-0"
              onClick={() => setConfigOpen(false)}
            />
            <div
              className="relative rounded-xl shadow-2xl w-full max-w-3xl flex flex-col border overflow-hidden h-[90vh]"
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.border,
                maxHeight: "85vh",
              }}
            >
              <div
                className="flex justify-between items-center px-6 py-4 border-b"
                style={{ borderColor: COLORS.border }}
              >
                <h3
                  className="font-bold text-xl flex items-center gap-2"
                  style={{ color: COLORS.textPrimary }}
                >
                  <Settings size={20} style={{ color: COLORS.primary }} /> Table
                  Columns
                </h3>
                <button
                  onClick={() => setConfigOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={22} style={{ color: COLORS.textSecondary }} />
                </button>
              </div>

              <div
                className="px-6 py-4 border-b"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.border,
                }}
              >
                <div className="relative group">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search columns..."
                    className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm transition-all focus:ring-2 outline-none"
                    style={{
                      borderColor: COLORS.border,
                    }}
                    value={configSearch}
                    onChange={(e) => setConfigSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all hover:shadow-sm select-none"
                        style={{
                          backgroundColor: col.visible
                            ? `${COLORS.primary}10`
                            : COLORS.white,
                          borderColor: col.visible
                            ? COLORS.primary
                            : COLORS.border,
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center border transition-colors"
                          style={{
                            backgroundColor: col.visible
                              ? COLORS.primary
                              : COLORS.white,
                            borderColor: col.visible
                              ? COLORS.primary
                              : "#e5e7eb",
                          }}
                        >
                          <Check
                            size={14}
                            className="transition-opacity"
                            style={{
                              color: COLORS.white,
                              opacity: col.visible ? 1 : 0,
                            }}
                          />
                        </div>
                        <span
                          className="text-sm font-medium truncate"
                          style={{
                            color: col.visible
                              ? COLORS.textPrimary
                              : COLORS.textSecondary,
                          }}
                        >
                          {col.label}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div
                className="px-6 py-4 border-t flex justify-between items-center bg-gray-50"
                style={{ borderColor: COLORS.border }}
              >
                <button
                  onClick={handleResetDefault}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  style={{ color: COLORS.textSecondary }}
                >
                  <RotateCcw size={16} /> Reset to Default
                </button>

                <div className="text-xs text-gray-400">
                  {columns.filter((c) => c.visible).length} columns visible
                </div>

                <button
                  className="px-6 py-1.5 rounded text-xs font-bold text-white shadow-sm flex items-center gap-2"
                  style={{ backgroundColor: COLORS.primary }}
                  onClick={() => setConfigOpen(false)}
                >
                  Apply
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
                <button onClick={closePopup}>
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-0">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-1.5 border">Code</th>
                      <th className="p-1.5 border">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr
                        key={item._id || idx}
                        className="border-b hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleItemSelect(item)}
                      >
                        <td className="p-1.5 border">{item.code}</td>
                        <td className="p-1.5 border">{item.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>,
          document.body
        )}

      {warrantyPopup.visible &&
        ReactDOM.createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998] cursor-default bg-transparent"
              onClick={closeWarrantyPopup}
            />
            <div
              className="fixed z-[9999] bg-white border border-gray-200 shadow-2xl flex flex-col rounded-md overflow-hidden ring-1 ring-black/5"
              style={{
                top: warrantyPopup.top,
                left: warrantyPopup.left,
                borderColor: COLORS.borderDark || "#e5e7eb",
                width: "320px",
                transform:
                  warrantyPopup.top + 350 > window.innerHeight
                    ? "translateY(-100%)"
                    : "none",
              }}
            >
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
                <span className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-600" />
                  Select Warranty
                </span>
                <button
                  onClick={closeWarrantyPopup}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                {warrantyPopup.options.length > 0 ? (
                  warrantyPopup.options.map((opt) => (
                    <div
                      key={opt.id}
                      className="px-4 py-2.5 border-b border-gray-100 text-sm cursor-pointer hover:bg-blue-50/50 flex justify-between items-center group transition-colors last:border-0"
                      onClick={() => handleWarrantySelect(opt)}
                    >
                      <span className="text-gray-700 font-medium group-hover:text-blue-700">
                        {opt.label}
                      </span>
                      {opt.price > 0 && (
                        <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-xs">
                          +₹{opt.price}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-sm text-center text-gray-400 italic bg-white">
                    No standard plans available for this item.
                  </div>
                )}
              </div>

              <div className="bg-gray-50 border-t border-gray-200 p-3">
                <div className="text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-2 pl-1">
                  Add Custom Plan
                </div>
                <div className="space-y-2">
                  <div className="flex items-center border border-gray-300 bg-white rounded hover:border-blue-400 transition-colors h-9 overflow-hidden">
                    <div className="bg-gray-100 px-3 h-full flex items-center border-r border-gray-300 text-gray-500">
                      <Clock size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder="Duration (e.g. 3 Years)"
                      className="w-full h-full px-3 text-sm outline-none text-gray-700 placeholder:text-gray-400"
                      value={newWarranty.duration}
                      onChange={(e) =>
                        setNewWarranty((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center border border-gray-300 bg-white rounded hover:border-blue-400 transition-colors h-9 overflow-hidden">
                    <div className="bg-gray-100 px-3 h-full flex items-center border-r border-gray-300 text-gray-500">
                      <DollarSign size={14} />
                    </div>
                    <input
                      type="number"
                      placeholder="Price (Optional)"
                      className="w-full h-full px-3 text-sm outline-none text-gray-700 placeholder:text-gray-400"
                      value={newWarranty.price}
                      onChange={(e) =>
                        setNewWarranty((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                    onClick={handleAddCustomWarranty}
                    disabled={!newWarranty.duration}
                  >
                    Add & Apply
                  </button>
                </div>
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
