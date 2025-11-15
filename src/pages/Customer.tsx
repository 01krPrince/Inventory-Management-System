import { useState } from "react";
import DataTable from "./Tables/DataTable"

// Sample Data
const sampleEmployeeData = [
  { user: 'Abram Schleifer', position: 'Sales Assistant', office: 'Edinburgh', age: 57, startDate: '25 Apr, 2027', salary: '$89,500' },
  { user: 'Charlotte Anderson', position: 'Marketing Manager', office: 'London', age: 42, startDate: '12 Mar, 2025', salary: '$105,000' },
  { user: 'Ethan Brown', position: 'Software Engineer', office: 'San Francisco', age: 30, startDate: '01 Jan, 2024', salary: '$120,000' },
  { user: 'Isabella Davis', position: 'UI/UX Designer', office: 'Austin', age: 29, startDate: '18 Jul, 2025', salary: '$92,000' },
  { user: 'James Wilson', position: 'Data Analyst', office: 'Chicago', age: 28, startDate: '20 Sep, 2025', salary: '$80,000' },
  { user: 'Liam Moore', position: 'DevOps Engineer', office: 'Boston', age: 33, startDate: '30 Oct, 2024', salary: '$115,000' },
  { user: 'Mia Garcia', position: 'Content Strategist', office: 'Denver', age: 27, startDate: '12 Dec, 2027', salary: '$70,000' },
  { user: 'Olivia Johnson', position: 'HR Specialist', office: 'Los Angeles', age: 40, startDate: '08 Nov, 2026', salary: '$75,000' },
  { user: 'Sophia Martinez', position: 'Product Manager', office: 'New York', age: 35, startDate: '15 Jun, 2026', salary: '$95,000' },
  { user: 'William Smith', position: 'Financial Analyst', office: 'Seattle', age: 38, startDate: '03 Feb, 2026', salary: '$88,000' },
  { user: 'Zoe Young', position: 'Research Scientist', office: 'Zurich', age: 32, startDate: '10 May, 2024', salary: '$130,000' },
  { user: 'David Kim', position: 'IT Support', office: 'Sydney', age: 45, startDate: '14 Feb, 2023', salary: '$65,000' },
];

// Column Definition
const employeeColumns = [
  { key: 'user', label: 'User', sortable: true },
  { key: 'position', label: 'Position', sortable: true },
  { key: 'office', label: 'Office', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
  { key: 'startDate', label: 'Start Date', sortable: true },
  { key: 'salary', label: 'Salary', sortable: true },
];

export default function Customer() {
  const [data, setData] = useState(sampleEmployeeData);

  // Edit handler (logs to console instead of using alert/modal)
  const handleEdit = (user) => {
    console.log(`[ACTION] Editing user: ${user.user}. This would open an edit form/modal.`);
    // Example: Update state to mock a change
    // setData(prev => prev.map(u => u.user === user.user ? { ...u, position: 'Lead ' + u.position } : u));
  };
  
  // Delete handler (logs to console instead of using alert/modal)
  const handleDelete = (user) => {
    console.log(`[ACTION] Deleting user: ${user.user}. This would trigger a confirmation modal, then API call.`);
    // Example: Filter out the deleted user
    setData(prev => prev.filter(u => u.user !== user.user));
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12 min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <DataTable
        columns={employeeColumns}
        data={data}
        initialPageSize={5} // Set initial page size lower for demonstration
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </div>
  );
}