export interface Employee {
  user: string;
  position: string;
  office: string;
  age: number;
  startDate: string;
  salary: string;
  id: number;
}

export const initialEmployeeData: Employee[] = [
  {
    user: "Abram Schleifer",
    position: "Sales Assistant",
    office: "Edinburgh",
    age: 57,
    startDate: "25 Apr, 2027",
    salary: "$89,500",
    id: 1,
  },
  {
    user: "Charlotte Anderson",
    position: "Marketing Manager",
    office: "London",
    age: 42,
    startDate: "12 Mar, 2025",
    salary: "$105,000",
    id: 2,
  },
  {
    user: "Ethan Brown",
    position: "Software Engineer",
    office: "San Francisco",
    age: 30,
    startDate: "01 Jan, 2024",
    salary: "$120,000",
    id: 3,
  },
  {
    user: "Isabella Davis",
    position: "UI/UX Designer",
    office: "Austin",
    age: 29,
    startDate: "18 Jul, 2025",
    salary: "$92,000",
    id: 4,
  },
  {
    user: "James Wilson",
    position: "Data Analyst",
    office: "Chicago",
    age: 28,
    startDate: "20 Sep, 2025",
    salary: "$80,000",
    id: 5,
  },
  {
    user: "Liam Moore",
    position: "DevOps Engineer",
    office: "Boston",
    age: 33,
    startDate: "30 Oct, 2024",
    salary: "$115,000",
    id: 6,
  },
  {
    user: "Mia Garcia",
    position: "Content Strategist",
    office: "Denver",
    age: 27,
    startDate: "12 Dec, 2027",
    salary: "$70,000",
    id: 7,
  },
  {
    user: "Olivia Johnson",
    position: "HR Specialist",
    office: "Los Angeles",
    age: 40,
    startDate: "08 Nov, 2026",
    salary: "$75,000",
    id: 8,
  },
  {
    user: "Sophia Martinez",
    position: "Product Manager",
    office: "New York",
    age: 35,
    startDate: "15 Jun, 2026",
    salary: "$95,000",
    id: 9,
  },
  {
    user: "William Smith",
    position: "Financial Analyst",
    office: "Seattle",
    age: 38,
    startDate: "03 Feb, 2026",
    salary: "$88,000",
    id: 10,
  },
  {
    user: "Zoe Young",
    position: "Research Scientist",
    office: "Zurich",
    age: 32,
    startDate: "10 May, 2024",
    salary: "$130,000",
    id: 11,
  },
  {
    user: "David Kim",
    position: "IT Support",
    office: "Sydney",
    age: 45,
    startDate: "14 Feb, 2023",
    salary: "$65,000",
    id: 12,
  },
];

export const employeeColumns = [
  { key: "user", label: "User", sortable: true },
  { key: "position", label: "Position", sortable: true },
  { key: "office", label: "Office", sortable: true },
  { key: "age", label: "Age", sortable: true },
  { key: "startDate", label: "Start Date", sortable: true },
  { key: "salary", label: "Salary", sortable: true },
];

export const formColumns = [
  { key: "user", label: "User", type: "text", required: true },
  { key: "position", label: "Position", type: "text", required: true },
  { key: "office", label: "Office", type: "text", required: false },
  { key: "age", label: "Age", type: "number", required: false },
  {
    key: "startDate",
    label: "Start Date (e.g., 01 Jan, 2024)",
    type: "text",
    required: false,
  },
  {
    key: "salary",
    label: "Salary (e.g., $100,000)",
    type: "text",
    required: false,
  },
];
