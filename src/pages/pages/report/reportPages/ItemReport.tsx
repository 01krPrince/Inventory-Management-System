import { useState, useEffect, useMemo } from "react";
import {
  Package,
  Edit3,
  Trash2,
  Printer,
  Download,
  Loader2,
} from "lucide-react";
import AddNewItem from "../../../../components/addItemMaster/AddNewItem";
import {
  fetchItems,
  deleteItemApi,
} from "../../inventory/itemMaster/api/itemService";
import {
  handlePrint,
  handleExport,
} from "../../../../components/function/functions";

// --- FIX: Updated Interface ---
interface Item {
  _id: string;
  name: string;
  code: string;
  barcode: string;
  brand?: any;
  category: any; // Changed from 'string' to 'any' to match API object response
  group?: any;
  hsn_code?: string;
  type?: string | null;
  inactive?: boolean;
  registration_date?: string | null;
  [key: string]: any;
}

const ReportColumns = [
  { key: "code", label: "Item Code" },
  { key: "name", label: "Item Name" },
  { key: "barcode", label: "Barcode" },
  { key: "brand", label: "Brand" },
  { key: "category_name", label: "Category" },
  { key: "group", label: "Group" },
  { key: "hsn_code", label: "HSN" },
  { key: "type", label: "Type" },
  { key: "inactive", label: "Status" },
];

const getDisplayValue = (value: any): string => {
  if (!value) return "";
  if (typeof value === "object") return value.name || value.item_name || "";
  return String(value);
};

const ItemReport = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isPrinting, setIsPrinting] = useState(false);
  const [prePrintRows, setPrePrintRows] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Item | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchItems();
      // The cast to Item[] will now work because 'category' accepts the object structure
      setItems(Array.isArray(data) ? (data as Item[]) : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return items.filter((i) =>
      [i.name, i.code, i.hsn_code].some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
  }, [items, searchTerm]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  useEffect(() => {
    if (isPrinting && paginatedData.length === filteredData.length) {
      setTimeout(() => {
        handlePrint("item-report-table", "Item Inventory Report");
        setIsPrinting(false);
        setRowsPerPage(prePrintRows);
      }, 500);
    }
  }, [isPrinting, paginatedData.length, filteredData.length, prePrintRows]);

  const handlePrintRequest = () => {
    setPrePrintRows(rowsPerPage);
    setRowsPerPage(filteredData.length);
    setIsPrinting(true);
  };

  const TableHeader = ({
    label,
    className = "",
  }: {
    label: string;
    className?: string;
  }) => (
    <th
      className={`px-3 py-2 text-[11px] font-bold uppercase text-gray-500 border-b bg-gray-50 sticky top-0 z-10 ${className}`}
    >
      {label}
    </th>
  );

  if (isFormOpen)
    return (
      <AddNewItem
        onClose={() => setIsFormOpen(false)}
        initialData={editingRow ? (editingRow as any) : undefined}
        onSuccess={() => {
          fetchData();
          setIsFormOpen(false);
        }}
      />
    );
  if (loading)
    return (
      <div className="flex justify-center h-64 items-center">
        <Loader2 className="animate-spin text-[#0c5888]" />
      </div>
    );

  return (
    <div className="bg-white shadow-sm border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="p-3 border-b flex justify-between items-center">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Package className="text-[#0c5888]" /> Item Inventory
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            className="border rounded px-3 py-1.5 text-sm"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handlePrintRequest}
            className="p-2 border rounded flex items-center gap-1 text-xs font-semibold"
          >
            <Printer size={16} /> Print All
          </button>
          <button
            onClick={() =>
              handleExport(filteredData, ReportColumns, "Item_Report")
            }
            className="p-2 border rounded hover:bg-gray-50"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto flex-1">
        <table
          className="w-full border-collapse text-left"
          id="item-report-table"
        >
          <thead>
            <tr>
              <TableHeader label="Code" />
              <TableHeader label="Item Name" />
              <TableHeader label="Barcode" />
              <TableHeader label="Brand" />
              <TableHeader label="Category" />
              <TableHeader label="HSN Code" />
              <TableHeader label="Type" />
              <TableHeader label="Group" />
              <TableHeader label="Status" />
              <TableHeader label="Actions" className="no-print text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((row) => (
              <tr
                key={row._id}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-3 py-2 text-sm font-mono font-bold text-[#0c5888]">
                  {row.code || "---"}
                </td>
                <td className="px-3 py-2 text-sm font-medium">{row.name}</td>
                <td className="px-3 py-2 text-sm font-medium">{row.barcode}</td>
                <td className="px-3 py-2 text-sm text-gray-500">
                  {getDisplayValue(row.brand)}
                </td>
                <td className="px-3 py-2 text-sm font-medium">
                  {/* Ensure category_name exists or fallback to accessing category object if needed */}
                  {row.category_name || getDisplayValue(row.category)}
                </td>
                <td className="px-3 py-2 text-sm font-medium">
                  {row.hsn_code}
                </td>
                <td className="px-3 py-2 text-sm font-medium">{row.type}</td>
                <td className="px-3 py-2 text-sm text-gray-500">
                  {getDisplayValue(row.group)}
                </td>
                <td className="px-3 py-2 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${row.inactive ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}
                  >
                    {row.inactive}
                  </span>
                </td>
                <td className="px-3 py-2 text-right flex justify-end gap-1 no-print">
                  <button
                    onClick={() => {
                      setEditingRow(row);
                      setIsFormOpen(true);
                    }}
                    className="p-1.5 text-gray-400 hover:text-blue-600"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm("Delete?")) {
                        await deleteItemApi(row._id);
                        fetchData();
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-gray-50 border-t flex justify-between items-center text-xs">
        <span className="font-bold">Total: {filteredData.length}</span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="ml-2 text-[11px] font-bold border rounded px-1 py-1 outline-none cursor-pointer"
        >
          {[10, 25, 50, 100].map((val) => (
            <option key={val} value={val}>
              Show {val}
            </option>
          ))}
          <option value={filteredData.length}>Show All</option>
        </select>
      </div>
    </div>
  );
};

export default ItemReport;
