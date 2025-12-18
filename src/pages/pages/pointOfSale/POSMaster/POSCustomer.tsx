import React, {
  useState,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
} from "react";

import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  SearchIcon,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

import {
  handlePrint,
  handleExport,
} from "../../../../components/function/functions.tsx";
import {
  PrintIcon,
  ExportIcon,
} from "../../../../components/function/functions.tsx";

import POSCustomerMaster from "../../../../components/POSCustomerMaster.tsx";

// --- TYPE DEFINITIONS ---
interface Customer {
  _id: string; // Used as the unique ID
  cust_name: string;
  print_name: string;
  gst_no: string;
  identification: string;
  code: string;
  under_ledger: string;
  gst: string;
  registration_date: string;
  cin?: string;
  pan?: string;
  goods_service?: string;
  gst_category?: string;
  [key: string]: any;
}

export type DataItem = Customer;

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  type?: string;
  required?: boolean;
}

interface SortConfig {
  key: keyof DataItem | null;
  direction: "ascending" | "descending";
}

interface ResizableHeaderProps {
  col: Column;
  requestSort: (key: string) => void;
  renderSortIndicator: (key: string) => React.JSX.Element | null;
  setColumnWidths: Dispatch<SetStateAction<Record<string, number | undefined>>>;
  columnWidths: Record<string, number | undefined>;
  onDragStart: (key: string) => void;
  onDragOver: (key: string) => void;
  onDrop: (draggedKey: string, droppedOverKey: string) => void;
  columnIndex: number;
}

// --- COLUMN DEFINITIONS ---
const CustomerColumns: Column[] = [
  { key: "sno", label: "SNo.", sortable: true },
  { key: "cust_name", label: "Customer Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phoneNo", label: "Phone No", sortable: true },
  { key: "card", label: "Card No", sortable: true },
];

const pageSizeOptions = [5, 10, 20, 50];
const initialPageSize = 5;

// --- CUSTOMER TABLE LOGIC HOOK ---
const useCustomerTableLogic = (
  initialData: DataItem[],
  initialSize: number
) => {
  const [data, setData] = useState<DataItem[]>(initialData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(initialSize);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    setData(initialData);
    setCurrentPage(1);
    setSelectedRows([]);
  }, [initialData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize, data.length]);

  const sortedAndFilteredData = useMemo(() => {
    let sortableData = [...data];
    let filteredData = sortableData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const sortKey = sortConfig.key!;
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return filteredData;
  }, [data, searchTerm, sortConfig]);

  const sortedDataLength = sortedAndFilteredData.length;
  const totalPages = Math.ceil(sortedDataLength / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedAndFilteredData.slice(start, end);
  }, [sortedAndFilteredData, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage === 0 && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startEntry = Math.min(
    sortedDataLength,
    (currentPage - 1) * pageSize + 1
  );
  const endEntry = Math.min(sortedDataLength, currentPage * pageSize);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxPageButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages, currentPage]);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig.key === (key as keyof DataItem) &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key: key as keyof DataItem, direction });
  };

  const renderSortIndicator = (key: string) => {
    if (sortConfig.key !== (key as keyof DataItem)) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="size-3 ml-1" />
    ) : (
      <ChevronDown className="size-3 ml-1" />
    );
  };

  return {
    data,
    setData,
    searchTerm,
    setSearchTerm,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    selectedRows,
    setSelectedRows,
    paginatedData,
    sortedDataLength,
    totalPages,
    startEntry,
    endEntry,
    pageNumbers,
    requestSort,
    renderSortIndicator,
  };
};

const ResizableHeader = ({
  col,
  requestSort,
  renderSortIndicator,
  setColumnWidths,
  columnWidths,
  onDragStart,
  onDragOver,
  onDrop,
}: ResizableHeaderProps) => {
  const thRef = useRef<HTMLTableHeaderCellElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const keyString = col.key as string;

  const style = {
    width: columnWidths[keyString] ? `${columnWidths[keyString]}px` : undefined,
    minWidth: "100px",
  };

  const startResizing = useCallback(
    (mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
      mouseDownEvent.stopPropagation();
      mouseDownEvent.preventDefault();
      const startX = mouseDownEvent.clientX;
      if (!thRef.current) return;
      const initialWidth = thRef.current.offsetWidth;
      const doResizing = (mouseMoveEvent: MouseEvent) => {
        const newWidth = Math.max(
          initialWidth + (mouseMoveEvent.clientX - startX),
          100
        );
        setColumnWidths((prev: Record<string, number | undefined>) => ({
          ...prev,
          [keyString]: newWidth,
        }));
      };
      const stopResizing = () => {
        window.removeEventListener("mousemove", doResizing);
        window.removeEventListener("mouseup", stopResizing);
      };
      window.addEventListener("mousemove", doResizing);
      window.addEventListener("mouseup", stopResizing);
    },
    [keyString, setColumnWidths]
  );

  const handleHeaderClick = () => {
    if (col.sortable) {
      requestSort(col.key);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLTableHeaderCellElement>) => {
    if (
      e.target instanceof HTMLElement &&
      e.target.className.includes("cursor-col-resize")
    )
      return;
    e.dataTransfer.setData("text/plain", keyString);
    setIsDragging(true);
    if (keyString !== "actions" && keyString !== "checkbox") {
      onDragStart(keyString);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableHeaderCellElement>) => {
    if (
      e.target instanceof HTMLElement &&
      e.target.className.includes("cursor-col-resize")
    )
      return;
    e.preventDefault();
    if (keyString !== "actions" && keyString !== "checkbox") {
      onDragOver(keyString);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLTableHeaderCellElement>) => {
    e.preventDefault();
    const draggedColKey = e.dataTransfer.getData("text/plain") as string;

    if (keyString !== "actions" && keyString !== "checkbox") {
      onDrop(draggedColKey, keyString);
    }
  };

  if (col.key === "actions" || col.key === "checkbox") {
    return (
      <th
        key={keyString}
        className="p-4 text-center whitespace-nowrap no-print border-r border-dashed border-gray-300 dark:border-gray-600"
        style={{
          width:
            columnWidths[keyString] ||
            (col.key === "checkbox" ? "40px" : "100px"),
        }}
      >
        {col.label}
      </th>
    );
  }

  return (
    <th
      ref={thRef}
      key={keyString}
      draggable={true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={`p-4 relative cursor-move ${
        col.sortable
          ? "hover:bg-gray-100 dark:hover:bg-gray-700/80 transition duration-150"
          : ""
      } ${
        isDragging ? "opacity-50 border-blue-500 border-2" : ""
      } border-r border-dashed border-gray-300 dark:border-gray-600`}
      onClick={handleHeaderClick}
      style={style}
    >
      <span className="flex items-center whitespace-nowrap pointer-events-none">
        {col.label} {col.sortable && renderSortIndicator(col.key)}
      </span>
      <div
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-20 opacity-0 hover:opacity-100 transition duration-150 bg-transparent hover:bg-blue-400 dark:hover:bg-blue-600"
        onMouseDown={startResizing}
        onClick={(e) => e.stopPropagation()}
      />
    </th>
  );
};

// --- CustomerDirectory Component ---
export default function POSCustomer() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [, setEditingRow] = useState<DataItem | null>(null);

  const [apiData, setApiData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [columnWidths, setColumnWidths] = useState<
    Record<string, number | undefined>
  >({});

  // --- FIX: handleClose returns boolean to match Interface ---
  const handleClose = (): boolean => {
    setIsFormOpen(false);
    setEditingRow(null);
    return false;
  };

  // --- Mock logic to stop infinite loading for this example ---
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const [currentColumns, setCurrentColumns] =
    useState<Column[]>(CustomerColumns);

  const {
    data,
    searchTerm,
    setSearchTerm,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    selectedRows,
    setSelectedRows,
    paginatedData,
    sortedDataLength,
    totalPages,
    startEntry,
    endEntry,
    pageNumbers,
    requestSort,
    renderSortIndicator,
  } = useCustomerTableLogic(apiData, initialPageSize);

  const handleDrop = useCallback(
    (draggedKey: string, droppedOverKey: string) => {
      if (!draggedKey || !droppedOverKey) return;
      const draggedColIndex = currentColumns.findIndex(
        (col) => col.key === draggedKey
      );
      const droppedOverIndex = currentColumns.findIndex(
        (col) => col.key === droppedOverKey
      );
      if (
        draggedColIndex === -1 ||
        droppedOverIndex === -1 ||
        draggedColIndex === droppedOverIndex
      )
        return;
      const newColumns = [...currentColumns];
      const [draggedItem] = newColumns.splice(draggedColIndex, 1);
      newColumns.splice(droppedOverIndex, 0, draggedItem);
      setCurrentColumns(newColumns);
    },
    [currentColumns]
  );

  const handleDragStart = useCallback(() => {}, []);
  const handleDragOver = useCallback(() => {}, []);

  const isSelected = (row: DataItem) => selectedRows.includes(row._id);
  const handleSelectRow = (row: DataItem) => {
    setSelectedRows((prev: string[]) =>
      isSelected(row)
        ? prev.filter((id: string) => id !== row._id)
        : [...prev, row._id]
    );
  };

  const handleSelectAll = () => {
    const allIdsOnPage = paginatedData.map((row: DataItem) => row._id);
    const areAllSelected = allIdsOnPage.every((id: string) =>
      selectedRows.includes(id)
    );
    if (areAllSelected) {
      setSelectedRows((prev: string[]) =>
        prev.filter((id: string) => !allIdsOnPage.includes(id))
      );
    } else {
      setSelectedRows((prev: string[]) => [
        ...new Set([...prev, ...allIdsOnPage]),
      ]);
    }
  };

  const handleAddNew = () => {
    setEditingRow(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (row: DataItem) => {
    setEditingRow(row);
    setIsFormOpen(true);
  };

  const mockCustomers: Customer[] = [
    {
      _id: "657a1b2c3d4e5f001",
      cust_name: "Aman Singh",
      email: "aman.singh@gmail.com",
      phoneNo: "9876543210",
      card: "GOLD-001",
      gst_no: "10AAAAA0000A1Z5",
      print_name: "Aman Singh",
      identification: "PAN-AS123",
      code: "CUST001",
      under_ledger: "Sundry Debtors",
      gst: "Registered",
      registration_date: "2024-01-15",
    },
    {
      _id: "657a1b2c3d4e5f002",
      cust_name: "Priya Sharma",
      email: "priya.sharma@outlook.com",
      phoneNo: "8877665544",
      card: "SILV-552",
      gst_no: "", // Testing N/A logic
      print_name: "Priya Sharma",
      identification: "AADHAR-9988",
      code: "CUST002",
      under_ledger: "Sundry Debtors",
      gst: "Unregistered",
      registration_date: "2024-02-10",
    },
    {
      _id: "657a1b2c3d4e5f003",
      cust_name: "Info Era Software",
      email: "contact@infoera.com",
      phoneNo: "0612-223344",
      card: "CORP-101",
      gst_no: "10BBBBB1111B1Z2",
      print_name: "Info Era Software Pvt Ltd",
      identification: "CIN-U72200BR",
      code: "CUST003",
      under_ledger: "Corporate Accounts",
      gst: "Registered",
      registration_date: "2023-11-20",
    },
    {
      _id: "657a1b2c3d4e5f004",
      cust_name: "Rahul Kumar",
      email: "rahul.bihar@yahoo.com",
      phoneNo: "7766554433",
      card: "", // Testing N/A logic
      gst_no: "10CCCCC2222C1Z9",
      print_name: "Rahul Kumar",
      identification: "VOTER-RK44",
      code: "CUST004",
      under_ledger: "Sundry Debtors",
      gst: "Registered",
      registration_date: "2024-05-01",
    },
    {
      _id: "657a1b2c3d4e5f005",
      cust_name: "Suresh Mehra",
      email: "", // Testing N/A logic
      phoneNo: "9900887766",
      card: "BRON-990",
      gst_no: "",
      print_name: "Suresh Mehra",
      identification: "PAN-SM990",
      code: "CUST005",
      under_ledger: "Sundry Debtors",
      gst: "Unregistered",
      registration_date: "2024-06-12",
    },
    {
      _id: "657a1b2c3d4e5f001",
      cust_name: "Aman Singh",
      email: "aman.singh@gmail.com",
      phoneNo: "9876543210",
      card: "GOLD-001",
      gst_no: "10AAAAA0000A1Z5",
      print_name: "Aman Singh",
      identification: "PAN-AS123",
      code: "CUST001",
      under_ledger: "Sundry Debtors",
      gst: "Registered",
      registration_date: "2024-01-15",
    },
    {
      _id: "657a1b2c3d4e5f002",
      cust_name: "Priya Sharma",
      email: "priya.sharma@outlook.com",
      phoneNo: "8877665544",
      card: "SILV-552",
      gst_no: "", // Testing N/A logic
      print_name: "Priya Sharma",
      identification: "AADHAR-9988",
      code: "CUST002",
      under_ledger: "Sundry Debtors",
      gst: "Unregistered",
      registration_date: "2024-02-10",
    },
    {
      _id: "657a1b2c3d4e5f003",
      cust_name: "Info Era Software",
      email: "contact@infoera.com",
      phoneNo: "0612-223344",
      card: "CORP-101",
      gst_no: "10BBBBB1111B1Z2",
      print_name: "Info Era Software Pvt Ltd",
      identification: "CIN-U72200BR",
      code: "CUST003",
      under_ledger: "Corporate Accounts",
      gst: "Registered",
      registration_date: "2023-11-20",
    },
    {
      _id: "657a1b2c3d4e5f004",
      cust_name: "Rahul Kumar",
      email: "rahul.bihar@yahoo.com",
      phoneNo: "7766554433",
      card: "", // Testing N/A logic
      gst_no: "10CCCCC2222C1Z9",
      print_name: "Rahul Kumar",
      identification: "VOTER-RK44",
      code: "CUST004",
      under_ledger: "Sundry Debtors",
      gst: "Registered",
      registration_date: "2024-05-01",
    },
    {
      _id: "657a1b2c3d4e5f005",
      cust_name: "Suresh Mehra",
      email: "", // Testing N/A logic
      phoneNo: "9900887766",
      card: "BRON-990",
      gst_no: "",
      print_name: "Suresh Mehra",
      identification: "PAN-SM990",
      code: "CUST005",
      under_ledger: "Sundry Debtors",
      gst: "Unregistered",
      registration_date: "2024-06-12",
    },
  ];

  useEffect(() => {
    // Simulate an API call
    const loadData = async () => {
      setIsLoading(true);
      try {
        // In production, you will use fetch() here
        setApiData(mockCustomers);
        setError(null);
      } catch (err) {
        setError("Failed to load customers.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // const handleCloseForm = () => {
  //   setIsFormOpen(false);
  //   setEditingRow(null);
  // };

  const handleDelete = async (user: DataItem) => {
    window.confirm(
      `Are you sure you want to delete Customer: ${user.cust_name}?`
    );
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row to delete.");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedRows.length} selected row(s)?`
      )
    ) {
      setApiData((prev: DataItem[]) =>
        prev.filter((u: DataItem) => !selectedRows.includes(u._id))
      );
      setSelectedRows([]);
    }
  };

  const areAllOnPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row: DataItem) => selectedRows.includes(row._id));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <Loader2 className="size-8 text-blue-600 animate-spin mr-2" />
        <span className="text-lg text-gray-700 dark:text-gray-300">
          Loading customer data...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-300 rounded-xl shadow-lg dark:border-red-700">
        <p className="font-semibold text-lg">Error</p>
        <p className="text-sm">{error}</p>
        <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Retry
        </button>
      </div>
    );
  }

  // --- MAIN RETURN WITH BLUR FIX ---
  return (
    <div className="relative w-full">
      {/* FIX: The Modal is rendered as an overlay here. 
          The background (table) remains in the DOM and blurs.
      */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <POSCustomerMaster onClose={handleClose} index={20} />
        </div>
      )}

      {/* WRAPPER: This container blurs when isFormOpen is true.
       */}
      <div
        className={`transition-all duration-300 ${
          isFormOpen
            ? "blur-md pointer-events-none opacity-50 scale-[0.98]"
            : "blur-0"
        }`}
      >
        <div className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full">
          {/* Control Panel */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                Show
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="mx-2 p-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white cursor-pointer"
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                entries
              </div>

              {selectedRows.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 flex items-center bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-sm"
                >
                  <TrashIcon className="size-4 mr-1" />
                  Bulk Delete ({selectedRows.length})
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
              <button
                onClick={() =>
                  handlePrint("printable-table", "Customer Directory")
                }
                className="p-2 text-gray-600 dark:text-gray-300 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title="Print Table"
              >
                <PrintIcon className="size-5" />
              </button>

              <button
                onClick={() =>
                  handleExport(data, currentColumns, "CustomerDirectory")
                }
                className="p-2 text-gray-600 dark:text-gray-300 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title="Export to CSV"
              >
                <ExportIcon className="size-5" />
              </button>

              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search all columns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              </div>

              <button
                onClick={handleAddNew}
                className="px-3 py-2 flex items-center bg-[#0c5888] text-white text-sm font-medium hover:bg-[#124463] transition shadow-md whitespace-nowrap rounded-lg"
              >
                <PlusIcon className="size-4 mr-1" />
                Add New
              </button>
            </div>
          </div>
          <hr className="mb-4 border-gray-100 dark:border-gray-700" />

          {/* Table Section */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full table-fixed" id="printable-table">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                  <th
                    className="p-4 w-10 no-print border-r border-dashed border-gray-300 dark:border-gray-600"
                    style={{ width: columnWidths["checkbox"] || "40px" }}
                  >
                    <input
                      type="checkbox"
                      className="rounded text-blue-600 border-gray-300"
                      checked={areAllOnPageSelected}
                      onChange={handleSelectAll}
                    />
                  </th>

                  {currentColumns.map((col, index) => (
                    <ResizableHeader
                      key={col.key}
                      col={col}
                      requestSort={requestSort}
                      renderSortIndicator={renderSortIndicator}
                      setColumnWidths={setColumnWidths}
                      columnIndex={index}
                      columnWidths={columnWidths}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    />
                  ))}

                  <th
                    className="p-4 text-center whitespace-nowrap no-print border-r border-dashed border-gray-300 dark:border-gray-600"
                    style={{ width: columnWidths["actions"] || "100px" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row) => (
                    <tr
                      key={row._id}
                      className="even:bg-gray-50/50 dark:even:bg-gray-700/10 border-t border-gray-100 dark:border-gray-700/50 text-sm text-gray-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700/30 transition duration-150"
                    >
                      <td
                        className="p-4 w-10 no-print border-r border-gray-200 dark:border-gray-700"
                        style={{ width: columnWidths["checkbox"] || "40px" }}
                      >
                        <input
                          type="checkbox"
                          className="rounded text-blue-600"
                          checked={isSelected(row)}
                          onChange={() => handleSelectRow(row)}
                        />
                      </td>

                      {currentColumns.map((col, colIndex) => {
                        const value = row[col.key as keyof DataItem];
                        const displayValue =
                          !value || String(value).trim() === ""
                            ? "N/A"
                            : String(value);

                        return (
                          <td
                            key={colIndex}
                            className="p-4 whitespace-nowrap overflow-hidden text-ellipsis border-r border-gray-200 dark:border-gray-700"
                            style={{
                              width: columnWidths[col.key]
                                ? `${columnWidths[col.key]}px`
                                : undefined,
                            }}
                          >
                            {displayValue}
                          </td>
                        );
                      })}

                      <td
                        className="p-4 text-center space-x-2 whitespace-nowrap no-print border-r border-gray-200 dark:border-gray-700"
                        style={{ width: columnWidths["actions"] || "100px" }}
                      >
                        <button
                          onClick={() => handleEditClick(row)}
                          className="p-1.5 rounded-full hover:bg-gray-100 text-blue-600 transition"
                          title="Edit"
                        >
                          <EditIcon className="size-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          className="p-1.5 rounded-full hover:bg-gray-100 text-red-600 transition"
                          title="Delete"
                        >
                          <TrashIcon className="size-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={currentColumns.length + 2}
                      className="p-8 text-center text-lg text-gray-500"
                    >
                      No matching entries found. 🙁
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startEntry} to {endEntry} of {sortedDataLength} entries.
            </div>

            <div className="flex space-x-2 items-center justify-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-md text-sm font-medium border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-[#0c5888]/10"
                }`}
              >
                Previous
              </button>

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border ${
                    currentPage === page
                      ? "bg-[#0c5888] text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage >= totalPages}
                className={`px-3 py-1.5 rounded-md text-sm font-medium border ${
                  currentPage >= totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-[#0c5888]/10"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
