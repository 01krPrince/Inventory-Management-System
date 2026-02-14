import { useState, useMemo, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Printer,
  Download,
  Eye,
  Filter,
  TrendingUp,
  Loader2,
  Calendar,
  Building2,
} from 'lucide-react';

type PLNode = {
  id: string;
  name: string;
  code: string;
  amount: number;
  children?: PLNode[];
  level?: number;
};

const generateMockData = () => {
  const expenses: PLNode[] = [
    {
      id: 'EXP-ROOT',
      name: 'Expenses',
      code: '40000000',
      amount: 8722807.13,
      children: [
        {
          id: 'EXP-DIRECT',
          name: 'Direct Operational Expenses',
          code: '41000000',
          amount: 5437727.99,
          children: [
            {
              id: 'EXP-PURCH',
              name: 'Purchases',
              code: '41200000',
              amount: 6448665.84,
              children: [
                {
                  id: 'EXP-TRADED',
                  name: 'Purchase Traded Goods',
                  code: '41210000',
                  amount: 6448665.84,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: 'EXP-INDIRECT',
          name: 'Indirect Expenses',
          code: '42000000',
          amount: 3285079.14,
          children: [
            {
              id: 'EXP-ADMIN',
              name: 'Administrative Expenses',
              code: '42100000',
              amount: 1200000.0,
              children: [],
            },
          ],
        },
      ],
    },
  ];

  // Income Tree
  const income: PLNode[] = [
    {
      id: 'INC-ROOT',
      name: 'Income',
      code: '30000000',
      amount: 8722807.13,
      children: [
        {
          id: 'INC-REV',
          name: 'Revenue From Operations',
          code: '31000000',
          amount: 8722807.13,
          children: [
            {
              id: 'INC-TURN',
              name: 'Turnover (Goods & Services)',
              code: '31100000',
              amount: 8729171.59,
              children: [
                {
                  id: 'INC-SALES',
                  name: 'Sales Traded Goods',
                  code: '31120000',
                  amount: 8729171.59,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: 'INC-OTHER',
          name: 'Other Income',
          code: '32000000',
          amount: 0.0,
          children: [],
        },
      ],
    },
  ];

  return { expenses, income };
};

const flattenTree = (
  nodes: PLNode[],
  expandedIds: Record<string, boolean>,
  level: number = 0
): PLNode[] => {
  let flat: PLNode[] = [];
  nodes.forEach((node) => {
    flat.push({ ...node, level });

    if (expandedIds[node.id] && node.children && node.children.length > 0) {
      flat = flat.concat(flattenTree(node.children, expandedIds, level + 1));
    }
  });
  return flat;
};

export default function ProfitLossStatementTView() {
  const [data, setData] = useState<{ expenses: PLNode[]; income: PLNode[] }>({
    expenses: [],
    income: [],
  });
  const [loading, setLoading] = useState(false);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'EXP-ROOT': true,
    'INC-ROOT': true,
    'EXP-DIRECT': true,
    'INC-REV': true,
    'EXP-PURCH': true,
    'INC-TURN': true,
  });

  const [filterStore, setFilterStore] = useState('00002');
  const [dateRange, setDateRange] = useState({ from: '2025-04-01', to: '2026-03-31' });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 600);
  }, []);

  const toggleRow = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleExpenses = useMemo(
    () => flattenTree(data.expenses, expanded),
    [data.expenses, expanded]
  );

  const visibleIncome = useMemo(() => flattenTree(data.income, expanded), [data.income, expanded]);

  const totalRows = Math.max(visibleExpenses.length, visibleIncome.length);

  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < totalRows; i++) {
      result.push({
        expense: visibleExpenses[i] || null,
        income: visibleIncome[i] || null,
      });
    }
    return result;
  }, [visibleExpenses, visibleIncome, totalRows]);

  const HeaderCell = ({ label, width, align = 'left', filter = false }: any) => (
    <div
      className={`flex items-center ${align === 'right' ? 'justify-end' : 'justify-start'} gap-1 border-r border-white/10 px-2 py-1.5`}
      style={{ width }}>
      <span className="truncate">{label}</span>
      {filter && <Filter size={10} className="cursor-pointer text-white/50 hover:text-white" />}
    </div>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f8fafc] font-sans text-sm">
      <div className="no-print flex shrink-0 flex-col border-b bg-white shadow-sm">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <div className="rounded bg-blue-50 p-1.5 text-[#0c5888]">
              <TrendingUp size={18} />
            </div>
            <div>
              <h1 className="font-bold leading-none text-gray-800">Profit & Loss Statement</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                T-Format Report
              </span>
            </div>
            <div className="mx-2 h-6 w-[1px] bg-gray-200" />
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded bg-[#0c5888] px-3 py-1.5 text-[10px] font-bold uppercase text-white shadow-sm transition-colors hover:bg-[#09466d]">
              <Printer size={12} /> Print
            </button>
            <button className="flex items-center gap-1.5 rounded border border-gray-200 px-3 py-1.5 text-[10px] font-bold uppercase text-gray-600 transition-colors hover:bg-gray-50">
              <Download size={12} /> Export
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2 text-gray-400" size={13} />
            <input
              type="text"
              placeholder="Search items..."
              className="w-64 rounded border border-gray-200 py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#0c5888]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 border-t bg-gray-50/50 px-3 py-2 text-[11px]">
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
              className="rounded border border-gray-300 bg-white px-2 py-0.5"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="rounded border border-gray-300 bg-white px-2 py-0.5"
            />
          </div>
          <button
            onClick={() => setLoading(true)}
            className="ml-auto rounded bg-gray-800 px-3 py-1 text-[10px] font-bold uppercase text-white hover:bg-black">
            Apply
          </button>
        </div>
      </div>

      <div className="shadow-inner relative m-2 flex-grow overflow-auto rounded border bg-white">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <Loader2 className="mb-2 animate-spin text-[#0c5888]" size={32} />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Loading Report...
            </span>
          </div>
        )}

        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead className="sticky top-0 z-20 shadow-md">
            <tr className="bg-[#084164] text-[10px] font-bold uppercase tracking-widest text-white">
              <th className="w-10 border-r border-white/10 py-1 text-center">Zoom</th>
              <th className="border-r border-white/10 px-2 py-1" colSpan={3}>
                Expenses
              </th>
              <th className="px-2 py-1" colSpan={3}>
                Income
              </th>
            </tr>
            <tr className="bg-[#0c5888] text-[10px] font-bold uppercase tracking-tight text-white">
              <th className="w-10 border-r border-white/10"></th>

              <th className="p-0">
                <HeaderCell label="Name" width="100%" filter />
              </th>
              <th className="p-0">
                <HeaderCell label="Code" width="100%" filter />
              </th>
              <th className="p-0">
                <HeaderCell label="Amount(₹)" width="100%" align="right" filter />
              </th>

              <th className="p-0">
                <HeaderCell label="Name" width="100%" filter />
              </th>
              <th className="p-0">
                <HeaderCell label="Code" width="100%" filter />
              </th>
              <th className="p-0">
                <HeaderCell label="Amount(₹)" width="100%" align="right" filter />
              </th>
            </tr>
          </thead>

          <tbody className="text-[11px] text-gray-700">
            {rows.map((row, index) => {
              const { expense, income } = row;

              return (
                <tr
                  key={index}
                  className="group h-7 border-b border-gray-100 transition-colors hover:bg-blue-50/30">
                  <td className="border-r border-gray-200 bg-gray-50/50 text-center">
                    <Eye
                      size={12}
                      className="mx-auto cursor-pointer text-blue-400 opacity-0 group-hover:opacity-100"
                    />
                  </td>

                  <td
                    className="relative border-r border-gray-200 px-2"
                    style={{
                      paddingLeft: expense ? `${(expense.level || 0) * 20 + 8}px` : undefined,
                    }}>
                    {expense && (
                      <div className="flex items-center gap-1">
                        {expense.children && expense.children.length > 0 ? (
                          <button
                            onClick={() => toggleRow(expense.id)}
                            className="focus:outline-none">
                            {expanded[expense.id] ? (
                              <ChevronDown size={12} className="text-gray-500" />
                            ) : (
                              <ChevronRight size={12} className="text-gray-500" />
                            )}
                          </button>
                        ) : (
                          <span className="inline-block w-3" />
                        )}
                        <span
                          className={`truncate ${expense.level === 0 ? 'font-bold text-[#0c5888]' : ''}`}>
                          {expense.name}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="border-r border-gray-200 px-2 font-mono text-gray-500">
                    {expense?.code}
                  </td>
                  <td className="border-r border-gray-400 px-2 text-right font-mono">
                    {expense
                      ? `₹${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : ''}
                  </td>

                  <td
                    className="relative border-r border-gray-200 px-2"
                    style={{
                      paddingLeft: income ? `${(income.level || 0) * 20 + 8}px` : undefined,
                    }}>
                    {income && (
                      <div className="flex items-center gap-1">
                        {income.children && income.children.length > 0 ? (
                          <button
                            onClick={() => toggleRow(income.id)}
                            className="focus:outline-none">
                            {expanded[income.id] ? (
                              <ChevronDown size={12} className="text-gray-500" />
                            ) : (
                              <ChevronRight size={12} className="text-gray-500" />
                            )}
                          </button>
                        ) : (
                          <span className="inline-block w-3" />
                        )}
                        <span
                          className={`truncate ${income.level === 0 ? 'font-bold text-[#0c5888]' : ''}`}>
                          {income.name}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="border-r border-gray-200 px-2 font-mono text-gray-500">
                    {income?.code}
                  </td>
                  <td className="px-2 text-right font-mono">
                    {income
                      ? `₹${income.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : ''}
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="py-12 text-center italic text-gray-400">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>

          <tfoot className="sticky bottom-0 z-20 border-t-2 border-white/20 bg-[#0c5888] text-[11px] font-bold text-white">
            <tr>
              <td className="border-r border-white/10"></td>
              <td
                className="border-r border-white/10 px-2 py-2 text-right uppercase tracking-wider"
                colSpan={2}>
                Total Expenses:
              </td>
              <td className="border-r border-white/30 bg-[#09466d] px-2 py-2 text-right font-mono">
                ₹{data.expenses[0]?.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td
                className="border-r border-white/10 px-2 py-2 text-right uppercase tracking-wider"
                colSpan={2}>
                Total Income:
              </td>
              <td className="bg-[#09466d] px-2 py-2 text-right font-mono">
                ₹{data.income[0]?.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .overflow-auto { overflow: visible !important; height: auto !important; }
        }
      `}</style>
    </div>
  );
}
