import { Search, FileSpreadsheet } from 'lucide-react';

const BillSettlementTable = () => {
  // Headers based on your screenshot
  const columns = [
    'Bill No',
    'Bill Date',
    'Due Date',
    'Debit/C...',
    'Bill Amount LC (₹)',
    'Outstanding (₹)',
    'Adjust Now(₹)',
    'Cash Discount(₹)',
    'Net Amount(₹)',
    'Ref No',
    'Ref.Date',
    'Bill Branch',
    'Bill SubParty',
  ];

  return (
    <div className="flex w-full flex-col border border-gray-300 bg-white font-sans">
      {/* Search Bar Area */}
      <div className="flex items-center justify-end gap-4 bg-white p-2">
        <FileSpreadsheet size={20} className="cursor-pointer text-blue-900" />
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded border border-gray-300 py-1 pl-2 pr-8 text-sm outline-none"
          />
          <Search size={16} className="absolute right-2 top-1.5 text-gray-400" />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#004d80]">
              {' '}
              {/* Dark blue header color */}
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="whitespace-nowrap border-r border-blue-800 px-2 py-1.5 text-left text-xs font-semibold text-white">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* "No Data" Row mimicking your screenshot */}
            <tr className="h-64">
              <td colSpan={columns.length} className="text-center text-sm text-gray-400">
                No data
              </td>
            </tr>
          </tbody>
          {/* Footer with Totals */}
          <tfoot className="border-t-4 border-gray-200">
            <tr className="bg-white">
              <td colSpan={4}></td>
              <td className="px-2 py-2 text-right text-xs font-bold text-gray-700">₹0.00</td>
              <td className="px-2 py-2 text-right text-xs font-bold text-gray-700">₹0.00</td>
              <td className="px-2 py-2 text-right text-xs font-bold text-gray-700">₹0.00</td>
              <td className="px-2 py-2 text-right text-xs font-bold text-gray-700">₹0.00</td>
              <td className="px-2 py-2 text-right text-xs font-bold text-gray-700">₹0.00</td>
              <td colSpan={4}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Bottom Balance Bar */}
      <div className="border-t border-gray-200 bg-gray-50 p-3">
        <p className="text-xs font-bold text-[#004d80]">
          Current Balance of--+2 GOVT GIRLS ₹0.00 :: Axis Bank -₹70,339.00
        </p>
      </div>
    </div>
  );
};

export default BillSettlementTable;
