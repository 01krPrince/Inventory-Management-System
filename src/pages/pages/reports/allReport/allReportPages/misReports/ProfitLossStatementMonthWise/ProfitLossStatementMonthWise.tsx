import { useState, useMemo, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Printer,
  Download,
  Eye,
  Filter,
  TrendingUp,
  Loader2,
  RefreshCw,
} from 'lucide-react';

type MonthlyValues = {
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  jan: number;
  feb: number;
  mar: number;
};

type PLMonthNode = {
  id: string;
  name: string;
  code: string;
  type: 'group' | 'ledger';
  values: MonthlyValues;
  children?: PLMonthNode[];
  level?: number;
};

const formatCurrency = (amount: number) => {
  if (amount === 0) return '₹0.00';
  const absAmount = Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `(${absAmount})` : `${absAmount}`;
};

const generateMockData = (): PLMonthNode[] => {
  const zeroMonths = {
    apr: 0,
    may: 0,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0,
    oct: 0,
    nov: 0,
    dec: 0,
    jan: 0,
    feb: 0,
    mar: 0,
  };

  return [
    {
      id: 'EXP-DIRECT',
      name: 'Direct Operational Expenses',
      code: '41000000',
      type: 'group',
      values: { ...zeroMonths, feb: 2120556.34 },
      children: [
        {
          id: 'EXP-CHANGE-INV',
          name: 'Change In Inventory',
          code: '41300000',
          type: 'group',
          values: { ...zeroMonths, feb: 0 },
          children: [
            {
              id: 'L-41300002',
              name: 'Opening Stock-In-Trade-P&L',
              code: '41300002',
              type: 'ledger',
              values: { ...zeroMonths, feb: 2120556.34 },
            },
            {
              id: 'L-41370001',
              name: 'Closing Stock-In-Trade',
              code: '41370001',
              type: 'ledger',
              values: { ...zeroMonths, feb: -2120556.34 },
            },
          ],
        },
        {
          id: 'EXP-PURCH',
          name: 'Purchases',
          code: '41200000',
          type: 'group',
          values: { ...zeroMonths, apr: 50000, may: 55000, jun: 48000 },
          children: [],
        },
      ],
    },
    {
      id: 'INC-REV',
      name: 'Revenue From Operations',
      code: '31000000',
      type: 'group',
      values: { ...zeroMonths, apr: 120000, may: 150000, jun: 110000 },
      children: [
        {
          id: 'INC-SALES',
          name: 'Sales Accounts',
          code: '31120001',
          type: 'ledger',
          values: { ...zeroMonths, apr: 120000, may: 150000, jun: 110000 },
        },
      ],
    },
    {
      id: 'EXP-INDIRECT',
      name: 'Indirect Expenses',
      code: '42000000',
      type: 'group',
      values: { ...zeroMonths, apr: 15000, may: 15000, jun: 18000, feb: 7500 },
      children: [
        {
          id: 'L-42110002',
          name: 'Salaries & Wages',
          code: '42110002',
          type: 'ledger',
          values: { ...zeroMonths, apr: 15000, may: 15000, jun: 15000, feb: 7500 },
        },
        {
          id: 'L-42210008',
          name: 'Electricity Expenses',
          code: '42210008',
          type: 'ledger',
          values: { ...zeroMonths, jun: 3000 },
        },
      ],
    },
  ];
};

const flattenTree = (
  nodes: PLMonthNode[],
  expandedIds: Record<string, boolean>,
  level: number = 0
): PLMonthNode[] => {
  let flat: PLMonthNode[] = [];
  nodes.forEach((node) => {
    flat.push({ ...node, level });
    if (expandedIds[node.id] && node.children && node.children.length > 0) {
      flat = flat.concat(flattenTree(node.children, expandedIds, level + 1));
    }
  });
  return flat;
};

export default function ProfitLossStatementMonthWise() {
  const [data, setData] = useState<PLMonthNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filterStore, setFilterStore] = useState('00002');
  const [dateRange] = useState({ from: '2026-02-13', to: '2026-02-13' });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(generateMockData());
      setExpanded({ 'EXP-DIRECT': true, 'EXP-CHANGE-INV': true });
      setLoading(false);
    }, 600);
  }, []);

  const toggleRow = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleRows = useMemo(() => flattenTree(data, expanded), [data, expanded]);

  const totals = useMemo(() => {
    const sum = {
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      jan: 0,
      feb: 0,
      mar: 0,
      total: 0,
    };
    visibleRows.forEach((row) => {
      if (row.level === 0) {
        Object.keys(row.values).forEach((key) => {
          const k = key as keyof MonthlyValues;
          sum[k] += row.values[k];
        });
        const rowTotal = Object.values(row.values).reduce((a, b) => a + b, 0);
        sum.total += rowTotal;
      }
    });
    return sum;
  }, [visibleRows]);

  const HeaderCell = ({ label, showFilter = true, align = 'right', className = '' }: any) => (
    <div
      className={`flex items-center ${align === 'right' ? 'justify-end' : 'justify-between'} h-full gap-1 px-2 ${className}`}>
      <span className="whitespace-nowrap">{label}</span>
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
              <TrendingUp size={18} />
            </div>
            <div>
              <h1 className="font-bold leading-none text-gray-800">P&L Month Wise</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Period: {dateRange.from} To {dateRange.to}
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

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded border bg-gray-50 px-2 py-1">
              <span className="text-[10px] font-bold uppercase text-gray-500">Store:</span>
              <input
                value={filterStore}
                onChange={(e) => setFilterStore(e.target.value)}
                className="w-16 bg-transparent font-mono text-xs outline-none"
              />
            </div>
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 500);
              }}
              className="rounded bg-gray-800 p-1.5 text-white hover:bg-black">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="shadow-inner relative m-2 flex-grow overflow-auto rounded border bg-white">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <Loader2 className="mb-2 animate-spin text-[#0c5888]" size={32} />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Loading Monthly Data...
            </span>
          </div>
        )}

        <table className="w-full min-w-[1600px] border-collapse text-left">
          <thead className="sticky top-0 z-30 bg-[#084164] text-[10px] font-bold uppercase text-white shadow-md">
            <tr className="border-b border-white/10">
              <th className="sticky left-0 z-40 w-10 border-r border-white/10 bg-[#084164] py-1 text-center">
                Zoom
              </th>
              <th
                className="sticky left-10 z-40 border-r border-white/10 bg-[#084164] px-2 text-left"
                colSpan={2}>
                Voucher
              </th>
              <th className="border-r border-white/10 px-2 text-left" colSpan={13}>
                Closing
              </th>
              <th className="w-full bg-[#084164]">-</th>
            </tr>

            <tr className="h-8 bg-[#0c5888]">
              <th className="sticky left-0 z-40 w-10 border-r border-white/10 bg-[#0c5888]"></th>
              <th className="sticky left-10 z-40 min-w-[250px] border-r border-white/10 bg-[#0c5888] p-0">
                <HeaderCell label="Name" align="left" />
              </th>
              <th className="sticky left-[290px] z-40 w-24 border-r border-white/10 bg-[#0c5888] p-0 shadow-[4px_0_5px_-2px_rgba(0,0,0,0.3)]">
                <HeaderCell label="Code" align="left" />
              </th>

              {[
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
                'Jan',
                'Feb',
                'Mar',
              ].map((m) => (
                <th key={m} className="w-28 border-r border-white/10 p-0">
                  <HeaderCell label={`${m}(₹)`} />
                </th>
              ))}

              <th className="w-32 border-r border-white/10 bg-[#0a4e7a] p-0">
                <HeaderCell label="Closing Total..." />
              </th>

              <th className="bg-[#0c5888]"></th>
            </tr>
          </thead>

          <tbody className="text-[11px] text-gray-700">
            {visibleRows.length > 0
              ? visibleRows.map((row, idx) => {
                  const rowTotal = Object.values(row.values).reduce((a, b) => a + b, 0);

                  return (
                    <tr
                      key={`${row.id}-${idx}`}
                      className="group h-7 border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                      <td className="sticky left-0 z-20 w-10 border-r border-gray-200 bg-gray-50 text-center group-hover:bg-blue-100/50">
                        <Eye
                          size={12}
                          className={`mx-auto cursor-pointer text-blue-600 ${row.type === 'ledger' ? 'opacity-100' : 'opacity-0'}`}
                        />
                      </td>

                      <td className="sticky left-10 z-20 border-r border-gray-200 bg-white px-2 align-middle group-hover:bg-blue-50/50">
                        <div
                          className="flex items-center gap-1"
                          style={{ paddingLeft: `${(row.level || 0) * 15}px` }}>
                          {row.children && row.children.length > 0 ? (
                            <button
                              onClick={() => toggleRow(row.id)}
                              className="shrink-0 focus:outline-none">
                              {expanded[row.id] ? (
                                <ChevronDown size={12} className="text-gray-500" />
                              ) : (
                                <ChevronRight size={12} className="text-gray-500" />
                              )}
                            </button>
                          ) : (
                            <span className="w-3 shrink-0" />
                          )}
                          <span
                            className={`truncate ${row.level === 0 ? 'font-bold text-[#0c5888]' : ''}`}>
                            {row.name}
                          </span>
                        </div>
                      </td>

                      <td className="sticky left-[290px] z-20 border-r border-gray-200 bg-white px-2 align-middle font-mono text-[10px] text-gray-500 shadow-[4px_0_5px_-2px_rgba(0,0,0,0.1)] group-hover:bg-blue-50/50">
                        {row.code}
                      </td>

                      {[
                        'apr',
                        'may',
                        'jun',
                        'jul',
                        'aug',
                        'sep',
                        'oct',
                        'nov',
                        'dec',
                        'jan',
                        'feb',
                        'mar',
                      ].map((key) => {
                        const val = row.values[key as keyof MonthlyValues];
                        return (
                          <td
                            key={key}
                            className="border-r border-gray-200 px-2 text-right align-middle font-mono">
                            {val !== 0 ? (
                              formatCurrency(val)
                            ) : (
                              <span className="text-gray-300">₹0.00</span>
                            )}
                          </td>
                        );
                      })}

                      <td className="border-r border-gray-200 bg-gray-50/30 px-2 text-right align-middle font-mono font-bold text-gray-900">
                        {formatCurrency(rowTotal)}
                      </td>

                      <td></td>
                    </tr>
                  );
                })
              : !loading && (
                  <tr>
                    <td colSpan={16} className="py-10 text-center italic text-gray-400">
                      No records found for this period.
                    </td>
                  </tr>
                )}
          </tbody>

          {visibleRows.length > 0 && (
            <tfoot className="sticky bottom-0 z-30 border-t-2 border-white/20 bg-[#0c5888] text-[11px] font-bold text-white shadow-lg">
              <tr className="h-8">
                <td className="sticky left-0 z-40 border-r border-white/10 bg-[#0c5888]"></td>
                <td
                  className="sticky left-10 z-40 border-r border-white/10 bg-[#0c5888] px-2 text-right uppercase tracking-wider"
                  colSpan={2}>
                  Grand Totals:
                </td>

                {[
                  'apr',
                  'may',
                  'jun',
                  'jul',
                  'aug',
                  'sep',
                  'oct',
                  'nov',
                  'dec',
                  'jan',
                  'feb',
                  'mar',
                ].map((key) => (
                  <td key={key} className="border-r border-white/10 px-2 text-right font-mono">
                    {formatCurrency(totals[key as keyof MonthlyValues])}
                  </td>
                ))}

                <td className="border-r border-white/10 bg-[#0a4e7a] px-2 text-right font-mono text-yellow-300">
                  {formatCurrency(totals.total)}
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
