import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Define a set of default colors for the pie slices
const DEFAULT_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00c49f', '#ff4560'];

/**
 *
 * @param {Array<Object>} data - The data array for the chart.
 * @param {string} dataKey - The key from the data object to use for the pie slice size (e.g., 'value', 'count').
 * @param {string} nameKey - The key from the data object to use for the slice label/name (e.g., 'name', 'category').
 * @param {Array<string>} colors - Optional array of hex color strings to cycle through for slices.
 * @param {number} innerRadius - The inner radius of the pie chart (for donut style).
 * @param {number} outerRadius - The outer radius of the pie chart.
 * @param {boolean} showLegend - Whether to display the Legend.
 */
export default function PieGraph({
  data,
  dataKey = 'value',
  nameKey = 'name',
  colors = DEFAULT_COLORS,
  innerRadius = 60, // Default for a donut chart
  outerRadius = 80,
  showLegend = true,
  height = 300,
}) {
  if (!data || data.length === 0) {
    return <div className="text-center p-8 text-gray-500">No chart data available.</div>;
  }

  // Custom Tooltip formatter (optional)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div 
          className="bg-white p-2 border border-gray-300 rounded-md shadow-lg"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          }} 
        >
          <p className="font-bold text-gray-800">{`${item.name} : ${item.value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          
          <Tooltip content={<CustomTooltip />} />
          
          {showLegend && (
            <Legend 
              layout="horizontal" // or 'vertical'
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: 15 }}
            />
          )}

          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%" // Center X position
            cy="50%" // Center Y position
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8" // Base fill color, overridden by Cell
            paddingAngle={2} // Space between slices
            stroke="none" // Remove white stroke between slices
          >
            {/* Map over data to assign colors to each slice */}
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
                tabIndex="-1"
                /* Use !important to override any conflicting global CSS rules */
                style={{ outline: 'none !important' }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}