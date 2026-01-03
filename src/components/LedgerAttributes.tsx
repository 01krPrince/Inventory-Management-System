import React from "react";
import { EditIcon } from "lucide-react";
import Dropdown, { ColumnDef } from "./Dropdown"; // Assuming Dropdown is in the same folder

// --- Types ---
export interface LedgerData {
  employee: string;
  group: string;
}

// --- Props (Made Optional) ---
interface LedgerAttributesProps {
  themeColor?: string;
  data?: LedgerData; // <--- Made Optional (?)
  onChange?: (data: LedgerData) => void; // <--- Made Optional (?)
}

// --- Mock Data for Dropdowns ---
const EMPLOYEES = [
  { id: "E001", name: "Amit Sharma", department: "Logistics" },
  { id: "E002", name: "Rahul Verma", department: "Accounts" },
  { id: "E003", name: "Priya Singh", department: "Sales" },
];

const GROUPS = [
  { code: "G001", name: "North Zone Sales" },
  { code: "G002", name: "Export Division" },
  { code: "G003", name: "Local Handling" },
];

// --- Columns Definition for Dropdown ---
const employeeColumns: ColumnDef<any>[] = [
  { header: "ID", key: "id", width: "w-16" },
  { header: "Name", key: "name", width: "flex-1" },
];

const groupColumns: ColumnDef<any>[] = [
  { header: "Code", key: "code", width: "w-16" },
  { header: "Group Name", key: "name", width: "flex-1" },
];

const ActionBtn: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  themeColor: string;
}> = ({ icon, onClick, themeColor }) => (
  <button
    type="button"
    onClick={onClick}
    style={{ backgroundColor: themeColor, borderColor: themeColor }}
    className="h-[30px] w-[30px] text-white flex items-center justify-center rounded-sm border hover:opacity-90 transition-opacity flex-shrink-0 shadow-sm"
  >
    {icon}
  </button>
);

const LedgerAttributes: React.FC<LedgerAttributesProps> = ({
  themeColor = "#0f3c63",
  data,
  onChange,
}) => {
  // Safety Check: Agar data undefined hai, toh empty values use karo
  const safeData = data || { employee: "", group: "" };

  // Handlers to update state
  const handleEmployeeChange = (item: any) => {
    // Only call onChange if it exists
    if (onChange) {
      onChange({ ...safeData, employee: item ? item.name : "" });
    }
  };

  const handleGroupChange = (item: any) => {
    // Only call onChange if it exists
    if (onChange) {
      onChange({ ...safeData, group: item ? item.name : "" });
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-4 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Financial Posting (Ledger) Attributes{" "}
        <span className="text-xs font-normal text-gray-500">
          - Select if applicable
        </span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Employee Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Dropdown
              data={EMPLOYEES}
              columns={employeeColumns}
              value={safeData.employee} // Use safeData
              valueKey="name"
              onChange={handleEmployeeChange}
              placeholder="Select Employee..."
            />
          </div>
          <ActionBtn icon={<EditIcon size={14} />} themeColor={themeColor} />
        </div>

        {/* Group Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Dropdown
              data={GROUPS}
              columns={groupColumns}
              value={safeData.group} // Use safeData
              valueKey="name"
              onChange={handleGroupChange}
              placeholder="Select Group..."
            />
          </div>
          <ActionBtn icon={<EditIcon size={14} />} themeColor={themeColor} />
        </div>
      </div>
    </div>
  );
};

export default LedgerAttributes;
