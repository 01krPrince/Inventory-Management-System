import React, { useState, useRef, useCallback } from "react";
import EditCustomerModal from "./pop-ups/EditCustomerModal";
import { initialEmployeeData, employeeColumns, formColumns } from "./StaticData/customer";
import { PrintIcon, PlusIcon, TrashIcon, EditIcon, SearchIcon, ExportIcon } from "../components/icons";
import { useTableLogic, handleExport, handlePrint } from "../components/function/functions";

const AddCustomerModal = ({ isOpen, onClose, onAdd }) => { 
    const [formData, setFormData] = useState({ user: '', position: '', office: '', age: '', startDate: '', salary: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.user || !formData.position) {
            alert("Please fill in User and Position.");
            return;
        }
        onAdd(formData);
        setFormData({ user: '', position: '', office: '', age: '', startDate: '', salary: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-70 flex items-center justify-center backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg m-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-2 border-gray-100 dark:border-gray-700">Add New Employee</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formColumns.map(col => (
                        <div key={col.key} className="col-span-1">
                            <label htmlFor={col.key} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {col.label} {col.required && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                id={col.key}
                                type={col.type}
                                name={col.key}
                                value={formData[col.key]}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                required={col.required}
                            />
                        </div>
                    ))}
                    <div className="col-span-full flex justify-end space-x-3 pt-4 border-t mt-4 border-gray-100 dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition font-medium">
                            Cancel
                        </button>
                        <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md">
                            Add Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ResizableHeader = ({ col, requestSort, renderSortIndicator, setColumnWidths, columnIndex, columnWidths }) => {
    const thRef = useRef(null);

    // Initial width setting using inline style
    const style = {
        width: columnWidths[col.key] ? `${columnWidths[col.key]}px` : undefined,
        minWidth: '100px', // Prevent columns from becoming too small
    };

    const startResizing = useCallback((mouseDownEvent) => {
        // Prevent sorting when starting to drag the resizer
        mouseDownEvent.stopPropagation();
        
        const startX = mouseDownEvent.clientX;
        const initialWidth = thRef.current.offsetWidth;

        const doResizing = (mouseMoveEvent) => {
            const widthDelta = mouseMoveEvent.clientX - startX;
            const newWidth = Math.max(initialWidth + widthDelta, 100); // Minimum width of 100px
            
            // Update the width state
            setColumnWidths(prev => ({
                ...prev,
                [col.key]: newWidth
            }));
        };

        const stopResizing = () => {
            window.removeEventListener('mousemove', doResizing);
            window.removeEventListener('mouseup', stopResizing);
        };

        window.addEventListener('mousemove', doResizing);
        window.addEventListener('mouseup', stopResizing);
    }, [col.key, setColumnWidths]);
    
    // The TH element itself will handle sorting
    const handleHeaderClick = () => {
        if (col.sortable) {
            requestSort(col.key);
        }
    };

    return (
        <th
            ref={thRef}
            key={col.key}
            // Tailwind classes for style and behavior
            className={`p-4 relative 
                ${col.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/80 transition duration-150' : ''}
                border-r border-dashed border-gray-300 dark:border-gray-600`}
            onClick={handleHeaderClick}
            style={style}
        >
            <span className="flex items-center whitespace-nowrap">
                {col.label}
                {col.sortable && renderSortIndicator(col.key)}
            </span>
            
            {/* Resizer Handle - Positioned on the right edge */}
            <div
                // Class updated to make the resizer visually stand out more on hover
                className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-10 opacity-0 hover:opacity-100 transition duration-150 bg-transparent hover:bg-blue-400 dark:hover:bg-blue-600"
                onMouseDown={startResizing}
                onClick={e => e.stopPropagation()} // Prevent sorting when clicking the resizer
            />
        </th>
    );
};

const pageSizeOptions = [5, 10, 20, 50];
const initialPageSize = 5;

export default function Customer() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
    const [columnWidths, setColumnWidths] = useState({});

    const {
        data, 
        setData,
        searchTerm, 
        setSearchTerm,
        pageSize, 
        setPageSize,
        currentPage, 
        setCurrentPage,
        selectedRows, 
        setSelectedRows,
        paginatedData,
        sortedDataLength,
        totalPages,
        startEntry,
        endEntry,
        pageNumbers,
        requestSort,
        renderSortIndicator,
    } = useTableLogic(initialEmployeeData, employeeColumns, initialPageSize);

    
    const isSelected = (row) => selectedRows.includes(row.id);

    const handleSelectRow = (row) => {
        setSelectedRows(prev => 
            isSelected(row) ? prev.filter(id => id !== row.id) : [...prev, row.id]
        );
    };

    const handleSelectAll = () => {
        const allIdsOnPage = paginatedData.map((row) => row.id);
        const areAllSelected = allIdsOnPage.every((id) => selectedRows.includes(id));
        
        if (areAllSelected) {
            setSelectedRows(prev => prev.filter(id => !allIdsOnPage.includes(id)));
        } else {
            setSelectedRows(prev => [...new Set([...prev, ...allIdsOnPage])]);
        }
    };

    const handleAddCustomer = (newCustomerData) => {
        const newId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
        const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ', ');
        
        const newCustomer = {
            ...newCustomerData,
            id: newId,
            age: parseInt(newCustomerData.age) || 0, 
            office: newCustomerData.office || 'N/A', 
            startDate: newCustomerData.startDate || today, 
            salary: newCustomerData.salary || '$0', 
        };
        
        setData((prev) => [...prev, newCustomer]);
    };
    
    const handleUpdateCustomer = (updatedData) => {
        const cleanedData = {
             ...updatedData,
             age: parseInt(updatedData.age) || 0,
        };

        setData(prevData => prevData.map(row => 
            row.id === updatedData.id ? cleanedData : row
        ));
    };

    const handleOpenEditModal = (row) => {
        setEditingRow(row);
        setIsEditModalOpen(true);
    };

    const handleDelete = (user) => {
        if (window.confirm(`Are you sure you want to delete user: ${user.user}?`)) {
            setData((prev) => prev.filter(u => u.id !== user.id));
            setSelectedRows(prev => prev.filter(id => id !== user.id));
        }
    };
    
    const handleBulkDelete = () => {
        if (selectedRows.length === 0) {
            alert("Please select at least one row to delete.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected row(s)?`)) {
            setData((prev) => prev.filter(u => !selectedRows.includes(u.id)));
            setSelectedRows([]);
        }
    };

    const areAllOnPageSelected = paginatedData.length > 0 && paginatedData.every((row) => selectedRows.includes(row.id));


    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full"> 
                
                {/* Control Panel */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
                    
                    <div className="flex items-center space-x-4">
                        {/* Show Entries Dropdown */}
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            Show
                            <select
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
                                className="mx-2 p-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-white appearance-none cursor-pointer"
                            >
                                {pageSizeOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            entries
                        </div>

                        {/* Bulk Delete Button */}
                        {selectedRows.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="px-3 py-1.5 flex items-center bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-sm"
                            >
                                <TrashIcon className="size-4 mr-1" />
                                Bulk Delete ({selectedRows.length})
                            </button>
                        )}
                    </div>
                    
                    <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                        
                        <button
                            onClick={() => handlePrint('printable-table', 'Employee Directory')}
                            className="p-2 text-gray-600 dark:text-gray-300 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            title="Print Table"
                        >
                            <PrintIcon className="size-5" />
                        </button>
                        <button
                            onClick={() => handleExport(data, employeeColumns, 'EmployeeDirectory')}
                            className="p-2 text-gray-600 dark:text-gray-300 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            title="Export to XLSX"
                        >
                            <ExportIcon className="size-5" />
                        </button>
                        
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search all columns..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 pl-10 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            />
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                        </div>

                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-3 py-2 flex items-center bg-[#0c5888] text-white text-sm font-medium hover:bg-[#124463] transition shadow-md whitespace-nowrap dark:text-indigo-400 mb-3 border-b border-gray-200 dark:border-gray-700 mt-4"
                        >
                            <PlusIcon className="size-4 mr-1" />
                            Add New
                        </button>
                    </div>
                </div>
                
                <hr className="mb-4 border-gray-100 dark:border-gray-700"/>

                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full table-fixed" id="printable-table">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                                
                                <th className="p-4 w-10 no-print border-r border-dashed border-gray-300 dark:border-gray-600" style={{ width: '40px' }}> {/* Fixed width for checkbox column */}
                                    <input 
                                        type="checkbox" 
                                        className="rounded text-blue-600 dark:bg-gray-600 dark:border-gray-500 border-gray-300 focus:ring-blue-500"
                                        checked={areAllOnPageSelected}
                                        onChange={handleSelectAll}
                                    />
                                </th>

                                {employeeColumns.map((col, index) => (
                                    <ResizableHeader 
                                        key={col.key}
                                        col={col}
                                        requestSort={requestSort}
                                        renderSortIndicator={renderSortIndicator}
                                        setColumnWidths={setColumnWidths}
                                        columnIndex={index}
                                        columnWidths={columnWidths}
                                    />
                                ))}
                                <th className="p-4 text-center whitespace-nowrap no-print border-r border-dashed border-gray-300 dark:border-gray-600" style={{ width: '100px' }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="even:bg-gray-50/50 dark:even:bg-gray-700/10 border-t border-gray-100 dark:border-gray-700/50 text-sm text-gray-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700/30 transition duration-150"
                                    >
                                        <td className="p-4 w-10 no-print border-r border-gray-200 dark:border-gray-700" style={{ width: columnWidths['checkbox'] || '40px' }}>
                                            <input 
                                                type="checkbox" 
                                                className="rounded text-blue-600 dark:bg-gray-600 dark:border-gray-500 border-gray-300 focus:ring-blue-500"
                                                checked={isSelected(row)}
                                                onChange={() => handleSelectRow(row)}
                                            />
                                        </td>

                                        {employeeColumns.map((col, colIndex) => (
                                            <td 
                                                key={colIndex} 
                                                className="p-4 whitespace-nowrap overflow-hidden text-ellipsis border-r border-gray-200 dark:border-gray-700"
                                                style={{ width: columnWidths[col.key] ? `${columnWidths[col.key]}px` : undefined }}
                                            >
                                                {row[col.key]}
                                            </td>
                                        ))}

                                        <td className="p-4 text-center space-x-2 whitespace-nowrap no-print border-r border-gray-200 dark:border-gray-700" style={{ width: columnWidths['actions'] || '100px' }}>
                                            <button
                                                onClick={() => handleOpenEditModal(row)} 
                                                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 transition"
                                                aria-label="Edit"
                                                title="Edit"
                                            >
                                                <EditIcon className="size-4 inline" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(row)}
                                                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition"
                                                aria-label="Delete"
                                                title="Delete"
                                            >
                                                <TrashIcon className="size-4 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={employeeColumns.length + 2} className="p-8 text-center text-lg text-gray-500 dark:text-gray-400">
                                        No matching entries found. 🙁
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {startEntry} to {endEntry} of {sortedDataLength} entries. (Total Pages: {totalPages})
                    </div>

                  <div className="flex space-x-2 items-center justify-center mt-4">
  <button
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
      currentPage === 1
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700/40 dark:text-gray-500'
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-[#0c5888]/10 hover:text-[#0c5888] dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-[#0c5888]/20'
    }`}
  >
    Previous
  </button>

  {pageNumbers.map(page => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
        currentPage === page
          ? 'bg-[#0c5888] text-white shadow-md border border-transparent dark:bg-[#0c5888]'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-[#0c5888]/10 hover:text-[#0c5888] dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-[#0c5888]/20'
      }`}
    >
      {page}
    </button>
  ))}

  <button
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage >= totalPages}
    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
      currentPage >= totalPages
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700/40 dark:text-gray-500'
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-[#0c5888]/10 hover:text-[#0c5888] dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-[#0c5888]/20'
    }`}
  >
    Next
  </button>
</div>

                </div>
            </div>
            
            <AddCustomerModal
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={handleAddCustomer} 
            />

            <EditCustomerModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                rowData={editingRow}
                onUpdate={handleUpdateCustomer}
            />
        </>
    );
}