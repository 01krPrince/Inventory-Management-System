import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Printer,
  Download,
  Eye,
  Filter,
  Calculator, // Icon for Depreciation
  Loader2,
  Calendar,
  Building2,
  RefreshCw,
} from 'lucide-react';

// --- TYPES ---
type AssetNode = {
  id: string;
  name: string;
  code: string;
  type: 'group' | 'ledger';

  // Opening Block
  op_gross: number;
  op_dep: number;
  op_net: number;

  // Addition Block
  add_gross: number;

  // Adjustment Block (Sales/Deductions/Current Dep)
  adj_gross_ded: number; // Deduction in Gross
  adj_dep_ded: number; // Deduction in Accumulated Dep
  cur_dep: number; // Depreciation for the year

  // Closing Block
  cl_gross: number;
  cl_net: number;
  cl_dep: number; // Accumulated Depreciation Closing

  children?: AssetNode[];
  level?: number;
};

// --- HELPER: FORMAT CURRENCY ---
const formatCurrency = (amount: number) => {
  if (amount === 0) return '₹0.00';
  const absAmount = Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    // style: 'currency',
    // currency: 'INR',
  });
  return amount < 0 ? `(${absAmount})` : `${absAmount}`;
};

// --- MOCK DATA GENERATOR ---
const generateMockData = (): AssetNode[] => {
  // Helper to create consistent data logic: Net = Gross - Dep
  const createAsset = (
    id: string,
    name: string,
    code: string,
    opG: number,
    opD: number,
    addG: number,
    dedG: number,
    dedD: number,
    curD: number
  ) => {
    const opN = opG - opD;

    // Logic: Closing Gross = Op Gross + Add - Ded Gross
    const clG = opG + addG - dedG;

    // Logic: Closing Dep = Op Dep - Ded Dep + Cur Dep
    const clD = opD - dedD + curD;

    const clN = clG - clD;

    return {
      id,
      name,
      code,
      type: 'ledger' as const,
      op_gross: opG,
      op_dep: opD,
      op_net: opN,
      add_gross: addG,
      adj_gross_ded: dedG,
      adj_dep_ded: dedD,
      cur_dep: curD,
      cl_gross: clG,
      cl_dep: clD,
      cl_net: clN,
    };
  };

  return [
    {
      id: 'GRP-INTANGIBLE',
      name: 'Intangible Assets',
      code: '21000000',
      type: 'group',
      op_gross: 0,
      op_dep: 0,
      op_net: 0,
      add_gross: 0,
      adj_gross_ded: 0,
      adj_dep_ded: 0,
      cur_dep: 0,
      cl_gross: 0,
      cl_dep: 0,
      cl_net: 0,
      children: [
        createAsset(
          'L-IPR',
          'Intellectual Property Rights (IPRS)',
          '21100001',
          150000,
          25000,
          0,
          0,
          0,
          15000
        ),
        createAsset('L-SOFT', 'Computer Software', '21100002', 75000, 45000, 25000, 0, 0, 12500),
      ],
    },
    {
      id: 'GRP-TANGIBLE',
      name: 'Tangible Assets',
      code: '22000000',
      type: 'group',
      op_gross: 0,
      op_dep: 0,
      op_net: 0,
      add_gross: 0,
      adj_gross_ded: 0,
      adj_dep_ded: 0,
      cur_dep: 0,
      cl_gross: 0,
      cl_dep: 0,
      cl_net: 0,
      children: [
        createAsset('L-BLDG', 'Building', '22100001', 5000000, 1200000, 0, 0, 0, 250000),
        createAsset(
          'L-FURN',
          'Furniture & Fixtures',
          '22100002',
          450000,
          150000,
          50000,
          10000,
          2000,
          45000
        ),
        createAsset('L-VEH', 'Vehicles', '22100003', 1200000, 400000, 1200000, 0, 0, 180000),
        createAsset('L-COMP', 'Computers & Printers', '22100004', 250000, 200000, 0, 0, 0, 25000),
      ],
    },
  ];
};

// --- FLATTEN LOGIC & AGGREGATION ---
const processData = (
  nodes: AssetNode[],
  expandedIds: Record<string, boolean>,
  level: number = 0
): AssetNode[] => {
  let processed: AssetNode[] = [];

  nodes.forEach((node) => {
    const newNode = { ...node, level };

    // If group, we need to aggregate children first to get group totals (if not provided by API)
    // For this mock, we calculate group totals from children
    if (node.children && node.children.length > 0) {
      const childNodes = processData(node.children, expandedIds, level + 1);

      // Aggregate totals for the group
      newNode.op_gross = childNodes.reduce(
        (s, c) => s + (c.level === level + 1 ? c.op_gross : 0),
        0
      );
      newNode.op_dep = childNodes.reduce((s, c) => s + (c.level === level + 1 ? c.op_dep : 0), 0);
      newNode.op_net = childNodes.reduce((s, c) => s + (c.level === level + 1 ? c.op_net : 0), 0);
      newNode.add_gross = childNodes.reduce(
        (s, c) => s + (c.level === level + 1 ? c.add_gross : 0),
        0
      );
      newNode.adj_gross_ded = childNodes.reduce(
        (s, c) => s + (c.level === level + 1 ? c.adj_gross_ded : 0),
        0
      );
      newNode.adj_dep_ded = childNodes.reduce(
        (s, c) => s + (c.level === level + 1 ? c.adj_dep_ded : 0),
        0
      );
      newNode.cur_dep = childNodes.reduce((s, c) => s + (c.level === level + 1 ? c.cur_dep : 0), 0);
      newNode.cl_gross = childNodes.reduce(
        (s, c) => s + (c.level === level + 1 ? c.cl_gross : 0),
        0
      );
      newNode.cl_dep = childNodes.reduce((s, c) => s + (c.level === level + 1 ? c.cl_dep : 0), 0);
      newNode.cl_net = childNodes.reduce((s, c) => s + (c.level === level + 1 ? c.cl_net : 0), 0);

      processed.push(newNode);
      if (expandedIds[node.id]) {
        processed = processed.concat(childNodes);
      }
    } else {
      processed.push(newNode);
    }
  });

  return processed;
};

// --- COMPONENT ---
export default function DepreciationStatement() {
  const [data, setData] = useState<AssetNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filterStore, setFilterStore] = useState('00002');
  const [dateRange, setDateRange] = useState({ from: '2025-04-01', to: '2026-03-31' });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(generateMockData());
      setExpanded({ 'GRP-INTANGIBLE': true, 'GRP-TANGIBLE': true });
      setLoading(false);
    }, 600);
  }, []);

  const toggleRow = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleRows = useMemo(() => processData(data, expanded), [data, expanded]);

  // Totals for Footer
  const totals = useMemo(() => {
    const rootNodes = visibleRows.filter((r) => r.level === 0);
    return rootNodes.reduce(
      (acc, curr) => ({
        op_gross: acc.op_gross + curr.op_gross,
        op_dep: acc.op_dep + curr.op_dep,
        op_net: acc.op_net + curr.op_net,
        add_gross: acc.add_gross + curr.add_gross,
        adj_gross_ded: acc.adj_gross_ded + curr.adj_gross_ded,
        adj_dep_ded: acc.adj_dep_ded + curr.adj_dep_ded,
        cur_dep: acc.cur_dep + curr.cur_dep,
        cl_gross: acc.cl_gross + curr.cl_gross,
        cl_dep: acc.cl_dep + curr.cl_dep,
        cl_net: acc.cl_net + curr.cl_net,
      }),
      {
        op_gross: 0,
        op_dep: 0,
        op_net: 0,
        add_gross: 0,
        adj_gross_ded: 0,
        adj_dep_ded: 0,
        cur_dep: 0,
        cl_gross: 0,
        cl_dep: 0,
        cl_net: 0,
      }
    );
  }, [visibleRows]);

  // --- HEADER CELL ---
  const HeaderCell = ({ label, showFilter = true, align = 'right', className = '' }: any) => (
    <div
      className={`flex items-center ${align === 'right' ? 'justify-end' : 'justify-between'} h-full gap-1 px-2 ${className}`}>
      <span className="truncate leading-none">{label}</span>
      {showFilter && (
        <Filter size={8} className="shrink-0 cursor-pointer text-white/50 hover:text-white" />
      )}
    </div>
  );

  return (
    <div className="flex h-screen select-none flex-col overflow-hidden bg-[#f8fafc] font-sans text-sm">
      {/* --- HEADER --- */}
      <div className="no-print flex shrink-0 flex-col border-b bg-white shadow-sm">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <div className="rounded bg-blue-50 p-1.5 text-[#0c5888]">
              <Calculator size={18} />
            </div>
            <div>
              <h1 className="font-bold leading-none text-gray-800">Depreciation Statement</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Fixed Assets Register
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
              placeholder="Search asset..."
              className="w-64 rounded border border-gray-200 py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#0c5888]"
            />
          </div>
        </div>

        {/* --- FILTERS --- */}
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

      {/* --- TABLE AREA --- */}
      <div className="shadow-inner relative m-2 flex-grow overflow-auto rounded border bg-white">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <Loader2 className="mb-2 animate-spin text-[#0c5888]" size={32} />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Calculating Depreciation...
            </span>
          </div>
        )}

        <table className="w-full min-w-[1400px] border-collapse text-left">
          <thead className="sticky top-0 z-30 bg-[#084164] text-[10px] font-bold uppercase text-white shadow-md">
            {/* Top Header Row */}
            <tr className="border-b border-white/10">
              <th className="sticky left-0 z-40 w-10 border-r border-white/10 bg-[#084164] py-1 text-center">
                Zoom
              </th>
              <th className="sticky left-10 z-40 w-64 border-r border-white/10 bg-[#084164] px-2 text-left">
                -
              </th>

              <th className="border-r border-white/10 px-2 text-center" colSpan={3}>
                Opening
              </th>
              <th className="border-r border-white/10 px-2 text-center">Addition</th>
              <th className="border-r border-white/10 px-2 text-center" colSpan={3}>
                Adjustment
              </th>
              <th className="border-r border-white/10 px-2 text-center" colSpan={3}>
                Closing
              </th>
            </tr>

            {/* Sub Header Row */}
            <tr className="h-8 bg-[#0c5888]">
              {/* Sticky Columns */}
              <th className="sticky left-0 z-40 w-10 border-r border-white/10 bg-[#0c5888]"></th>
              <th className="sticky left-10 z-40 border-r border-white/10 bg-[#0c5888] p-0 shadow-[4px_0_5px_-2px_rgba(0,0,0,0.3)]">
                <HeaderCell label="Ledger Name" align="left" />
              </th>

              {/* Opening Columns */}
              <th className="w-28 border-r border-white/10 p-0">
                <HeaderCell label="Gross Amt(₹)" />
              </th>
              <th className="w-28 border-r border-white/10 p-0">
                <HeaderCell label="Depreciation(₹)" />
              </th>
              <th className="w-28 border-r border-white/10 bg-[#0a4e7a] p-0">
                <HeaderCell label="Net Amount(₹)" />
              </th>

              {/* Addition Columns */}
              <th className="w-28 border-r border-white/10 p-0">
                <HeaderCell label="Gross Amt(₹)" />
              </th>

              {/* Adjustment Columns */}
              <th className="w-28 border-r border-white/10 p-0">
                <HeaderCell label="Depr.(Ded)(₹)" />
              </th>
              <th className="w-28 border-r border-white/10 p-0">
                <HeaderCell label="Cur. Dep(₹)" />
              </th>
              <th className="w-28 border-r border-white/10 p-0">
                <HeaderCell label="Gross(Ded)(₹)" />
              </th>

              {/* Closing Columns */}
              <th className="w-28 border-r border-white/10 p-0">
                <HeaderCell label="Gross Amt(₹)" />
              </th>
              <th className="w-28 border-r border-white/10 bg-[#0a4e7a] p-0">
                <HeaderCell label="Net Amount(₹)" />
              </th>
              <th className="w-28 border-r border-white/10 p-0">
                <HeaderCell label="Depreciation(₹)" />
              </th>
            </tr>
          </thead>

          <tbody className="text-[11px] text-gray-700">
            {visibleRows.length > 0
              ? visibleRows.map((row, idx) => (
                  <tr
                    key={`${row.id}-${idx}`}
                    className="group h-7 border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                    {/* Zoom */}
                    <td className="sticky left-0 z-20 w-10 border-r border-gray-200 bg-gray-50 text-center group-hover:bg-blue-100/50">
                      <Eye
                        size={12}
                        className={`mx-auto cursor-pointer text-blue-600 ${row.type === 'ledger' ? 'opacity-100' : 'opacity-0'}`}
                      />
                    </td>

                    {/* Name */}
                    <td className="sticky left-10 z-20 border-r border-gray-200 bg-white px-2 align-middle shadow-[4px_0_5px_-2px_rgba(0,0,0,0.1)] group-hover:bg-blue-50/50">
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

                    {/* Opening */}
                    <td className="border-r border-gray-200 px-2 text-right font-mono text-gray-600">
                      {formatCurrency(row.op_gross)}
                    </td>
                    <td className="border-r border-gray-200 px-2 text-right font-mono text-gray-500">
                      {formatCurrency(row.op_dep)}
                    </td>
                    <td className="border-r border-gray-200 bg-gray-50/30 px-2 text-right font-mono font-medium text-gray-800">
                      {formatCurrency(row.op_net)}
                    </td>

                    {/* Addition */}
                    <td className="border-r border-gray-200 px-2 text-right font-mono text-green-700">
                      {row.add_gross !== 0 ? formatCurrency(row.add_gross) : '-'}
                    </td>

                    {/* Adjustment */}
                    <td className="border-r border-gray-200 px-2 text-right font-mono text-red-400">
                      {row.adj_dep_ded !== 0 ? formatCurrency(row.adj_dep_ded) : '-'}
                    </td>
                    <td className="border-r border-gray-200 px-2 text-right font-mono font-bold text-blue-700">
                      {row.cur_dep !== 0 ? formatCurrency(row.cur_dep) : '-'}
                    </td>
                    <td className="border-r border-gray-200 px-2 text-right font-mono text-red-400">
                      {row.adj_gross_ded !== 0 ? formatCurrency(row.adj_gross_ded) : '-'}
                    </td>

                    {/* Closing */}
                    <td className="border-r border-gray-200 px-2 text-right font-mono text-gray-600">
                      {formatCurrency(row.cl_gross)}
                    </td>
                    <td className="border-r border-gray-200 bg-gray-50/30 px-2 text-right font-mono font-bold text-[#0c5888]">
                      {formatCurrency(row.cl_net)}
                    </td>
                    <td className="border-r border-gray-200 px-2 text-right font-mono text-gray-500">
                      {formatCurrency(row.cl_dep)}
                    </td>
                  </tr>
                ))
              : !loading && (
                  <tr>
                    <td colSpan={11} className="py-10 text-center italic text-gray-400">
                      No assets found.
                    </td>
                  </tr>
                )}
          </tbody>

          {/* --- FOOTER --- */}
          {visibleRows.length > 0 && (
            <tfoot className="sticky bottom-0 z-30 border-t-2 border-white/20 bg-[#0c5888] text-[11px] font-bold text-white shadow-lg">
              <tr className="h-8">
                <td className="sticky left-0 z-40 border-r border-white/10 bg-[#0c5888]"></td>
                <td className="sticky left-10 z-40 border-r border-white/10 bg-[#0c5888] px-2 text-right uppercase tracking-wider shadow-[4px_0_5px_-2px_rgba(0,0,0,0.3)]">
                  Grand Total:
                </td>

                {/* Op Totals */}
                <td className="border-r border-white/10 px-2 text-right font-mono">
                  {formatCurrency(totals.op_gross)}
                </td>
                <td className="border-r border-white/10 px-2 text-right font-mono text-white/70">
                  {formatCurrency(totals.op_dep)}
                </td>
                <td className="border-r border-white/10 bg-[#0a4e7a] px-2 text-right font-mono">
                  {formatCurrency(totals.op_net)}
                </td>

                {/* Add Total */}
                <td className="border-r border-white/10 px-2 text-right font-mono text-green-300">
                  {formatCurrency(totals.add_gross)}
                </td>

                {/* Adj Totals */}
                <td className="border-r border-white/10 px-2 text-right font-mono text-red-300">
                  {formatCurrency(totals.adj_dep_ded)}
                </td>
                <td className="border-r border-white/10 px-2 text-right font-mono text-yellow-300">
                  {formatCurrency(totals.cur_dep)}
                </td>
                <td className="border-r border-white/10 px-2 text-right font-mono text-red-300">
                  {formatCurrency(totals.adj_gross_ded)}
                </td>

                {/* Closing Totals */}
                <td className="border-r border-white/10 px-2 text-right font-mono">
                  {formatCurrency(totals.cl_gross)}
                </td>
                <td className="border-r border-white/10 bg-[#0a4e7a] px-2 text-right font-mono text-yellow-300">
                  {formatCurrency(totals.cl_net)}
                </td>
                <td className="border-r border-white/10 px-2 text-right font-mono text-white/70">
                  {formatCurrency(totals.cl_dep)}
                </td>
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
