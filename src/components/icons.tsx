import React from "react";
import {
  LuLayoutGrid,
  LuCalendar,
  LuCircleUser,
  LuList,
  LuTable,
  LuFile,
  LuChartPie, // FIXED: Was LuPieChart
  LuBox,
  LuPlug,
  LuChevronRight,
  LuSearch,
  LuTrash2,
  LuPlus,
  LuPencil,
  LuUpload,
  LuPrinter,
  LuChevronUp,
  LuChevronDown,
  LuTrendingUp,
  LuShoppingCart,
  LuLandmark,
  LuPackage,
  LuMonitor,
  LuFactory,
  LuBuilding2,
  LuUsers,
  LuFileChartColumn, // FIXED: Was LuFileBarChart
  LuFolderOpen,
  LuCopy,
  LuX,
  LuRotateCcw,
  LuCalculator,
  LuCircleHelp, // FIXED: Was LuHelpCircle
  LuSettings,
} from "react-icons/lu";

type IconProps = React.SVGProps<SVGSVGElement>;

// --- Fixes for the specific errors you found ---

// FIXED: LuPieChart -> LuChartPie
export const PieChartIcon = (props: IconProps) => <LuChartPie {...props} />;

// FIXED: LuFileBarChart -> LuFileChartColumn
export const ReportIcon = (props: IconProps) => (
  <LuFileChartColumn {...props} />
);
export const ChartIcon = (props: IconProps) => <LuFileChartColumn {...props} />;

// FIXED: LuHelpCircle -> LuCircleHelp
export const HelpIcon = (props: IconProps) => <LuCircleHelp {...props} />;

// --- Rest of the icons (unchanged) ---

export const GridIcon = (props: IconProps) => <LuLayoutGrid {...props} />;
export const CalenderIcon = (props: IconProps) => <LuCalendar {...props} />;
export const UserCircleIcon = (props: IconProps) => <LuCircleUser {...props} />;
export const ListIcon = (props: IconProps) => <LuList {...props} />;
export const TableIcon = (props: IconProps) => <LuTable {...props} />;
export const PageIcon = (props: IconProps) => <LuFile {...props} />;
export const BoxCubeIcon = (props: IconProps) => <LuBox {...props} />;
export const PlugInIcon = (props: IconProps) => <LuPlug {...props} />;
export const ChevronRightIcon = (props: IconProps) => (
  <LuChevronRight {...props} />
);
export const SearchIcon = (props: IconProps) => <LuSearch {...props} />;
export const TrashIcon = (props: IconProps) => <LuTrash2 {...props} />;
export const PlusIcon = (props: IconProps) => <LuPlus {...props} />;
export const EditIcon = (props: IconProps) => <LuPencil {...props} />;
export const ExportIcon = (props: IconProps) => <LuUpload {...props} />;
export const PrintIcon = (props: IconProps) => <LuPrinter {...props} />;
export const ChevronUpIcon = (props: IconProps) => <LuChevronUp {...props} />;
export const ChevronDownIcon = (props: IconProps) => (
  <LuChevronDown {...props} />
);
export const SaleIcon = (props: IconProps) => <LuTrendingUp {...props} />;
export const PurchaseIcon = (props: IconProps) => <LuShoppingCart {...props} />;
export const FinanceIcon = (props: IconProps) => <LuLandmark {...props} />;
export const InventoryIcon = (props: IconProps) => <LuPackage {...props} />;
export const PosIcon = (props: IconProps) => <LuMonitor {...props} />;
export const ProductionIcon = (props: IconProps) => <LuFactory {...props} />;
export const AssetIcon = (props: IconProps) => <LuBuilding2 {...props} />;
export const EmployeeIcon = (props: IconProps) => <LuUsers {...props} />;
export const OpenIcon = (props: IconProps) => <LuFolderOpen {...props} />;
export const DeleteIcon = (props: IconProps) => <LuTrash2 {...props} />;
export const CopyIcon = (props: IconProps) => <LuCopy {...props} />;
export const CancelIcon = (props: IconProps) => <LuX {...props} />;
export const RestoreIcon = (props: IconProps) => <LuRotateCcw {...props} />;
export const CalculatorIcon = (props: IconProps) => <LuCalculator {...props} />;
export const ConfigurationIcon = (props: IconProps) => (
  <LuSettings {...props} />
);
export const DocumentIcon = (props: IconProps) => <LuFile {...props} />;
