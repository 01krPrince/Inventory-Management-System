import React, { useState } from 'react';

// Defines the column structure for the form fields, consistent with the main table.
const formColumns = [
    { key: 'user', label: 'User', type: 'text', required: true },
    { key: 'position', label: 'Position', type: 'text', required: true },
    { key: 'office', label: 'Office', type: 'text', required: false },
    { key: 'age', label: 'Age', type: 'number', required: false },
    { key: 'startDate', label: 'Start Date (e.g., 01 Jan, 2024)', type: 'text', required: false },
    { key: 'salary', label: 'Salary (e.g., $100,000)', type: 'text', required: false },
];

/**
 * AddCustomerModal Component
 * @param {boolean} isOpen - Controls visibility.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onAdd - Function to execute upon form submission (adds the new employee to the main table data).
 */
export default function AddCustomerModal({ isOpen, onClose, onAdd }) {
    const [formData, setFormData] = useState({ 
        user: '', position: '', office: '', age: '', startDate: '', salary: '' 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Simple validation based on formColumns definitions
        const requiredFields = formColumns.filter(c => c.required);
        const missingFields = requiredFields.filter(col => !formData[col.key]);

        if (missingFields.length > 0) {
            alert(`Validation Error: Please fill in the required fields: ${missingFields.map(c => c.label).join(', ')}.`);
            return;
        }

        onAdd(formData);
        // Reset form data after successful submission
        setFormData({ user: '', position: '', office: '', age: '', startDate: '', salary: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        // Modal Overlay: uses a semi-transparent dark background for proper separation
        <div className="fixed inset-0 z-50 overflow-y-auto bg-transparent flex items-center justify-center backdrop-blur-sm p-4" onClick={onClose}>
            
            {/* Modal Content */}
            <div 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg m-auto border border-gray-200 dark:border-gray-700 transform transition-all duration-300 scale-100"
                onClick={e => e.stopPropagation()} // Stop propagation to prevent closing when clicking outside
            >
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-2 border-gray-100 dark:border-gray-700">Add New Employee </h2>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formColumns.map(col => (
                        <div key={col.key} className="col-span-1">
                            <label 
                                htmlFor={col.key} 
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                {col.label} {col.required && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                id={col.key}
                                type={col.type}
                                name={col.key}
                                value={formData[col.key]}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                required={col.required}
                                min={col.key === 'age' ? "0" : undefined}
                            />
                        </div>
                    ))}
                    
                    <div className="col-span-full flex justify-end space-x-3 pt-4 border-t mt-4 border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md shadow-blue-500/50"
                        >
                            Add Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}