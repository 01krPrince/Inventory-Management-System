import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Printer,
  Download,
  Filter,
  Landmark,
  Loader2,
  Calendar,
  Building2,
  RefreshCw,
  Eye,
} from 'lucide-react';

type BRSItem = {
  id: string;
  ledger: string;
  party: string;
  chequeNo: string;
  date: string;
  amount: number;
  status: 'cleared' | 'pending';
};

const formatCurrency = (amount: number) => {
  if (amount === 0) return '₹0.00';
  const absAmount = Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `(${absAmount})` : `${absAmount}`;
};

const generateMockData = (): BRSItem[] => {
  return [
    {
      id: '1',
      ledger: 'HDFC Bank A/c',
      party: 'ABC Traders',
      chequeNo: '001234',
      date: '2026-02-10',
      amount: 50000,
      status: 'pending',
    },
    {
      id: '2',
      ledger: 'HDFC Bank A/c',
      party: 'XYZ Suppliers',
      chequeNo: '001235',
      date: '2026-02-11',
      amount: -25000,
      status: 'pending',
    },
    {
      id: '3',
      ledger: 'SBI Current A/c',
      party: 'Global Tech Solutions',
      chequeNo: 'NEFT-889',
      date: '2026-02-12',
      amount: 120000,
      status: 'cleared',
    },
    {
      id: '4',
      ledger: 'SBI Current A/c',
      party: 'Office Rent',
      chequeNo: '005678',
      date: '2026-02-01',
      amount: -15000,
      status: 'pending',
    },
    {
      id: '5',
      ledger: 'Cash Deposit',
      party: 'Self',
      chequeNo: '-',
      date: '2026-02-13',
      amount: 200000,
      status: 'cleared',
    },
  ];
};

export default function BankReconciliationStatement() {
  const [data, setData] = useState<BRSItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStore, setFilterStore] = useState('00002');
  const [dateRange, setDateRange] = useState({ from: '2026-02-01', to: '2026-02-28' });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 600);
  }, []);

  const totalAmount = useMemo(() => data.reduce((sum, item) => sum + item.amount, 0), [data]);

  const HeaderCell = ({ label, showFilter = true, align = 'left', className = '' }: any) => (
    <div
      className={`flex items-center ${align === 'right' ? 'justify-end' : 'justify-between'} h-full gap-1 px-2 ${className}`}>
      <span className="truncate leading-none">{label}</span>
      {showFilter && (
        <Filter size={10} className="shrink-0 cursor-pointer text-white/50 hover:text-white" />
      )}
    </div>
  );

  return (
    <div className="flex h-screen select-none flex-col overflow-hidden bg-[#f8fafc] font-sans text-sm">
      <div className="no-print flex shrink-0 flex-col border-b bg-white shadow-sm">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <div className="rounded bg-blue-50 p-1.5 text-[#0c5888]">
              <Landmark size={18} />
            </div>
            <div>
              <h1 className="font-bold leading-none text-gray-800">Bank Reconciliation</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Statement View
              </span>
            </div>
            <div className="mx-2 h-6 w-[1px] bg-gray-200" />
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded bg-[#0c5888] px-3 py-1.5 text-[10px] font-bold uppercase text-white shadow-sm hover:bg-[#09466d]">
              <Printer size={12} /> Print
            </button>
            <button className="flex items-center gap-1.5 rounded border border-gray-200 px-3 py-1.5 text-[10px] font-bold uppercase text-gray-600 hover:bg-gray-50">
              <Download size={12} /> Excel
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2 text-gray-400" size={13} />
            <input
              type="text"
              placeholder="Search transaction..."
              className="w-64 rounded border border-gray-200 py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#0c5888]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 border-t bg-gray-50/50 px-3 py-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <Building2 size={12} className="text-gray-400" />
            <span className="font-bold uppercase text-gray-500">Store:</span>
            <input
              value={filterStore}
              onChange={(e) => setFilterStore(e.target.value)}
              className="w-20 rounded border border-gray-300 bg-white px-2 py-0.5"
            />
          </div>
          <div className="h-4 w-[1px] bg-gray-300" />
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-gray-400" />
            <span className="font-bold uppercase text-gray-500">Period:</span>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="rounded border border-gray-300 bg-white px-2 py-0.5 text-[10px]"
            />
            <span>-</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="rounded border border-gray-300 bg-white px-2 py-0.5 text-[10px]"
            />
          </div>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 500);
            }}
            className="ml-auto rounded bg-gray-800 p-1.5 text-white hover:bg-black">
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      <div className="shadow-inner relative m-2 flex-grow overflow-auto rounded border bg-white">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <Loader2 className="mb-2 animate-spin text-[#0c5888]" size={32} />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Loading Transactions...
            </span>
          </div>
        )}

        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead className="sticky top-0 z-30 bg-[#084164] text-[10px] font-bold uppercase text-white shadow-md">
            <tr className="border-b border-white/10">
              <th className="sticky left-0 z-40 w-10 border-r border-white/10 bg-[#084164] py-1 text-center">
                Zoom
              </th>
              <th className="w-[60%] border-r border-white/10 px-2 text-left" colSpan={5}>
                -
              </th>
              <th className="w-full bg-[#084164]"></th>
            </tr>

            <tr className="h-8 bg-[#0c5888]">
              <th className="sticky left-0 z-40 w-10 border-r border-white/10 bg-[#0c5888]"></th>
              <th className="w-[30%] border-r border-white/10 p-0">
                <HeaderCell label="Ledger" align="left" />
              </th>
              <th className="w-[25%] border-r border-white/10 p-0">
                <HeaderCell label="Party" align="left" />
              </th>
              <th className="w-[15%] border-r border-white/10 p-0">
                <HeaderCell label="Cheque No" align="left" />
              </th>
              <th className="w-[15%] border-r border-white/10 p-0">
                <HeaderCell label="Date" align="left" />
              </th>
              <th className="w-[15%] border-r border-white/10 bg-[#0a4e7a] p-0">
                <HeaderCell label="Amount(₹)" align="right" />
              </th>
              <th className="bg-[#0c5888]"></th>
            </tr>
          </thead>

          <tbody className="text-[11px] text-gray-700">
            {data.length > 0
              ? data.map((row) => (
                  <tr
                    key={row.id}
                    className="group h-7 border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                    <td className="sticky left-0 z-20 w-10 border-r border-gray-200 bg-gray-50 text-center group-hover:bg-blue-100/50">
                      <Eye
                        size={12}
                        className="mx-auto cursor-pointer text-blue-600 opacity-0 group-hover:opacity-100"
                      />
                    </td>

                    <td className="border-r border-gray-200 px-2 align-middle font-medium text-[#0c5888]">
                      {row.ledger}
                    </td>
                    <td className="border-r border-gray-200 px-2 align-middle text-gray-600">
                      {row.party}
                    </td>
                    <td className="border-r border-gray-200 px-2 align-middle font-mono text-gray-500">
                      {row.chequeNo}
                    </td>
                    <td className="border-r border-gray-200 px-2 align-middle text-gray-600">
                      {row.date}
                    </td>
                    <td className="border-r border-gray-200 bg-gray-50/30 px-2 text-right align-middle font-mono font-bold">
                      <span className={row.amount < 0 ? 'text-red-500' : 'text-green-700'}>
                        {formatCurrency(row.amount)}
                      </span>
                    </td>

                    <td></td>
                  </tr>
                ))
              : !loading && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center italic text-gray-400">
                      No reconciliation items found.
                    </td>
                  </tr>
                )}

            {!loading &&
              data.length < 10 &&
              Array.from({ length: 10 - data.length }).map((_, i) => (
                <tr key={`fill-${i}`} className="h-7 border-b border-gray-50">
                  <td colSpan={7}></td>
                </tr>
              ))}
          </tbody>

          {data.length > 0 && (
            <tfoot className="sticky bottom-0 z-30 border-t-2 border-white/20 bg-[#0c5888] text-[11px] font-bold text-white shadow-lg">
              <tr className="h-8">
                <td className="sticky left-0 z-40 border-r border-white/10 bg-[#0c5888]"></td>
                <td
                  className="border-r border-white/10 px-2 text-right uppercase tracking-wider"
                  colSpan={4}>
                  Total Unreconciled Amount:
                </td>
                <td className="border-r border-white/10 bg-[#0a4e7a] px-2 text-right font-mono text-yellow-300">
                  {formatCurrency(totalAmount)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .overflow-auto { overflow: visible !important; height: auto !important; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
        }
      `}</style>
    </div>
  );
}
