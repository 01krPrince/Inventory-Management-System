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
  RefreshCw,
} from 'lucide-react';

type PLNode = {
  id: string;
  name: string;
  code: string;
  amount: number;
  type: 'group' | 'ledger';
  children?: PLNode[];
  level?: number;
};

const formatCurrency = (amount: number) => {
  if (amount === 0) return '₹0.00';
  const absAmount = Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'INR',
  });
  const cleanAmount = absAmount.replace('₹', '');
  return amount < 0 ? `(${cleanAmount})` : `${cleanAmount}`;
};

const generateMockData = () => {
  const tradingExpenses: PLNode[] = [
    {
      id: 'EXP-DIRECT-ROOT',
      name: 'Direct Operational Expenses',
      code: '41000000',
      amount: 5437727.99,
      type: 'group',
      children: [
        {
          id: 'EXP-PURCH',
          name: 'Purchases',
          code: '41200000',
          amount: 6448665.84,
          type: 'group',
          children: [
            {
              id: 'EXP-PURCH-TRADED',
              name: 'Purchases - Traded Goods',
              code: '41210000',
              amount: 6448665.84,
              type: 'group',
              children: [
                {
                  id: 'L-41210001',
                  name: 'Purchases - Traded Goods (GST)',
                  code: '41210001',
                  amount: 6448665.84,
                  type: 'ledger',
                },
              ],
            },
          ],
        },
        {
          id: 'EXP-CHANGE-INV',
          name: 'Change In Inventory',
          code: '41300000',
          amount: -1010937.85,
          type: 'group',
          children: [
            {
              id: 'L-41300002',
              name: 'Opening Stock-In-Trade',
              code: '41300002',
              amount: 1109618.49,
              type: 'ledger',
            },
            {
              id: 'L-41370001',
              name: 'Closing Stock-In-Trade',
              code: '41370001',
              amount: -2120556.34,
              type: 'ledger',
            },
          ],
        },
      ],
    },
  ];

  const tradingIncome: PLNode[] = [
    {
      id: 'INC-REV-ROOT',
      name: 'Revenue From Operations',
      code: '31000000',
      amount: 8722807.13,
      type: 'group',
      children: [
        {
          id: 'INC-TURNOVER',
          name: 'Turnover (Goods & Services)',
          code: '31100000',
          amount: 8729171.59,
          type: 'group',
          children: [
            {
              id: 'INC-SALES-TRADED',
              name: 'Sales-Traded Goods',
              code: '31120000',
              amount: 8729171.59,
              type: 'group',
              children: [
                {
                  id: 'L-31120001',
                  name: 'Sales Accounts',
                  code: '31120001',
                  amount: 8741714.59,
                  type: 'ledger',
                },
                {
                  id: 'L-31120002',
                  name: 'Trade Discount',
                  code: '31120002',
                  amount: -12543.0,
                  type: 'ledger',
                },
              ],
            },
          ],
        },
        {
          id: 'INC-OTHER-OP',
          name: 'Other Operating Revenues',
          code: '31200000',
          amount: -6364.46,
          type: 'group',
          children: [
            {
              id: 'L-31230000',
              name: 'Inter Branch Transfer',
              code: '31230000',
              amount: -6364.46,
              type: 'ledger',
            },
          ],
        },
      ],
    },
  ];

  const plExpenses: PLNode[] = [
    {
      id: 'EXP-INDIRECT-ROOT',
      name: 'Indirect Expenses',
      code: '42000000',
      amount: 888093.61,
      type: 'group',
      children: [
        {
          id: 'EXP-EMP-BEN',
          name: 'Employee Benefit Expenses',
          code: '42100000',
          amount: 7500.0,
          type: 'group',
          children: [
            {
              id: 'EXP-SAL-BEN',
              name: 'Salary & Other Staff Benefits',
              code: '42110000',
              amount: 7500.0,
              type: 'group',
              children: [
                {
                  id: 'L-42110002',
                  name: 'Salaries & Wages',
                  code: '42110002',
                  amount: 7500.0,
                  type: 'ledger',
                },
              ],
            },
          ],
        },
        {
          id: 'EXP-SELL-ADMIN',
          name: 'Selling & Admin Expenses',
          code: '42200000',
          amount: 871974.71,
          type: 'group',
          children: [
            {
              id: 'EXP-ADMIN',
              name: 'Administrative Expenses',
              code: '42210000',
              amount: 842624.71,
              type: 'group',
              children: [
                {
                  id: 'L-42210004',
                  name: 'Computer Repairs & Maint.',
                  code: '42210004',
                  amount: 1767.0,
                  type: 'ledger',
                },
                {
                  id: 'L-42210008',
                  name: 'Electricity Expenses',
                  code: '42210008',
                  amount: 177835.0,
                  type: 'ledger',
                },
                {
                  id: 'L-42210017',
                  name: 'General & Misc Expenses',
                  code: '42210017',
                  amount: 31745.0,
                  type: 'ledger',
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const plIncome: PLNode[] = [
    {
      id: 'INC-INDIRECT-ROOT',
      name: 'Indirect Income',
      code: '32000000',
      amount: 0.0,
      type: 'group',
      children: [],
    },
  ];

  return { tradingExpenses, tradingIncome, plExpenses, plIncome };
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

export default function TradingProfitLossStatement() {
  const [data, setData] = useState<ReturnType<typeof generateMockData>>({
    tradingExpenses: [],
    tradingIncome: [],
    plExpenses: [],
    plIncome: [],
  });
  const [loading, setLoading] = useState(false);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const [filterStore, setFilterStore] = useState('00002');
  const [dateRange, setDateRange] = useState({ from: '2025-04-01', to: '2026-03-31' });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mock = generateMockData();
      setData(mock);
      const autoExpand = {
        'EXP-DIRECT-ROOT': true,
        'INC-REV-ROOT': true,
        'EXP-PURCH': true,
        'INC-TURNOVER': true,
        'EXP-CHANGE-INV': true,
        'INC-SALES-TRADED': true,
        'INC-OTHER-OP': true,
        'EXP-INDIRECT-ROOT': true,
        'EXP-EMP-BEN': true,
        'EXP-SELL-ADMIN': true,
        'EXP-SAL-BEN': true,
        'EXP-ADMIN': true,
      };
      setExpanded(autoExpand);
      setLoading(false);
    }, 600);
  }, []);

  const toggleRow = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleTradingExp = useMemo(
    () => flattenTree(data.tradingExpenses, expanded),
    [data.tradingExpenses, expanded]
  );
  const visibleTradingInc = useMemo(
    () => flattenTree(data.tradingIncome, expanded),
    [data.tradingIncome, expanded]
  );

  const visiblePLExp = useMemo(
    () => flattenTree(data.plExpenses, expanded),
    [data.plExpenses, expanded]
  );
  const visiblePLInc = useMemo(
    () => flattenTree(data.plIncome, expanded),
    [data.plIncome, expanded]
  );

  const tradingRowsCount = Math.max(visibleTradingExp.length, visibleTradingInc.length);
  const plRowsCount = Math.max(visiblePLExp.length, visiblePLInc.length);

  const tradingRows = Array.from({ length: tradingRowsCount }).map((_, i) => ({
    exp: visibleTradingExp[i] || null,
    inc: visibleTradingInc[i] || null,
  }));

  const plRows = Array.from({ length: plRowsCount }).map((_, i) => ({
    exp: visiblePLExp[i] || null,
    inc: visiblePLInc[i] || null,
  }));

  const totalDirectExp = data.tradingExpenses.reduce((sum, n) => sum + n.amount, 0);
  const totalDirectInc = data.tradingIncome.reduce((sum, n) => sum + n.amount, 0);
  const grossProfit = totalDirectInc - totalDirectExp;

  const totalIndirectExp = data.plExpenses.reduce((sum, n) => sum + n.amount, 0);
  const totalIndirectInc = data.plIncome.reduce((sum, n) => sum + n.amount, 0);

  const netProfit = grossProfit + totalIndirectInc - totalIndirectExp;

  const HeaderCell = ({ label, width, align = 'left', filter = false, className = '' }: any) => (
    <div
      className={`flex items-center ${align === 'right' ? 'justify-end' : 'justify-between'} h-full gap-1 border-r border-white/10 px-2 py-1.5 ${className}`}
      style={{ width }}>
      <span className="truncate leading-none">{label}</span>
      {filter && (
        <Filter size={10} className="shrink-0 cursor-pointer text-white/50 hover:text-white" />
      )}
    </div>
  );

  const TableRow = ({
    leftNode,
    rightNode,
    isLast,
  }: {
    leftNode: PLNode | null;
    rightNode: PLNode | null;
    isLast?: boolean;
  }) => (
    <tr
      className={`group h-7 border-b border-gray-100 transition-colors hover:bg-blue-50/30 ${isLast ? 'border-b-0' : ''}`}>
      <td className="w-10 border-r border-gray-200 bg-gray-50/30 text-center">
        {(leftNode?.type === 'ledger' || rightNode?.type === 'ledger') && (
          <Eye size={12} className="mx-auto cursor-pointer text-blue-600" />
        )}
      </td>

      <td
        className="relative border-r border-gray-200 px-2 align-middle"
        style={{ paddingLeft: leftNode ? `${(leftNode.level || 0) * 20 + 8}px` : undefined }}>
        {leftNode && (
          <div className="flex items-center gap-1 overflow-hidden">
            {leftNode.children && leftNode.children.length > 0 ? (
              <button
                onClick={() => toggleRow(leftNode.id)}
                className="z-10 shrink-0 focus:outline-none">
                {expanded[leftNode.id] ? (
                  <ChevronDown size={12} className="text-gray-500" />
                ) : (
                  <ChevronRight size={12} className="text-gray-500" />
                )}
              </button>
            ) : (
              <span className="w-3 shrink-0" />
            )}
            <span
              className={`truncate text-[11px] ${leftNode.level === 0 ? 'font-bold text-[#0c5888]' : 'text-gray-700'}`}>
              {leftNode.name}
            </span>
          </div>
        )}
      </td>
      <td className="border-r border-gray-200 px-2 align-middle font-mono text-[10px] text-gray-500">
        {leftNode?.code}
      </td>
      <td className="border-r border-gray-400/50 px-2 text-right align-middle font-mono text-gray-800">
        {leftNode ? `₹${formatCurrency(leftNode.amount)}` : ''}
      </td>

      <td
        className="relative border-r border-gray-200 px-2 align-middle"
        style={{ paddingLeft: rightNode ? `${(rightNode.level || 0) * 20 + 8}px` : undefined }}>
        {rightNode && (
          <div className="flex items-center gap-1 overflow-hidden">
            {rightNode.children && rightNode.children.length > 0 ? (
              <button
                onClick={() => toggleRow(rightNode.id)}
                className="z-10 shrink-0 focus:outline-none">
                {expanded[rightNode.id] ? (
                  <ChevronDown size={12} className="text-gray-500" />
                ) : (
                  <ChevronRight size={12} className="text-gray-500" />
                )}
              </button>
            ) : (
              <span className="w-3 shrink-0" />
            )}
            <span
              className={`truncate text-[11px] ${rightNode.level === 0 ? 'font-bold text-[#0c5888]' : 'text-gray-700'}`}>
              {rightNode.name}
            </span>
          </div>
        )}
      </td>
      <td className="border-r border-gray-200 px-2 align-middle font-mono text-[10px] text-gray-500">
        {rightNode?.code}
      </td>
      <td className="px-2 text-right align-middle font-mono text-gray-800">
        {rightNode ? `₹${formatCurrency(rightNode.amount)}` : ''}
      </td>
    </tr>
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
              <h1 className="font-bold leading-none text-gray-800">Trading & P/L Statement</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Financial Year 2025-26
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
              placeholder="Search ledger..."
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
            <span className="font-bold uppercase text-gray-500">Date:</span>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="rounded border border-gray-300 bg-white px-2 py-0.5 text-[10px]"
            />
            <span className="text-gray-400">-</span>
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
            className="ml-auto flex items-center gap-1 rounded bg-gray-800 px-3 py-1 text-[10px] font-bold uppercase text-white hover:bg-black">
            <RefreshCw size={10} /> Apply
          </button>
        </div>
      </div>

      <div className="shadow-inner relative m-2 flex-grow overflow-auto rounded border bg-white">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <Loader2 className="mb-2 animate-spin text-[#0c5888]" size={32} />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Generating Report...
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
            <tr className="h-8 bg-[#0c5888] text-[10px] font-bold uppercase tracking-tight text-white">
              <th className="w-10 border-r border-white/10 bg-[#0a4e7a]"></th>

              <th className="border-r border-white/10 p-0">
                <HeaderCell label="Name" width="100%" filter />
              </th>
              <th className="w-24 border-r border-white/10 p-0">
                <HeaderCell label="Code" width="100%" filter />
              </th>
              <th className="w-32 border-r border-white/10 bg-[#0a4e7a] p-0">
                <HeaderCell label="Amount(₹)" width="100%" align="right" filter />
              </th>

              <th className="border-r border-white/10 p-0">
                <HeaderCell label="Name" width="100%" filter />
              </th>
              <th className="w-24 border-r border-white/10 p-0">
                <HeaderCell label="Code" width="100%" filter />
              </th>
              <th className="w-32 bg-[#0a4e7a] p-0">
                <HeaderCell label="Amount(₹)" width="100%" align="right" filter />
              </th>
            </tr>
          </thead>

          <tbody className="text-[11px] text-gray-700">
            <tr className="border-b bg-gray-100/80 text-xs font-bold uppercase tracking-wider text-gray-500">
              <td className="border-r border-white bg-gray-200 py-1 text-center">-</td>
              <td colSpan={3} className="border-r border-gray-300 px-2">
                Trading Account (Dr)
              </td>
              <td colSpan={3} className="px-2">
                Trading Account (Cr)
              </td>
            </tr>

            {tradingRows.map((row, idx) => (
              <TableRow key={`trad-${idx}`} leftNode={row.exp} rightNode={row.inc} />
            ))}

            <tr className="h-8 border-b border-t border-yellow-200 bg-yellow-50 font-bold">
              <td className="border-r border-yellow-200"></td>
              <td className="border-r border-yellow-200 px-2 text-gray-800">
                {grossProfit > 0 ? 'Gross Profit c/o' : ''}
              </td>
              <td className="border-r border-yellow-200"></td>
              <td className="border-r border-yellow-200 px-2 text-right text-[#0c5888]">
                {grossProfit > 0 ? `₹${formatCurrency(grossProfit)}` : ''}
              </td>

              <td className="border-r border-yellow-200 px-2 text-gray-800">
                {grossProfit < 0 ? 'Gross Loss c/o' : ''}
              </td>
              <td className="border-r border-yellow-200"></td>
              <td className="px-2 text-right text-red-600">
                {grossProfit < 0 ? `₹${formatCurrency(Math.abs(grossProfit))}` : ''}
              </td>
            </tr>

            <tr className="border-b border-t border-gray-300 bg-gray-100/80 text-xs font-bold uppercase tracking-wider text-gray-500">
              <td className="border-r border-white bg-gray-200 py-1 text-center">-</td>
              <td colSpan={3} className="border-r border-gray-300 px-2">
                Profit & Loss (Dr)
              </td>
              <td colSpan={3} className="px-2">
                Profit & Loss (Cr)
              </td>
            </tr>

            <tr className="h-7 border-b border-gray-100 bg-white italic text-gray-500">
              <td className="border-r border-gray-200"></td>
              <td className="border-r border-gray-200 px-2">
                {grossProfit < 0 ? 'Gross Loss b/d' : ''}
              </td>
              <td className="border-r border-gray-200"></td>
              <td className="border-r border-gray-200 px-2 text-right">
                {grossProfit < 0 ? `₹${formatCurrency(Math.abs(grossProfit))}` : ''}
              </td>

              <td className="border-r border-gray-200 px-2">
                {grossProfit > 0 ? 'Gross Profit b/d' : ''}
              </td>
              <td className="border-r border-gray-200"></td>
              <td className="px-2 text-right">
                {grossProfit > 0 ? `₹${formatCurrency(grossProfit)}` : ''}
              </td>
            </tr>

            {plRows.map((row, idx) => (
              <TableRow key={`pl-${idx}`} leftNode={row.exp} rightNode={row.inc} />
            ))}

            {plRows.length < 3 && (
              <tr className="h-10">
                <td></td>
              </tr>
            )}
          </tbody>

          <tfoot className="sticky bottom-0 z-20 border-t-2 border-white/20 bg-[#0c5888] text-[11px] font-bold text-white shadow-lg">
            <tr className="h-9">
              <td className="border-r border-white/10"></td>

              <td className="flex h-full items-center border-r border-white/10 px-2 uppercase tracking-wider">
                {netProfit > 0 ? 'Net Profit' : 'Net Loss'}
              </td>
              <td className="border-r border-white/10"></td>
              <td
                className={`flex h-full items-center justify-end border-r border-white/10 px-2 text-right font-mono text-[12px] ${netProfit > 0 ? 'bg-green-600' : 'bg-red-500'}`}>
                {netProfit > 0 ? `₹${formatCurrency(netProfit)}` : ''}
              </td>

              <td className="flex h-full items-center border-r border-white/10 px-2 text-[10px] italic text-white/50">
                (Transferred to Balance Sheet)
              </td>
              <td className="border-r border-white/10"></td>
              <td className="flex h-full items-center justify-end bg-white/10 px-2 text-right font-mono text-[12px]">
                {formatCurrency(Math.max(grossProfit + totalIndirectInc, totalIndirectExp))}
              </td>
            </tr>
          </tfoot>
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
