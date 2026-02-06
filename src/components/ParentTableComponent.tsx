import { useState } from 'react';
import DynamicSelectorModal, { SelectorColumn } from './DynamicSelectorModal';
// Import necessary icons
import { Plus, X, ChevronDown } from 'lucide-react';

// --- Interfaces ---

interface ProcessItem {
  id: string;
  name: string;
  category: string;
  rate: number;
  [key: string]: any;
}

interface TableRow {
  rowId: number; // Unique ID for React Key (better than index)
  selectedProcess: ProcessItem | null;
  finishItem: string;
  rate: number;
}

// --- Sample Data ---
const sampleProcessData: ProcessItem[] = [
  { id: '0000152', name: 'BADMINTON GUTTING', category: 'SPORTS', rate: 150 },
  { id: '0000794', name: 'Full Service', category: 'FITNESS', rate: 2000 },
  { id: '0000803', name: 'Installation', category: 'FITNESS', rate: 500 },
  { id: '0000792', name: 'Motor Repair', category: 'FITNESS', rate: 1200 },
  { id: '0000775', name: 'Packing & Freight', category: 'Default', rate: 300 },
  { id: '0000152', name: 'BADMINTON GUTTING', category: 'SPORTS', rate: 150 },
  { id: '0000794', name: 'Full Service', category: 'FITNESS', rate: 2000 },
  { id: '0000803', name: 'Installation', category: 'FITNESS', rate: 500 },
  { id: '0000792', name: 'Motor Repair', category: 'FITNESS', rate: 1200 },
];

const processColumnsDef: SelectorColumn[] = [
  { key: 'id', label: 'Code', width: 'w-1/4' },
  { key: 'name', label: 'Process Name', width: 'w-1/2' },
  { key: 'category', label: 'Category', width: 'w-1/4' },
];

const ParentTableComponent = () => {
  // --- State ---
  // We initialize with a few empty rows
  const [rows, setRows] = useState<TableRow[]>([
    { rowId: 1, selectedProcess: null, finishItem: '', rate: 0 },
    { rowId: 2, selectedProcess: null, finishItem: '', rate: 0 },
    { rowId: 3, selectedProcess: null, finishItem: '', rate: 0 },
  ]);

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  const [, setNewCreatedItem] = useState(null);
  // --- Actions ---

  // 2. Insert Row (in between)
  const handleInsertRow = (index: number) => {
    const newId = Math.max(...rows.map((r) => r.rowId)) + 1; // Simple ID generation
    const newRow: TableRow = {
      rowId: newId,
      selectedProcess: null,
      finishItem: '',
      rate: 0,
    };

    const updatedRows = [...rows];
    updatedRows.splice(index + 1, 0, newRow); // Insert after the clicked row
    setRows(updatedRows);
  };

  // 3. Delete Row
  const handleDeleteRow = (index: number) => {
    if (rows.length === 1) {
      // Optional: Don't delete the last row, just clear it
      const updated = [...rows];
      updated[0] = {
        rowId: rows[0].rowId,
        selectedProcess: null,
        finishItem: '',
        rate: 0,
      };
      setRows(updated);
      return;
    }
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  // 4. Update Text Input (Finish Item)
  const handleInputChange = (index: number, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], finishItem: value };
    setRows(updatedRows);
  };

  // 5. Open Modal
  const handleOpenSelector = (rowIndex: number) => {
    setActiveRowIndex(rowIndex);
    setIsSelectorOpen(true);
  };

  // 6. Handle Modal Selection
  const handleSelectionConfirmed = (selectedItem: ProcessItem) => {
    if (activeRowIndex === null) return;

    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[activeRowIndex] = {
        ...updatedRows[activeRowIndex],
        selectedProcess: selectedItem,
        rate: selectedItem.rate,
      };
      return updatedRows;
    });

    setActiveRowIndex(null);
  };

  return (
    // Change 1: Use h-full if this component is inside a dashboard, or h-screen if it's a standalone page
    <div className="relative flex h-screen flex-col bg-white font-sans text-sm">
      {/* --- Main Table Area --- */}
      {/* Change 2: Removed 'pb-20'. flex-1 pushes the footer down naturally. */}
      <div className="flex-1 overflow-auto p-4">
        <div className="border border-gray-300 bg-white shadow-sm">
          {/* Header Row */}
          <div className="sticky top-0 z-10 flex bg-[#104a7d] text-xs font-medium uppercase tracking-wide text-white">
            <div className="w-10 border-r border-blue-800/50 p-2 text-center">#</div>
            <div className="w-16 border-r border-blue-800/50 p-2 text-center">Actions</div>
            <div className="flex-1 border-r border-blue-800/50 p-2">Process</div>
            <div className="flex-1 border-r border-blue-800/50 p-2">Finish Item</div>
            <div className="w-32 p-2 text-right">Rate</div>
          </div>

          {/* Table Rows */}
          <div>
            {rows.map((row, index) => (
              <div
                key={row.rowId}
                className="group flex h-10 items-center border-b border-gray-200 transition-colors hover:bg-gray-50">
                {/* 1. Serial Number */}
                <div className="flex h-full w-10 items-center justify-center border-r border-gray-200 bg-gray-50 text-center text-gray-500">
                  {index + 1}
                </div>

                {/* 2. Actions (Add / Delete) */}
                <div className="flex h-full w-16 items-center justify-center gap-1 border-r border-gray-200 px-1">
                  <button
                    onClick={() => handleInsertRow(index)}
                    className="rounded p-0.5 text-green-600 transition-colors hover:bg-green-100"
                    title="Insert Row Below">
                    <Plus className="h-4 w-4 stroke-[3]" />
                  </button>
                  <button
                    onClick={() => handleDeleteRow(index)}
                    className="rounded p-0.5 text-red-600 transition-colors hover:bg-red-100"
                    title="Delete Row">
                    <X className="h-4 w-4 stroke-[3]" />
                  </button>
                </div>

                {/* 3. Process Selector (Clickable) */}
                <div className="relative h-full flex-1 border-r border-gray-200">
                  <div
                    onClick={() => handleOpenSelector(index)}
                    className="flex h-full w-full cursor-pointer items-center px-3 text-gray-700">
                    {row.selectedProcess ? (
                      <span className="font-medium text-gray-900">{row.selectedProcess.name}</span>
                    ) : (
                      <span className="italic text-gray-400">Select...</span>
                    )}
                    {/* Hover Icon */}
                    <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-blue-500">
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </div>
                </div>

                {/* 4. Finish Item (Input) */}
                <div className="h-full flex-1 border-r border-gray-200">
                  <input
                    type="text"
                    value={row.finishItem}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="h-full w-full px-3 text-gray-700 placeholder-gray-300 focus:bg-blue-50/30 focus:outline-none"
                    placeholder="Enter item details..."
                  />
                </div>

                {/* 5. Rate (Read-Only/Display) */}
                <div className="h-full w-32 bg-gray-50/50">
                  <div className="flex h-full w-full items-center justify-end px-3 font-medium text-gray-700">
                    ₹{row.rate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Modal --- */}
      <DynamicSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => {
          setIsSelectorOpen(false);
          setActiveRowIndex(null);
        }}
        title="Select Process"
        data={sampleProcessData}
        columns={processColumnsDef}
        onSelect={handleSelectionConfirmed}
        onCreateNew={setNewCreatedItem}
      />
    </div>
  );
};

export default ParentTableComponent;
