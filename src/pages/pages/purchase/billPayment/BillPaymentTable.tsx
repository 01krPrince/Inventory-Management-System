import React, { useState, useMemo } from "react";
import { Search, FileSpreadsheet } from "lucide-react";

// --- Types ---
export interface BillPaymentRow {
  id: string;
  billDate: string;
  partyBillNo: string;
  partyBillDate: string;
  dueDate: string;
  debitCreditNote: number;
  billAmountLC: number;
  outstanding: number;
  adjustNow: number; // Editable
  cashDiscount: number; // Editable
  netAmount: number;
  billBranch: string;
  billSubParty: string;
  taxable: number;
}

interface BillPaymentTableProps {
  rows: BillPaymentRow[];
  setRows: React.Dispatch<React.SetStateAction<BillPaymentRow[]>>;
}

// --- Column Definition ---
interface ColumnDef {
  id: keyof BillPaymentRow;
  label: string;
  width: string;
  align: "left" | "right" | "center";
  editable?: boolean;
}

const COLUMNS: ColumnDef[] = [
  { id: "billDate", label: "Bill Date", width: "100px", align: "left" },
  { id: "partyBillNo", label: "Party Bill No", width: "120px", align: "left" },
  {
    id: "partyBillDate",
    label: "Party Bill Date",
    width: "110px",
    align: "left",
  },
  { id: "dueDate", label: "Due Date", width: "100px", align: "left" },
  {
    id: "debitCreditNote",
    label: "Debit/Credit Note(₹)",
    width: "130px",
    align: "right",
  },
  {
    id: "billAmountLC",
    label: "Bill Amount LC (₹)",
    width: "130px",
    align: "right",
  },
  {
    id: "outstanding",
    label: "Outstanding (₹)",
    width: "120px",
    align: "right",
  },
  {
    id: "adjustNow",
    label: "Adjust Now(₹)",
    width: "120px",
    align: "right",
    editable: true,
  },
  {
    id: "cashDiscount",
    label: "Cash Discount(₹)",
    width: "120px",
    align: "right",
    editable: true,
  },
  { id: "netAmount", label: "Net Amount(₹)", width: "120px", align: "right" },
  { id: "billBranch", label: "Bill Branch", width: "100px", align: "left" },
  { id: "billSubParty", label: "Bill SubParty", width: "120px", align: "left" },
  { id: "taxable", label: "Taxable(₹)", width: "100px", align: "right" },
];

const BillPaymentTable: React.FC<BillPaymentTableProps> = ({
  rows = [],
  setRows,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // --- Handlers ---

  const handleInputChange = (
    id: string,
    field: keyof BillPaymentRow,
    value: string
  ) => {
    // Only allow numeric input for these fields
    if (
      (field === "adjustNow" || field === "cashDiscount") &&
      isNaN(Number(value))
    ) {
      return;
    }

    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: Number(value) };
          // Optional: Auto-calculate Net Amount logic can go here
          // e.g. updatedRow.netAmount = updatedRow.adjustNow;
          return updatedRow;
        }
        return row;
      })
    );
  };

  // --- Calculations ---

  const totals = useMemo(() => {
    const init = {
      debitCreditNote: 0,
      billAmountLC: 0,
      outstanding: 0,
      adjustNow: 0,
      cashDiscount: 0,
      netAmount: 0,
      taxable: 0,
    };

    return rows.reduce((acc, row) => {
      acc.debitCreditNote += row.debitCreditNote || 0;
      acc.billAmountLC += row.billAmountLC || 0;
      acc.outstanding += row.outstanding || 0;
      acc.adjustNow += row.adjustNow || 0;
      acc.cashDiscount += row.cashDiscount || 0;
      acc.netAmount += row.netAmount || 0;
      acc.taxable += row.taxable || 0;
      return acc;
    }, init);
  }, [rows]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="flex flex-col w-full h-full bg-white border border-gray-300 rounded shadow-sm overflow-hidden font-sans text-sm">
      {/* --- Top Toolbar --- */}
      <div className="flex items-center justify-end p-2 gap-2 border-b border-gray-200 bg-white">
        <button
          className="p-1.5 rounded hover:bg-gray-100 text-[#0f3c63] border border-[#0f3c63] transition-colors"
          title="Export to Excel"
        >
          <FileSpreadsheet size={18} />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-1 border border-gray-300 rounded text-xs w-64 focus:outline-none focus:border-[#0f3c63]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            size={14}
            className="absolute left-2.5 top-1.5 text-gray-400"
          />
        </div>
      </div>

      {/* --- Table Container --- */}
      <div className="flex-1 overflow-auto relative custom-scrollbar">
        <table
          className="w-full border-collapse table-fixed"
          style={{ minWidth: "1400px" }}
        >
          {/* Header */}
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#0f3c63] text-white h-8">
              {COLUMNS.map((col, index) => (
                <th
                  key={col.id}
                  style={{ width: col.width }}
                  className={`px-2 font-medium text-xs whitespace-nowrap border-r border-[#2a5a85] last:border-r-0 ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  }`}
                >
                  <div className="flex items-center justify-between h-full">
                    <span>{col.label}</span>
                    {index === COLUMNS.length - 1 && (
                      <span className="ml-1">↑</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {rows.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="h-40 text-center align-middle"
                >
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <span className="text-lg">No data</span>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              rows
                .filter((r) =>
                  r.partyBillNo.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((row) => (
                  <tr
                    key={row.id}
                    className="h-8 border-b border-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    {COLUMNS.map((col) => {
                      const value = row[col.id];
                      return (
                        <td
                          key={col.id}
                          className={`px-2 text-xs border-r border-gray-100 last:border-r-0 ${
                            col.align === "right"
                              ? "text-right"
                              : col.align === "center"
                              ? "text-center"
                              : "text-left"
                          }`}
                        >
                          {col.editable ? (
                            <input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                handleInputChange(
                                  row.id,
                                  col.id,
                                  e.target.value
                                )
                              }
                              className="w-full h-full bg-white border border-gray-300 rounded-sm px-1 text-right outline-none focus:ring-1 focus:ring-[#0f3c63]"
                            />
                          ) : (
                            <span className="text-gray-700">
                              {typeof value === "number" &&
                              col.id !== "partyBillNo" // exclude non-currency numbers if any
                                ? formatCurrency(value)
                                : value}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
            )}
          </tbody>

          {/* Footer (Sticky Bottom) */}
          <tfoot className="sticky bottom-0 z-10 bg-gray-50 border-t border-gray-300 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
            <tr className="h-9">
              {COLUMNS.map((col) => {
                // Determine what to show in footer
                let content: React.ReactNode = null;

                switch (col.id) {
                  case "debitCreditNote":
                    content = `₹${formatCurrency(totals.debitCreditNote)}`;
                    break;
                  case "billAmountLC":
                    content = `₹${formatCurrency(totals.billAmountLC)}`;
                    break;
                  case "outstanding":
                    content = `₹${formatCurrency(totals.outstanding)}`;
                    break;
                  case "adjustNow":
                    content = `₹${formatCurrency(totals.adjustNow)}`;
                    break;
                  case "cashDiscount":
                    content = `₹${formatCurrency(totals.cashDiscount)}`;
                    break;
                  case "netAmount":
                    content = `₹${formatCurrency(totals.netAmount)}`;
                    break;
                  case "taxable":
                    // If you want taxable total
                    // content = `₹${formatCurrency(totals.taxable)}`;
                    break;
                  default:
                    content = null;
                }

                return (
                  <td
                    key={col.id}
                    className={`px-2 text-xs font-bold text-gray-600 border-r border-gray-200 ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8; 
        }
      `}</style>
    </div>
  );
};

export default BillPaymentTable;
