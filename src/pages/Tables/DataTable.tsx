import React, { useState, useMemo, useEffect } from 'react';

// ====================================================================
// 1. ICON COMPONENTS (Lucide React alternatives or inline SVGs)
// ====================================================================
const SearchIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.394l3.123 3.123a.75.75 0 11-1.06 1.06l-3.123-3.123A7 7 0 012 9z" clipRule="evenodd" /></svg>
);
const EditIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5.433 13.917V17.5a.5.5 0 00.5.5h3.667a.5.5 0 00.5-.5v-3.583h4.167a.5.5 0 00.5-.5V9.75a.5.5 0 00-.146-.354l-7.792-7.792a.5.5 0 00-.354-.146H5.433a.5.5 0 00-.5.5v3.667a.5.5 0 00.5.5h4.167z" /><path fillRule="evenodd" d="M12.917 4.167h4.166a.5.5 0 01.5.5v3.666a.5.5 0 01-.146.354L10.917 14.833a.5.5 0 01-.354.146H5.433a.5.5 0 01-.5-.5v-3.666a.5.5 0 01.146-.354l7.792-7.792a.5.5 0 01.354-.146z" clipRule="evenodd" /></svg>
);
const TrashIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.5h-1.75a.75.75 0 000 1.5H1.5a.75.75 0 000 1.5h1.75V15A2.75 2.75 0 005.5 17.75h9A2.75 2.75 0 0017.25 15V7.25h1.75a.75.75 0 000-1.5H16.25v-.5A2.75 2.75 0 0013.5 1h-4.75zM7.5 3.75a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zM15.5 15a1.25 1.25 0 01-1.25 1.25h-9A1.25 1.25 0 014 15V7.25h11.5V15z" clipRule="evenodd" /><path d="M7 10.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM12.5 10a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5a.75.75 0 00-.75-.75z" /></svg>
);
const ChevronUpIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.77 12.77a.75.75 0 01-1.06 0L10 9.06l-3.72 3.71a.75.75 0 01-1.06-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06z" clipRule="evenodd" /></svg>
);
const ChevronDownIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
);

// ====================================================================
// 2. DYNAMIC DATA TABLE COMPONENT
// ====================================================================

/**
 * DynamicDataTable Component
 * Renders a searchable, sortable, and paginated table.
 * @param {Array<Object>} columns - Array defining table headers and data keys.
 * @param {Array<Object>} data - The full dataset to display.
 */
export default function DynamicDataTable({
  columns,
  data,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  onEdit = (row) => console.log('Edit:', row),
  onDelete = (row) => console.log('Delete:', row),
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  // Default sort to the first column (assuming it exists)
  const [sortConfig, setSortConfig] = useState({ key: columns[0]?.key || null, direction: 'ascending' });

  // 1. Filtering Logic (Search)
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return data.filter(row =>
      columns.some(col =>
        String(row[col.key] ?? '').toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  }, [data, searchTerm, columns]);

  // 2. Sorting Logic
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle numeric sorting for Age and Salary (after removing non-digits)
        let comparisonA = aValue;
        let comparisonB = bValue;
        
        // Custom logic for sorting monetary or age fields numerically
        if (sortConfig.key === 'age' || sortConfig.key === 'salary') {
            comparisonA = parseFloat(String(aValue).replace(/[^0-9.]/g, '')) || 0;
            comparisonB = parseFloat(String(bValue).replace(/[^0-9.]/g, '')) || 0;
        }

        if (comparisonA < comparisonB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (comparisonA > comparisonB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize]);

  // Reset current page when filters or page size change
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, searchTerm]);

  // Sorting Handler
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Render Sort Icon
  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending'
      ? <ChevronUpIcon className="ml-1 size-3" />
      : <ChevronDownIcon className="ml-1 size-3" />;
  };

  const startEntry = Math.min(sortedData.length, (currentPage - 1) * pageSize + 1);
  const endEntry = Math.min(sortedData.length, currentPage * pageSize);

  // Determine which page numbers to show (simplified pagination control)
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages, currentPage]);


  return (
    <div className="bg-white p-6 rounded-xl shadow-xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700 w-full">

      {/* Table Controls (Show Entries & Search) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        {/* Show Entries Dropdown */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          Show
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="mx-2 p-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-white"
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          entries
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="min-w-full table-auto">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-200">
              {columns.map((col, index) => (
                <th
                  key={col.key || index}
                  className={`p-4 ${col.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/80 transition duration-150' : ''}`}
                  onClick={() => col.sortable && requestSort(col.key)}
                >
                  <span className="flex items-center">
                    {col.label}
                    {col.sortable && renderSortIndicator(col.key)}
                  </span>
                </th>
              ))}
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="even:bg-gray-50/50 dark:even:bg-gray-700/10 border-t border-gray-100 dark:border-gray-700/50 text-sm text-gray-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700/30 transition duration-150"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="p-4 whitespace-nowrap">
                      {row[col.key]}
                    </td>
                  ))}

                  {/* Action Buttons */}
                  <td className="p-4 text-center space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => onEdit(row)}
                      className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition"
                      aria-label="Edit"
                    >
                      <EditIcon className="size-4 inline" />
                    </button>
                    <button
                      onClick={() => onDelete(row)}
                      className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition ml-2"
                      aria-label="Delete"
                    >
                      <TrashIcon className="size-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="p-4 text-center text-gray-500">
                  No matching entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination and Entries Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startEntry} to {endEntry} of {sortedData.length} entries (Total Pages: {totalPages})
        </div>

        {/* Pagination Controls */}
        <div className="flex space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700/50 dark:text-gray-500' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'}`}
          >
            Previous
          </button>

          {/* Page Number Buttons */}
          {pageNumbers.map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === page 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/50' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
              }`}
            >
              {page}
            </button>
          ))}


          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700/50 dark:text-gray-500' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}