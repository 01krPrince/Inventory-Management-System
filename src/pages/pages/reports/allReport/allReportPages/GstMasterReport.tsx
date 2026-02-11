import { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Edit3, Trash2, Printer, Plus } from 'lucide-react';
import { GstClassificationForm } from '../../../../../components/GstClassificationForm';
import {
  fetchGstClassifications,
  deleteGstClassification,
} from '../../../../../components/addItemMaster/api/gstservice';
import { handlePrint } from '../../../../../components/function/functions';

interface GstData {
  _id: string;
  type: string | null;
  code?: string | null;
  hsn_sac_code: string;
  hsn_description: string;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
}

// const ReportColumns = [
//   { key: "type", label: "Type" },
//   { key: "code", label: "Internal Code" },
//   { key: "hsn_sac_code", label: "HSN/SAC Code" },
//   { key: "hsn_description", label: "Description" },
//   { key: "gstRate", label: "GST %" },
// ];

const GstMasterReport = () => {
  const [data, setData] = useState<GstData[]>([]); // Typed state
  const [, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isPrinting, setIsPrinting] = useState(false);
  const [prePrintRows, setPrePrintRows] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<GstData | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchGstClassifications();
      // Properly typed cast to resolve Image 7 error
      setData(Array.isArray(result) ? (result as unknown as GstData[]) : []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      [item.hsn_sac_code, item.hsn_description, item.type].some((val) =>
        String(val || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  useEffect(() => {
    if (isPrinting && paginatedData.length === filteredData.length) {
      setTimeout(() => {
        handlePrint('gst-report-table', 'GST Master Report');
        setIsPrinting(false);
        setRowsPerPage(prePrintRows);
      }, 500);
    }
  }, [isPrinting, paginatedData.length, filteredData.length, prePrintRows]);

  const handlePrintRequest = () => {
    setPrePrintRows(rowsPerPage);
    setRowsPerPage(filteredData.length);
    setIsPrinting(true);
  };

  const TableHeader = ({ label, className = '' }: { label: string; className?: string }) => (
    <th
      className={`sticky top-0 z-10 border-b bg-gray-50 px-3 py-2 text-[11px] font-bold uppercase text-gray-500 ${className}`}>
      {label}
    </th>
  );

  if (isFormOpen)
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
        <GstClassificationForm
          initialData={editingRow}
          onSubmit={() => {
            loadData();
            setIsFormOpen(false);
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </div>
    );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b bg-white p-3">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <ShieldCheck className="text-[#1e4e79]" /> GST Report
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            className="rounded border px-3 py-1.5 text-sm"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handlePrintRequest}
            className="flex items-center gap-1 rounded border p-2 text-xs font-semibold">
            <Printer size={16} /> Print All
          </button>
          <button
            onClick={() => {
              setEditingRow(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-1 rounded-md bg-[#1e4e79] px-3 py-1.5 text-sm font-semibold text-white">
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full border-collapse text-left" id="gst-report-table">
          <thead>
            <tr>
              <TableHeader label="Type" />
              <TableHeader label="HSN/SAC Code" />
              <TableHeader label="Description" />
              <TableHeader label="GST %" />
              <TableHeader label="IGST %" />
              <TableHeader label="Actions" className="no-print text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {paginatedData.map((row) => (
              <tr key={row._id} className="transition-colors hover:bg-blue-50/30">
                <td className="px-3 py-2 text-[10px] font-bold uppercase text-gray-400">
                  {row.type}
                </td>
                <td className="px-3 py-2 font-bold text-[#1e4e79]">{row.hsn_sac_code}</td>
                <td className="max-w-[200px] truncate px-3 py-2 text-gray-600">
                  {row.hsn_description}
                </td>
                <td className="px-3 py-2 font-semibold">{row.gstRate}%</td>
                <td className="px-3 py-2 text-gray-500">{row.igst}%</td>
                <td className="no-print flex justify-end gap-1 px-3 py-2 text-right">
                  <button
                    onClick={() => {
                      setEditingRow(row);
                      setIsFormOpen(true);
                    }}
                    className="p-1.5 text-gray-400 hover:text-blue-600">
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm('Delete?')) {
                        await deleteGstClassification(row._id);
                        loadData();
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t bg-gray-50 p-3 text-xs">
        <span className="font-bold">Total: {filteredData.length}</span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="ml-2 cursor-pointer rounded border px-1 py-1 text-[11px] font-bold outline-none">
          {[10, 25, 50, 100].map((val) => (
            <option key={val} value={val}>
              Show {val}
            </option>
          ))}
          <option value={filteredData.length}>Show All</option>
        </select>
      </div>
    </div>
  );
};

export default GstMasterReport;
