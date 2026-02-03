import { useState, useEffect, useMemo } from 'react';
import {
  EditIcon,
  Trash2,
  Search,
  FileSpreadsheet,
  Settings,
  Eye,
  RefreshCw,
  Loader2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import ChartOfAccountsModal from '../../../components/ChartOfAccount';
import {
  ChartOfAccount,
  getAllChartOfAccounts,
  deleteChartOfAccountById,
} from '../../../services/chartOfAccountService';

type SortConfig = {
  key: keyof ChartOfAccount | '';
  direction: 'asc' | 'desc' | null;
};

const ChartOfAccountPage = () => {
  const [data, setData] = useState<ChartOfAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ChartOfAccount | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await getAllChartOfAccounts();
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch Chart of Accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const lowerSearch = searchTerm.toLowerCase();
    return data.filter((item) => {
      return (
        String(item.name || '')
          .toLowerCase()
          .includes(lowerSearch) ||
        String(item.code || '')
          .toLowerCase()
          .includes(lowerSearch) ||
        String(item.underGroup || '')
          .toLowerCase()
          .includes(lowerSearch) ||
        String(item.nature || '')
          .toLowerCase()
          .includes(lowerSearch) ||
        String(item.identification || '')
          .toLowerCase()
          .includes(lowerSearch)
      );
    });
  }, [data, searchTerm]);

  const sortedAndFilteredData = useMemo(() => {
    const sortableItems = [...filteredData];
    if (sortConfig.key && sortConfig.direction !== null) {
      sortableItems.sort((a, b) => {
        const aValue = String(a[sortConfig.key as keyof ChartOfAccount] || '').toLowerCase();
        const bValue = String(b[sortConfig.key as keyof ChartOfAccount] || '').toLowerCase();

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const requestSort = (key: keyof ChartOfAccount) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleRefresh = () => fetchAccounts();

  const handleOpenModal = (account: ChartOfAccount | null = null) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleSave = (savedData: ChartOfAccount) => {
    console.log(savedData);
    setIsModalOpen(false);
    fetchAccounts();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await deleteChartOfAccountById(id);
        fetchAccounts();
      } catch (error) {
        alert('Error deleting account');
      }
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = sortedAndFilteredData
        .map((item) => item._id)
        .filter((id): id is string => !!id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    sortedAndFilteredData.length > 0 && selectedIds.length === sortedAndFilteredData.length;

  const getSortIcon = (key: keyof ChartOfAccount) => {
    if (sortConfig.key !== key)
      return <ChevronUp size={12} className="opacity-20 group-hover:opacity-100" />;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={12} className="text-yellow-400" />
    ) : (
      <ChevronDown size={12} className="text-yellow-400" />
    );
  };

  return (
    <div className="flex h-[70vh] flex-col bg-gray-50 p-4 font-sans text-sm">
      <div className="mb-4 flex flex-shrink-0 justify-end gap-2">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          title="Refresh Data">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>

        <button className="flex items-center gap-1 rounded bg-[#1a4b7c] px-3 py-1.5 text-white shadow-sm hover:bg-[#153a61]">
          <Trash2 className="mr-1 size-4" /> Bulk Delete ({selectedIds.length})
        </button>

        <button
          onClick={() => handleOpenModal(null)}
          className="flex items-center gap-1 rounded bg-[#1a4b7c] px-3 py-1.5 text-white shadow-sm hover:bg-[#153a61]">
          <FileSpreadsheet size={16} /> Create New Chart of Accounts
        </button>

        <button className="rounded bg-[#1a4b7c] p-1.5 text-white shadow-sm">
          <Settings size={16} />
        </button>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
        <div className="flex flex-shrink-0 justify-end gap-2 border-b bg-white p-2">
          <button className="p-1 text-green-700 hover:bg-green-50">
            <FileSpreadsheet size={20} />
          </button>
          <div className="relative">
            <Search className="absolute left-2 top-2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search all fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 rounded border py-1 pl-8 pr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading && data.length === 0 ? (
            <div className="flex h-full items-center justify-center p-20 text-blue-900">
              <Loader2 className="mr-2 animate-spin" /> Loading accounts...
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 z-10 bg-[#0e3d6b] text-[11px] uppercase text-white shadow-sm">
                <tr>
                  <th className="w-12 border border-blue-900 p-2">SNo</th>
                  <th className="w-12 border border-blue-900 p-2 text-center">Edit</th>
                  <th className="w-12 border border-blue-900 p-2 text-center">Delete</th>
                  <th className="w-10 border border-blue-900 p-2 text-center">
                    <input
                      type="checkbox"
                      className="cursor-pointer accent-blue-600"
                      onChange={handleSelectAll}
                      checked={isAllSelected}
                    />
                  </th>
                  <th
                    className="group min-w-[200px] cursor-pointer border border-blue-900 p-2 hover:bg-[#164875]"
                    onClick={() => requestSort('name')}>
                    <div className="flex items-center justify-between">
                      Name {getSortIcon('name')}
                    </div>
                  </th>
                  <th
                    className="group cursor-pointer border border-blue-900 p-2 hover:bg-[#164875]"
                    onClick={() => requestSort('code')}>
                    <div className="flex items-center justify-between">
                      Code {getSortIcon('code')}
                    </div>
                  </th>
                  <th
                    className="group min-w-[150px] cursor-pointer border border-blue-900 p-2 hover:bg-[#164875]"
                    onClick={() => requestSort('underGroup')}>
                    <div className="flex items-center justify-between">
                      Under Group {getSortIcon('underGroup')}
                    </div>
                  </th>
                  <th
                    className="group cursor-pointer border border-blue-900 p-2 hover:bg-[#164875]"
                    onClick={() => requestSort('nature')}>
                    <div className="flex items-center justify-between text-center">
                      Nature {getSortIcon('nature')}
                    </div>
                  </th>
                  <th className="border border-blue-900 p-2 text-center">SubLedger</th>
                  <th className="border border-blue-900 p-2 text-center">View</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {sortedAndFilteredData.map((row, idx) => (
                  <tr
                    key={row._id}
                    className={
                      idx % 2 === 0
                        ? 'bg-white'
                        : 'bg-blue-50/30 transition-colors hover:bg-blue-100/50'
                    }>
                    <td className="border border-gray-200 p-2 text-center">{idx + 1}</td>
                    <td className="border border-gray-200 p-2 text-center">
                      <EditIcon
                        size={14}
                        className="mx-auto cursor-pointer text-blue-700 transition-transform hover:scale-110"
                        onClick={() => handleOpenModal(row)}
                      />
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      <Trash2
                        size={14}
                        className="mx-auto cursor-pointer text-red-600 transition-transform hover:scale-110"
                        onClick={() => row._id && handleDelete(row._id)}
                      />
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={row._id ? selectedIds.includes(row._id) : false}
                        onChange={() => row._id && handleSelectRow(row._id)}
                      />
                    </td>
                    <td className="border border-gray-200 p-2">{row.name || 'N/A'}</td>
                    <td className="border border-gray-200 p-2">{row.code || 'N/A'}</td>
                    <td className="border border-gray-200 p-2">{row.underGroup || 'N/A'}</td>
                    <td className="border border-gray-200 p-2 text-center">{row.nature || '-'}</td>
                    <td className="border border-gray-200 p-2 text-center">
                      {row.isSubleder ? 'Yes' : 'No'}
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      <Eye
                        size={14}
                        className="mx-auto cursor-pointer text-blue-700 hover:text-blue-900"
                        onClick={() => handleOpenModal(row)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center justify-between border-t bg-white p-3 text-xs text-gray-600">
          <div className="flex gap-4">
            <span>Total Items : {sortedAndFilteredData.length}</span>
            {searchTerm && (
              <span className="italic text-blue-600">Filtered from {data.length} total</span>
            )}
          </div>
          <div className="flex items-center gap-2 font-medium">
            Rows displayed: {sortedAndFilteredData.length}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ChartOfAccountsModal
          isOpen={isModalOpen}
          initialData={selectedAccount}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ChartOfAccountPage;
