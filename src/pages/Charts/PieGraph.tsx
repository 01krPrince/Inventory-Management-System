import { FC } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface ChartDataEntry {
  [key: string]: any;
  name: string;
  value: number;
}

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

interface CustomTooltipContentProps {
  active?: boolean;
  payload?: Array<{
    name: NameType;
    value: ValueType;
    payload: ChartDataEntry;
    color: string;
    [key: string]: any;
  }>;
  label?: NameType;
}

const DEFAULT_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#00c49f",
  "#ff4560",
];

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
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No chart data available.
      </div>
    );
  }

  const CustomTooltip: FC<CustomTooltipContentProps> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div
          className="bg-white p-2 border border-gray-300 rounded-md shadow-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
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
