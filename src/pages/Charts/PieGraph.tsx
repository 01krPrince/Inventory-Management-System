import { FC } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
  // TooltipProps is still imported but we'll use a specific interface below
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

// Define the shape of a single data entry
interface ChartDataEntry {
  [key: string]: any; // Allows flexible data properties
  name: string; // Ensure name is always a string for nameKey
  value: number; // Ensure value is a number for dataKey
}

// Define the props for the PieGraph component
interface PieGraphProps {
  data: ChartDataEntry[];
  dataKey?: string;
  nameKey?: string;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  height?: number;
}

// --- FIX: Define explicit props for the custom Tooltip content component ---
interface CustomTooltipContentProps {
  active?: boolean;
  // Payload is an array of objects describing the active data points.
  // We explicitly define its structure to resolve the TS error.
  payload?: Array<{
    name: NameType;
    value: ValueType;
    payload: ChartDataEntry; // The actual data object
    color: string;
    // Add index signature for flexibility
    [key: string]: any;
  }>;
  label?: NameType;
}
// --- END FIX ---

// Define a set of default colors for the pie slices
const DEFAULT_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#00c49f",
  "#ff4560",
];

/**
 * Reusable Pie/Donut Chart component using recharts.
 */
export default function PieGraph({
  data,
  dataKey = "value",
  nameKey = "name",
  colors = DEFAULT_COLORS,
  innerRadius = 60,
  outerRadius = 80,
  showLegend = true,
  height = 300,
}: PieGraphProps) {
  // Use the defined interface for props
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No chart data available.
      </div>
    );
  }

  // Custom Tooltip component, explicitly typed using CustomTooltipContentProps
  const CustomTooltip: FC<CustomTooltipContentProps> = ({
    active,
    payload,
  }) => {
    // Only proceed if active and payload are truthy and payload has items
    if (active && payload && payload.length) {
      // The payload item contains the necessary name and value fields
      const item = payload[0];
      return (
        <div
          className="bg-white p-2 border border-gray-300 rounded-md shadow-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          {/* Use item.name and item.value directly for display */}
          <p className="font-bold text-gray-800">{`${item.name} : ${item.value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          {/* Pass the CustomTooltip component */}
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: 15 }}
            />
          )}

          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                tabIndex={-1}
                style={{ outline: "none !important" }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
