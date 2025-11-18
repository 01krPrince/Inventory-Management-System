import React, {
  useState,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

// --- MOCK IMPORTS FOR RUNNABILITY ---
import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  SearchIcon,
  ChevronDown,
} from "lucide-react";

// Mock Icons
const ExportIcon = (props: any) => <svg {...props} />;
const PrintIcon = (props: any) => <svg {...props} />;

// Mock Data Types based on usage
interface Employee {
  user: string;
  position: string;
  office: string;
  age: number;
  startDate: string;
  salary: string;
  id: number;
}
export type DataItem = Employee & { [key: string]: any };
export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  type?: string;
  required?: boolean;
}
const initialEmployeeData: DataItem[] = [
  {
    user: "Abram Schleifer",
    position: "Sales Assistant",
    office: "Edinburgh",
    age: 57,
    startDate: "25 Apr, 2027",
    salary: "$89,500",
    id: 1,
  },
  {
    user: "Charlotte Anderson",
    position: "Marketing Manager",
    office: "London",
    age: 42,
    startDate: "12 Mar, 2025",
    salary: "$105,000",
    id: 2,
  },
  {
    user: "Ethan Brown",
    position: "Software Engineer",
    office: "San Francisco",
    age: 30,
    startDate: "01 Jan, 2024",
    salary: "$120,000",
    id: 3,
  },
];
const employeeColumns: Column[] = [
  { key: "user", label: "User", sortable: true },
  { key: "position", label: "Position", sortable: true },
  { key: "office", label: "Office", sortable: true },
  { key: "age", label: "Age", sortable: true, type: "number" },
  { key: "startDate", label: "Start Date", sortable: true },
  { key: "salary", label: "Salary", sortable: true },
];
const formColumns: Column[] = [
  { key: "user", label: "User", type: "text", required: true },
  { key: "position", label: "Position", type: "text", required: true },
  { key: "office", label: "Office", type: "text", required: false },
  { key: "age", label: "Age", type: "number", required: false },
  {
    key: "startDate",
    label: "Start Date (e.g., 01 Jan, 2024)",
    type: "text",
    required: false,
  },
  {
    key: "salary",
    label: "Salary (e.g., $100,000)",
    type: "text",
    required: false,
  },
];

const useTableLogic = (
  data: DataItem[],
  _columns: Column[],
  initialPageSize: number
) => ({
  data: data,
  setData: ((_: (prev: DataItem[]) => DataItem[]) => {}) as Dispatch<
    SetStateAction<DataItem[]>
  >,
  searchTerm: "",
  setSearchTerm: ((_: string) => {}) as Dispatch<SetStateAction<string>>,
  pageSize: initialPageSize,
  setPageSize: ((_: number) => {}) as Dispatch<SetStateAction<number>>,
  currentPage: 1,
  setCurrentPage: ((_: number | ((prev: number) => number)) => {}) as Dispatch<
    SetStateAction<number>
  >,
  selectedRows: [1],
  setSelectedRows: ((
    _: number[] | ((prev: number[]) => number[])
  ) => {}) as Dispatch<SetStateAction<number[]>>,
  paginatedData: data,
  sortedDataLength: data.length,
  totalPages: 1,
  startEntry: 1,
  endEntry: data.length,
  pageNumbers: [1],
  requestSort: ((_: string) => {}) as (key: string) => void,
  renderSortIndicator: (key: string) =>
    key === "user" ? <ChevronDown className="size-3 ml-1" /> : null,
});

// FIX (Line 130): Changed 'columns' to '_columns'
const handleExport = (
  _data: DataItem[],
  _columns: Column[],
  fileName: string
) => console.log(`Exporting ${fileName}`);
const handlePrint = (_elementId: string, _title: string) =>
  console.log(`Printing ${_title}`);

interface NewCustomerData {
  user: string;
  position: string;
  office: string;
  age: string;
  startDate: string;
  salary: string;
  [key: string]: string;
}

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newCustomerData: NewCustomerData) => void;
}

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: DataItem | null;
  onUpdate: (updatedData: DataItem) => void;
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
  // Line 168: columnIndex is declared here, and must be passed in the JSX call
  columnIndex: number;
}

// --- AddCustomerModal (Unchanged) ---
const AddCustomerModal = ({
  isOpen,
  onClose,
  onAdd,
}: AddCustomerModalProps) => {
  const [formData, setFormData] = useState<NewCustomerData>({
    user: "",
    position: "",
    office: "",
    age: "",
    startDate: "",
    salary: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: NewCustomerData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user || !formData.position) {
      console.error("Please fill in User and Position.");
      return;
    }
    onAdd(formData);
    setFormData({
      user: "",
      position: "",
      office: "",
      age: "",
      startDate: "",
      salary: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-70 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-2 border-gray-100 dark:border-gray-700">
          Add New Employee
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {formColumns.map((col: Column) => (
            <div key={col.key} className="col-span-1">
              <label
                htmlFor={col.key}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {col.label}
                {col.required && <span className="text-red-500">*</span>}
              </label>

              <input
                id={col.key}
                type={col.type || "text"}
                name={col.key}
                value={formData[col.key]}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                required={col.required}
              />
            </div>
          ))}

          <div className="col-span-full flex justify-end space-x-3 pt-4 border-t mt-4 border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- EditCustomerModal (Unchanged) ---
const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  isOpen,
  onClose,
  rowData,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<DataItem | null>(rowData);

  useEffect(() => {
    setFormData(rowData);
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData((prev: DataItem | null) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !formData.user || !formData.position) {
      console.error("User and Position are required fields.");
      return;
    }
    onUpdate(formData);
    onClose();
  };

  if (!isOpen || !formData) return null;

  const displayData: Record<string, string | number> = {
    ...formData,
    age: String(formData.age),
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-70 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-2 border-gray-100 dark:border-gray-700">
          Edit Employee: {formData.user}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {formColumns.map((col: Column) => (
            <div key={col.key} className="col-span-1">
              <label
                htmlFor={col.key}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {col.label}
                {col.required && <span className="text-red-500">*</span>}
              </label>

              <input
                id={col.key}
                type={col.type || "text"}
                name={col.key}
                value={displayData[col.key] || ""}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                required={col.required}
                disabled={col.key === "id"}
              />
            </div>
          ))}

          <div className="col-span-full flex justify-end space-x-3 pt-4 border-t mt-4 border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
            >
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// --- END MODALS ---

// --- ResizableHeader (Updated prop destructuring) ---
const ResizableHeader = ({
  col,
  requestSort,
  renderSortIndicator,
  setColumnWidths,
  columnWidths,
  onDragStart,
  onDragOver,
  onDrop,
}: // columnIndex remains required in the interface but is not used in the function body
ResizableHeaderProps) => {
  const thRef = useRef<HTMLTableHeaderCellElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const style = {
    width: columnWidths[col.key] ? `${columnWidths[col.key]}px` : undefined,
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
        const widthDelta = mouseMoveEvent.clientX - startX;
        const newWidth = Math.max(initialWidth + widthDelta, 100);

        setColumnWidths((prev: Record<string, number | undefined>) => ({
          ...prev,
          [col.key]: newWidth,
        }));
      };

      const stopResizing = () => {
        window.removeEventListener("mousemove", doResizing);
        window.removeEventListener("mouseup", stopResizing);
      };

      window.addEventListener("mousemove", doResizing);
      window.addEventListener("mouseup", stopResizing);
    },
    [col.key, setColumnWidths]
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

    e.dataTransfer.setData("text/plain", col.key);
    setIsDragging(true);
    onDragStart(col.key);
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
    onDragOver(col.key);
  };

  const handleDrop = (e: React.DragEvent<HTMLTableHeaderCellElement>) => {
    e.preventDefault();
    const draggedColKey = e.dataTransfer.getData("text/plain");
    onDrop(draggedColKey, col.key);
  };

  return (
    <th
      ref={thRef}
      key={col.key}
      draggable={true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={`p-4 relative cursor-move 
          ${
            col.sortable
              ? "hover:bg-gray-100 dark:hover:bg-gray-700/80 transition duration-150"
              : ""
          }
          ${isDragging ? "opacity-50 border-blue-500 border-2" : ""}
          border-r border-dashed border-gray-300 dark:border-gray-600`}
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

const pageSizeOptions = [5, 10, 20, 50];
const initialPageSize = 5;

// --- Customer Component (Unchanged logic) ---
export default function Customer() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<DataItem | null>(null);
  const [columnWidths, setColumnWidths] = useState<
    Record<string, number | undefined>
  >({});

  const [currentColumns, setCurrentColumns] =
    useState<Column[]>(employeeColumns);
  const dragItem = useRef<string | null>(null);
  const dragOverItem = useRef<string | null>(null);

  // Lines 556-559 (Combined Destructuring for clarity)
  const tableLogic = useTableLogic(
    initialEmployeeData,
    currentColumns,
    initialPageSize
  );

  const {
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
  } = tableLogic;

  const handleDragStart = useCallback((key: string) => {
    dragItem.current = key;
  }, []);

  const handleDragOver = useCallback((key: string) => {
    dragOverItem.current = key;
  }, []);

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
      ) {
        return;
      }

      const newColumns = [...currentColumns];
      const [draggedItem] = newColumns.splice(draggedColIndex, 1);
      newColumns.splice(droppedOverIndex, 0, draggedItem);

      setCurrentColumns(newColumns);
      dragItem.current = null;
      dragOverItem.current = null;
    },
    [currentColumns]
  ); /* --- Data/Row Handlers --- */

  const isSelected = (row: DataItem) => selectedRows.includes(row.id);

  const handleSelectRow = (row: DataItem) => {
    setSelectedRows((prev: number[]) =>
      isSelected(row)
        ? prev.filter((id: number) => id !== row.id)
        : [...prev, row.id]
    );
  };

  const handleSelectAll = () => {
    const allIdsOnPage = paginatedData.map((row: DataItem) => row.id);
    const areAllSelected = allIdsOnPage.every((id: number) =>
      selectedRows.includes(id)
    );

    if (areAllSelected) {
      setSelectedRows((prev: number[]) =>
        prev.filter((id: number) => !allIdsOnPage.includes(id))
      );
    } else {
      setSelectedRows((prev: number[]) => [
        ...new Set([...prev, ...allIdsOnPage]),
      ]);
    }
  };

  const handleAddCustomer = (newCustomerData: NewCustomerData) => {
    const newId =
      data.length > 0 ? Math.max(...data.map((d: DataItem) => d.id)) + 1 : 1;
    const today = new Date()
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, ", ");

    const newCustomer: DataItem = {
      ...newCustomerData,
      id: newId,
      age: parseInt(newCustomerData.age) || 0,
      office: newCustomerData.office || "N/A",
      startDate: newCustomerData.startDate || today,
      salary: newCustomerData.salary || "$0",
    };

    setData((prev: DataItem[]) => [...prev, newCustomer]);
  };

  const handleUpdateCustomer = (updatedData: DataItem) => {
    const cleanedData: DataItem = {
      ...updatedData,
      age: parseInt(String(updatedData.age)) || 0,
    };

    setData((prevData: DataItem[]) =>
      prevData.map((row: DataItem) =>
        row.id === updatedData.id ? cleanedData : row
      )
    );
  };

  const handleOpenEditModal = (row: DataItem) => {
    setEditingRow(row);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: DataItem) => {
    console.error(
      `Attempting to delete user: ${user.user}. Replacement UI needed for confirmation.`
    );

    setData((prev: DataItem[]) =>
      prev.filter((u: DataItem) => u.id !== user.id)
    );
    setSelectedRows((prev: number[]) =>
      prev.filter((id: number) => id !== user.id)
    );
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      console.error("Please select at least one row to delete.");
      return;
    }

    console.error(
      `Attempting to delete ${selectedRows.length} selected row(s). Replacement UI needed for confirmation.`
    );

    setData((prev: DataItem[]) =>
      prev.filter((u: DataItem) => !selectedRows.includes(u.id))
    );
    setSelectedRows([]);
  };

  const areAllOnPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row: DataItem) => selectedRows.includes(row.id));

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              Show
              <select
                value={pageSize}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setPageSize(Number(e.target.value))
                }
                className="mx-2 p-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-white appearance-none cursor-pointer"
              >
                {pageSizeOptions.map((option: number) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              entries
            </div>
            {/* Bulk Delete Button */}
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
                handlePrint("printable-table", "Employee Directory")
              }
              className="p-2 text-gray-600 dark:text-gray-300 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Print Table"
            >
              <PrintIcon className="size-5" />
            </button>

            <button
              onClick={() =>
                handleExport(data, currentColumns, "EmployeeDirectory")
              }
              className="p-2 text-gray-600 dark:text-gray-300 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Export to XLSX"
            >
              <ExportIcon className="size-5" />
            </button>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search all columns..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full p-2 pl-10 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />

              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-2 flex items-center bg-[#0c5888] text-white text-sm font-medium hover:bg-[#124463] transition shadow-md whitespace-nowrap rounded-lg"
            >
              <PlusIcon className="size-4 mr-1" />
              Add New
            </button>
          </div>
        </div>
        <hr className="mb-4 border-gray-100 dark:border-gray-700" />

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full table-fixed" id="printable-table">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                <th
                  className="p-4 w-10 no-print border-r border-dashed border-gray-300 dark:border-gray-600"
                  style={{ width: "40px" }}
                >
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 dark:bg-gray-600 dark:border-gray-500 border-gray-300 focus:ring-blue-500"
                    checked={areAllOnPageSelected}
                    onChange={handleSelectAll}
                  />
                </th>

                {currentColumns.map((col: Column, index: number) => (
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
                // FIX (Line 784): Renamed index to _index to denote it's unused
                paginatedData.map((row: DataItem, _index: number) => (
                  <tr
                    key={row.id}
                    className="even:bg-gray-50/50 dark:even:bg-gray-700/10 border-t border-gray-100 dark:border-gray-700/50 text-sm text-gray-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700/30 transition duration-150"
                  >
                    <td
                      className="p-4 w-10 no-print border-r border-gray-200 dark:border-gray-700"
                      style={{ width: columnWidths["checkbox"] || "40px" }}
                    >
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 dark:bg-gray-600 dark:border-gray-500 border-gray-300 focus:ring-blue-500"
                        checked={isSelected(row)}
                        onChange={() => handleSelectRow(row)}
                      />
                    </td>

                    {currentColumns.map((col: Column, colIndex: number) => (
                      <td
                        key={colIndex}
                        className="p-4 whitespace-nowrap overflow-hidden text-ellipsis border-r border-gray-200 dark:border-gray-700"
                        style={{
                          width: columnWidths[col.key]
                            ? `${columnWidths[col.key]}px`
                            : undefined,
                        }}
                      >
                        {row[col.key]}
                      </td>
                    ))}

                    <td
                      className="p-4 text-center space-x-2 whitespace-nowrap no-print border-r border-gray-200 dark:border-gray-700"
                      style={{ width: columnWidths["actions"] || "100px" }}
                    >
                      <button
                        onClick={() => handleOpenEditModal(row)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 transition"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <EditIcon className="size-4 inline" />
                      </button>

                      <button
                        onClick={() => handleDelete(row)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition"
                        aria-label="Delete"
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
                    className="p-8 text-center text-lg text-gray-500 dark:text-gray-400"
                  >
                    No matching entries found. 🙁
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startEntry} to {endEntry} of {sortedDataLength}
            entries. (Total Pages: {totalPages})
          </div>

          <div className="flex space-x-2 items-center justify-center mt-4">
            <button
              onClick={() =>
                setCurrentPage((prev: number) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700/40 dark:text-gray-500"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-[#0c5888]/10 hover:text-[#0c5888] dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-[#0c5888]/20"
              }`}
            >
              Previous
            </button>

            {pageNumbers.map((page: number) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? "bg-[#0c5888] text-white shadow-md border border-transparent dark:bg-[#0c5888]"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-[#0c5888]/10 hover:text-[#0c5888] dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-[#0c5888]/20"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage >= totalPages}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                currentPage >= totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700/40 dark:text-gray-500"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-[#0c5888]/10 hover:text-[#0c5888] dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-[#0c5888]/20"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCustomer}
      />

      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        rowData={editingRow}
        onUpdate={handleUpdateCustomer}
      />
    </>
  );
}
