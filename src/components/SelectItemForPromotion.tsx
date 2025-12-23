import React, { useState } from "react";
import { Search, X, ChevronDown, Download } from "lucide-react";

// --- Types ---
interface ItemType {
  id: string;
  name: string;
}

interface ItemGroup {
  id: string;
  name: string;
}

interface Item {
  code: string;
  name: string;
  typeId: string;
  groupId: string;
}

interface SelectItemForPromotionProps {
  onClose: () => void;
  onSubmit: (selectedItems: string[]) => void;
  // This simulates your "dynamic z-index" requirement.
  // Pass your global store value or function here.
  zIndex?: number;
}

// --- Mock Data (Based on screenshot) ---
const MOCK_TYPES: ItemType[] = [
  { id: "t1", name: "BALL GAME" },
  { id: "t2", name: "BOARD GAME" },
  { id: "t3", name: "CRICKET GAME" },
  { id: "t4", name: "Default" },
  { id: "t5", name: "LOWER" },
  { id: "t6", name: "RACKETS GAME" },
  { id: "t7", name: "SHORTS" },
  { id: "t8", name: "Swimming" },
  { id: "t9", name: "T-SHIRT" },
];

const MOCK_GROUPS: ItemGroup[] = [
  { id: "g1", name: "Default" },
  { id: "g2", name: "FITNESS" },
  { id: "g3", name: "GARMENTS" },
  { id: "g4", name: "SHOES" },
  { id: "g5", name: "SPORTS" },
  { id: "g6", name: "TROPHY & AWARDS" },
];

const MOCK_ITEMS: Item[] = [
  {
    code: "0000399",
    name: "HERCULES TREADMIL T2400",
    typeId: "t4",
    groupId: "g2",
  },
  {
    code: "0001149",
    name: "(MRF) Batting Gloves Mens",
    typeId: "t3",
    groupId: "g5",
  },
  {
    code: "0001145",
    name: "(MRF) Batting gloves Professional",
    typeId: "t3",
    groupId: "g5",
  },
  {
    code: "0001147",
    name: "(SG) Batting Gloves Match Lite",
    typeId: "t3",
    groupId: "g5",
  },
  {
    code: "0001290",
    name: "(SG) CRICKET B/LEGGUARD PLATINO",
    typeId: "t3",
    groupId: "g5",
  },
  {
    code: "0000038",
    name: "2005 Swimming Costume girls",
    typeId: "t8",
    groupId: "g3",
  },
  { code: "0000376", name: "25 MM ROD 3FT", typeId: "t4", groupId: "g2" },
  { code: "0000373", name: "25MM ROD 5FT", typeId: "t4", groupId: "g2" },
];

export const SelectItemForPromotion: React.FC<SelectItemForPromotionProps> = ({
  onClose,
  onSubmit,
  zIndex = 1000, // Replace with your dynamic z-index hook/logic
}) => {
  // --- State ---
  const [selectedTypeIds, setSelectedTypeIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedItemCodes, setSelectedItemCodes] = useState<Set<string>>(
    new Set()
  );

  // Search States
  const [typeSearch, setTypeSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");

  // --- Filtering Logic ---
  const filteredTypes = MOCK_TYPES.filter((t) =>
    t.name.toLowerCase().includes(typeSearch.toLowerCase())
  );
  const filteredGroups = MOCK_GROUPS.filter((g) =>
    g.name.toLowerCase().includes(groupSearch.toLowerCase())
  );
  const filteredItems = MOCK_ITEMS.filter(
    (i) =>
      i.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
      i.code.includes(itemSearch)
  );

  // --- Handlers ---

  // 1. Handle Type Selection (Cascades to Items)
  const handleTypeSelect = (typeId: string, isSelected: boolean) => {
    const newTypes = new Set(selectedTypeIds);
    if (isSelected) newTypes.add(typeId);
    else newTypes.delete(typeId);
    setSelectedTypeIds(newTypes);

    // Auto-select items belonging to this Type
    const itemsOfType = MOCK_ITEMS.filter((i) => i.typeId === typeId);
    const newItems = new Set(selectedItemCodes);

    itemsOfType.forEach((item) => {
      if (isSelected) newItems.add(item.code);
      else {
        // Only uncheck if it's not also selected via a Group
        const isInSelectedGroup = MOCK_GROUPS.some(
          (g) => selectedGroupIds.has(g.id) && item.groupId === g.id
        );
        if (!isInSelectedGroup) newItems.delete(item.code);
      }
    });
    setSelectedItemCodes(newItems);
  };

  // 2. Handle Group Selection (Cascades to Items)
  const handleGroupSelect = (groupId: string, isSelected: boolean) => {
    const newGroups = new Set(selectedGroupIds);
    if (isSelected) newGroups.add(groupId);
    else newGroups.delete(groupId);
    setSelectedGroupIds(newGroups);

    // Auto-select items belonging to this Group
    const itemsOfGroup = MOCK_ITEMS.filter((i) => i.groupId === groupId);
    const newItems = new Set(selectedItemCodes);

    itemsOfGroup.forEach((item) => {
      if (isSelected) newItems.add(item.code);
      else {
        // Only uncheck if it's not also selected via a Type
        const isInSelectedType = MOCK_TYPES.some(
          (t) => selectedTypeIds.has(t.id) && item.typeId === t.id
        );
        if (!isInSelectedType) newItems.delete(item.code);
      }
    });
    setSelectedItemCodes(newItems);
  };

  // 3. Handle Manual Item Selection
  const handleItemSelect = (code: string, isSelected: boolean) => {
    const newItems = new Set(selectedItemCodes);
    if (isSelected) newItems.add(code);
    else newItems.delete(code);
    setSelectedItemCodes(newItems);
  };

  // --- Styles ---
  // Fixed dimensions as requested
  const modalStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1300px",
    height: "600px",
    zIndex: zIndex,
    backgroundColor: "white",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "sans-serif",
  };

  const rowStyle = "border-b border-gray-200 hover:bg-blue-50 text-sm";
  const cellStyle = "px-2 py-1.5 align-middle";

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ zIndex: zIndex - 1 }}
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Main Popup */}
      <div
        style={modalStyle}
        className="rounded-sm overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#164e78] text-white px-4 py-2 flex justify-between items-center shrink-0">
          <h2 className="font-semibold text-lg">Select Item</h2>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded">
            <X size={18} />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Promo on Level</span>
            <div className="relative w-64">
              <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500">
                <option>Item</option>
                <option>Group</option>
                <option>Category</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3 Column Layout */}
        <div className="flex flex-1 overflow-hidden p-4 gap-4 bg-white">
          {/* 1. Item Type Table */}
          <div className="flex-1 flex flex-col border border-gray-300">
            {/* Search */}
            <div className="p-2 border-b border-gray-200 relative">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 outline-none"
                value={typeSearch}
                onChange={(e) => setTypeSearch(e.target.value)}
              />
            </div>
            {/* Table Header */}
            <div className="flex bg-[#164e78] text-white">
              <div className="w-10 p-2 flex justify-center items-center border-r border-white/20">
                <input type="checkbox" className="cursor-pointer" />
              </div>
              <div className="flex-1 p-2 font-semibold text-sm">Item Type</div>
            </div>
            {/* Table Body */}
            <div className="flex-1 overflow-y-auto bg-white">
              {filteredTypes.map((type) => (
                <div key={type.id} className={`${rowStyle} flex`}>
                  <div className="w-10 flex justify-center items-center border-r border-gray-100">
                    <input
                      type="checkbox"
                      checked={selectedTypeIds.has(type.id)}
                      onChange={(e) =>
                        handleTypeSelect(type.id, e.target.checked)
                      }
                      className="cursor-pointer"
                    />
                  </div>
                  <div className={`${cellStyle} flex-1`}>{type.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Item Group Table */}
          <div className="flex-1 flex flex-col border border-gray-300">
            {/* Search */}
            <div className="p-2 border-b border-gray-200 relative">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 outline-none"
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
              />
            </div>
            {/* Header */}
            <div className="flex bg-[#164e78] text-white">
              <div className="w-10 p-2 flex justify-center items-center border-r border-white/20">
                <input type="checkbox" className="cursor-pointer" />
              </div>
              <div className="flex-1 p-2 font-semibold text-sm">Item Group</div>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-white">
              {filteredGroups.map((group) => (
                <div key={group.id} className={`${rowStyle} flex`}>
                  <div className="w-10 flex justify-center items-center border-r border-gray-100">
                    <input
                      type="checkbox"
                      checked={selectedGroupIds.has(group.id)}
                      onChange={(e) =>
                        handleGroupSelect(group.id, e.target.checked)
                      }
                      className="cursor-pointer"
                    />
                  </div>
                  <div className={`${cellStyle} flex-1`}>{group.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Items Table (Wider) */}
          <div className="flex-[1.5] flex flex-col border border-gray-300">
            {/* Search */}
            <div className="p-2 border-b border-gray-200 relative">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 outline-none"
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
              />
            </div>
            {/* Header */}
            <div className="flex bg-[#164e78] text-white">
              <div className="w-10 p-2 flex justify-center items-center border-r border-white/20">
                <input type="checkbox" className="cursor-pointer" />
              </div>
              <div className="w-24 p-2 font-semibold text-sm border-r border-white/20">
                Code
              </div>
              <div className="flex-1 p-2 font-semibold text-sm">Item name</div>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-white">
              {filteredItems.map((item) => (
                <div key={item.code} className={`${rowStyle} flex`}>
                  <div className="w-10 flex justify-center items-center border-r border-gray-100 shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedItemCodes.has(item.code)}
                      onChange={(e) =>
                        handleItemSelect(item.code, e.target.checked)
                      }
                      className="cursor-pointer"
                    />
                  </div>
                  <div
                    className={`${cellStyle} w-24 border-r border-gray-100 shrink-0`}
                  >
                    {item.code}
                  </div>
                  <div className={`${cellStyle} flex-1 truncate`}>
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination Placeholder */}
            <div className="bg-gray-100 border-t border-gray-300 p-1 flex justify-end">
              <div className="flex gap-1 text-xs">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className="px-2 py-1 hover:bg-gray-200 rounded"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#164e78] p-3 flex justify-between items-center shrink-0">
          <button
            onClick={onClose}
            className="bg-[#164e78] border border-white text-white px-6 py-1 text-sm hover:bg-blue-800 transition-colors"
          >
            Exit
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onSubmit(Array.from(selectedItemCodes))}
              className="bg-[#164e78] border border-white text-white px-6 py-1 text-sm hover:bg-blue-800 transition-colors"
            >
              OK
            </button>

            {/* Split Button for Import */}
            <div className="flex bg-[#164e78] border border-white text-white text-sm">
              <button className="px-4 py-1 hover:bg-blue-800 border-r border-white/30 flex gap-2 items-center">
                <Download size={14} /> Import
              </button>
              <button className="px-2 hover:bg-blue-800">
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectItemForPromotion;
