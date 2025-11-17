import { useState, useEffect } from "react";

/**
 * EditCustomerModal Component
 * Dynamically generates form fields based on the keys present in the rowData object.
 * * @param {boolean} isOpen - Controls visibility.
 * @param {function} onClose - Function to close the modal.
 * @param {object | null} rowData - The data object of the row being edited.
 * @param {function} onUpdate - Function to execute upon form submission (updates the main table data).
 */
export default function EditCustomerModal({
  isOpen,
  onClose,
  rowData,
  onUpdate,
}) {
  const [formData, setFormData] = useState(rowData || {});

  // Sync local state when external rowData changes (e.g., when the modal is opened)
  useEffect(() => {
    setFormData(rowData || {});
  }, [rowData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;

    // Simple validation check for empty string values (excluding 'id')
    const requiredKeys = Object.keys(formData).filter(
      (key) => key !== "id" && !formData[key]
    );
    if (requiredKeys.length > 0) {
      alert(`Validation Error: Please fill in all fields.`);
      return;
    }

    onUpdate(formData);
    onClose();
  };

  if (!isOpen || !rowData) return null;

  // Use keys from the latest formData state for dynamic rendering
  const dataKeys = Object.keys(formData);
  // Determine grid columns based on the number of fields
  const gridCols =
    dataKeys.length > 4 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1";

  // Utility function to make labels look presentable (e.g., 'startDate' -> 'Start Date')
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Determine the input type (defaulting 'number' for age/id, 'text' otherwise)
  const getType = (key, value) => {
    if (key === "age" || typeof value === "number") return "number";
    if (key.toLowerCase().includes("date")) return "text";
    if (key.toLowerCase().includes("email")) return "email";
    return "text";
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-70 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg m-auto border border-gray-200 dark:border-gray-700 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-2 border-gray-100 dark:border-gray-700">
          Edit Employee: {rowData.user || `ID: ${rowData.id}`}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className={`grid ${gridCols} gap-4`}>
            {dataKeys.map((key) => (
              <div key={key} className="col-span-1">
                <label
                  htmlFor={`edit-${key}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {formatLabel(key)}{" "}
                  {key === "id" && (
                    <span className="text-gray-500">(Read-only)</span>
                  )}
                </label>
                <input
                  id={`edit-${key}`}
                  type={getType(key, formData[key])}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  disabled={key === "id"} // ID field is always read-only
                  className={`w-full p-2.5 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm ${
                    key === "id"
                      ? "bg-gray-100 dark:bg-gray-700/50 cursor-not-allowed"
                      : ""
                  }`}
                  required={key !== "id"}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t mt-4 border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
            >
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
