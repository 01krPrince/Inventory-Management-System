import { Search, Printer, Download, FileText, ZoomIn, Filter } from 'lucide-react';

export default function ProfitLossStatementLocationWise() {
  const locations = [
    'CHANDAN K...',
    'GODOWN',
    'INVENTORY',
    '',
    'Closing_5(₹)',
    'Closing_6(₹)',
    'Closing_7(₹)',
    'Closing_8(₹)',
    'Closing_9(₹)',
    'Closing_10(₹)',
  ];

  return (
    <div className="flex h-screen flex-col bg-[#f8fafc] font-sans">
      <div className="no-print flex items-center justify-between border-b bg-white p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="rounded bg-blue-50 p-1.5">
            <FileText className="size-4 text-[#0c5888]" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-none text-gray-800">Profit & Loss Account</h2>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-tighter text-gray-400">
              Location Wise Financial Statement
            </p>
          </div>
          <div className="mx-2 h-6 w-[1px] bg-gray-200" />
          <button className="flex items-center gap-1.5 rounded bg-[#0c5888] px-3 py-1.5 text-[10px] font-bold uppercase text-white shadow-sm hover:bg-[#09466d]">
            <Printer size={12} /> Print
          </button>
          <button className="flex items-center gap-1.5 rounded border border-gray-200 px-3 py-1.5 text-[10px] font-bold uppercase text-gray-600 hover:bg-gray-50">
            <Download size={12} /> Export
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2 text-gray-400" size={13} />
          <input
            type="text"
            placeholder="Search particulars..."
            className="w-72 rounded border border-gray-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="shadow-inner relative m-2 flex-grow overflow-auto rounded border border-gray-300 bg-white">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-30">
            <tr className="bg-[#084164] text-[9px] uppercase tracking-widest text-white">
              <th className="w-10 border-r border-white/10 px-2 py-1 text-center">Zoom</th>
              <th className="w-80 border-r border-white/10 px-2 py-1 text-center">Voucher</th>
              <th className="px-2 py-1 text-center" colSpan={locations.length + 1}>
                Location
              </th>
            </tr>

            <tr className="bg-[#0c5888] text-[10px] font-bold uppercase text-white">
              <th className="sticky top-6 z-20 border-r border-white/10 bg-[#0c5888] px-2 py-1.5"></th>

              <th className="sticky top-6 z-20 border-r border-white/10 bg-[#0c5888] px-2 py-1.5">
                <div className="flex items-center justify-between">
                  <span>Name</span>
                  <Filter size={10} className="opacity-50" />
                </div>
              </th>
              <th className="sticky top-6 z-20 w-28 border-r border-white/10 bg-[#0c5888] px-2 py-1.5">
                <div className="flex items-center justify-between">
                  <span>Code</span>
                  <Filter size={10} className="opacity-50" />
                </div>
              </th>

              {locations.map((loc, index) => (
                <th
                  key={index}
                  className="sticky top-6 z-20 min-w-[100px] border-r border-white/10 bg-[#0c5888] px-2 py-1.5 text-right font-mono">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate">{loc}</span>
                    {loc && <Filter size={10} className="opacity-50" />}
                  </div>
                </th>
              ))}

              <th className="sticky top-6 z-20 w-32 bg-[#0c5888] px-2 py-1.5 text-right">
                Total(₹)
              </th>
            </tr>
          </thead>

          <tbody className="text-[11px]">
            <tr className="border-b transition-colors hover:bg-gray-50">
              <td className="border-r p-1.5 text-center">
                <ZoomIn
                  size={14}
                  className="mx-auto cursor-pointer text-blue-600 hover:text-blue-800"
                />
              </td>
              <td className="border-r px-4 py-2 font-medium text-gray-700">
                Opening Stock-In-Trade-P&L
              </td>
              <td className="border-r px-2 py-2 font-mono text-gray-500">41300002</td>
              <td className="border-r px-2 py-2 text-right font-mono">₹2,28,845.99</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="border-r px-2 py-2 text-right font-mono">₹18,91,710.35</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="bg-gray-50 px-2 py-2 text-right font-bold text-gray-800">
                ₹21,20,556.34
              </td>
            </tr>

            <tr className="border-b transition-colors hover:bg-gray-50">
              <td className="border-r p-1.5 text-center">
                <ZoomIn
                  size={14}
                  className="mx-auto cursor-pointer text-blue-600 hover:text-blue-800"
                />
              </td>
              <td className="border-r px-4 py-2 font-medium text-gray-700">
                Closing Stock-In-Trade
              </td>
              <td className="border-r px-2 py-2 font-mono text-gray-500">41370001</td>
              <td className="border-r px-2 py-2 text-right font-mono">(2,28,845.99)</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="border-r px-2 py-2 text-right font-mono">(18,91,710.35)</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="border-r px-2 py-2 text-right font-mono text-gray-400">₹0.00</td>
              <td className="bg-gray-50 px-2 py-2 text-right font-bold text-gray-800">
                (21,20,556.34)
              </td>
            </tr>

            <tr className="sticky bottom-0 bg-gray-100 font-bold uppercase tracking-tight text-[#0c5888]">
              <td className="border-r px-2 py-1.5 text-center"></td>
              <td className="border-r px-4 py-1.5">Total</td>
              <td className="border-r px-2 py-1.5"></td>
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <td key={i} className="border-r px-2 py-1.5 text-right font-mono">
                    ₹0.00
                  </td>
                ))}
              <td className="bg-blue-50 px-2 py-1.5 text-right font-mono">₹0.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="no-print border-t bg-white p-2 px-4 shadow-sm">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <span>Statement Type: Location-wise P&L</span>
          <span className="text-[#0c5888]">Currency: INR (₹)</span>
        </div>
      </div>
    </div>
  );
}
