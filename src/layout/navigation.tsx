import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ListIcon,
  TableIcon,
  PageIcon,
  PieChartIcon,
  BoxCubeIcon,
  PlugInIcon,
} from "../components/icons"; // Assume icons are exported from './icons'

export const navItems = [
  {
    icon: <GridIcon className="w-5 h-5" />,
    name: "Sale",
    subItems: [
      { name: "Customer", path: "/customer", pro: false },
      {
        name: "Sale Price List",
        path: "/sale-price-list-parent",
        pro: false,
        nestedItems: [
          { name: "Price List", path: "/price-list" },
          {
            name: "Party-Sale Discount Rate",
            path: "/party-sale-discount-rate",
          },
          {
            name: "Brandwise Discount/Charges",
            path: "/brandwise-discount-charges",
          },
          {
            name: "Party-Brandwise Discount/Charges",
            path: "/party-brandwise-discount-charges",
          },
          {
            name: "Update Price For Single Item",
            path: "/update-price-for-single-item",
          },
          {
            name: "Update Barcode Rate",
            path: "/update-barcode-rate",
          },
          {
            name: "Update Barcode Discount",
            path: "/update-barcode-discount",
          },
        ],
      },
      { name: "Estimate", path: "/estimate", pro: false },
      { name: "Sales Order", path: "/sales-order", pro: false },
      { name: "Dispatch", path: "/dispatch", pro: false },
      {
        name: "Sales Return Challan",
        path: "/sales-return-challan",
        pro: false,
      },
      { name: "Sale Invoice", path: "/sale-invoice", pro: false },
      { name: "Sales Credit Note", path: "/sales-credit-note", pro: false },
      { name: "Sales Debit Note", path: "/sales-debit-note", pro: false },
      { name: "Sales Return", path: "/sales-return", pro: false },
      { name: "Payment Receipt", path: "/payment-receipt", pro: false },
      { name: "Cheque Return", path: "/cheque-return", pro: false },
      { name: "Update Logistic", path: "/update-logistic", pro: false },
      {
        name: "Bulk Dispatch/Invoice",
        path: "/bulk-dispatch-invoice",
        pro: false,
      },
      { name: "E-Commerce (1)", path: "/e-commerce-1", pro: false },
      { name: "E-Commerce (2)", path: "/e-commerce-2", pro: false },
    ],
  },
  {
    icon: <CalenderIcon className="w-5 h-5" />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <UserCircleIcon className="w-5 h-5" />,
    name: "User Profile",
    path: "/profile",
  },
  {
    name: "Forms",
    icon: <ListIcon className="w-5 h-5" />,
    subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    name: "Tables",
    icon: <TableIcon className="w-5 h-5" />,
    subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  },
  {
    name: "Pages",
    icon: <PageIcon className="w-5 h-5" />,
    subItems: [
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
    ],
  },
];

export const othersItems = [
  {
    name: "Charts",
    icon: <PieChartIcon className="w-5 h-5" />,
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    name: "UI Elements",
    icon: <BoxCubeIcon className="w-5 h-5" />,
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    name: "Authentication",
    icon: <PlugInIcon className="w-5 h-5" />,
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

export const allItems = [...navItems, ...othersItems];
