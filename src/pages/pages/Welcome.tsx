import PageMeta from "../../components/common/PageMeta";
import PieGraph from "../Charts/PieGraph";
import BarChart from "../Charts/BarChart";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../../components/ui/badge/Badge";

export default function Welcome() {
  const metrics = [
    {
      name: "Customers",
      value: "3,782",
      change: "11.01%",
      trend: "up",
      icon: GroupIcon,
    },
    {
      name: "Orders",
      value: "5,359",
      change: "9.05%",
      trend: "down",
      icon: BoxIconLine,
    },
    {
      name: "Revenue",
      value: "$12,845",
      change: "5.72%",
      trend: "up",
      icon: BoxIconLine,
    },
    {
      name: "Refunds",
      value: "148",
      change: "3.21%",
      trend: "down",
      icon: GroupIcon,
    },
    {
      name: "New Users",
      value: "1,029",
      change: "8.44%",
      trend: "up",
      icon: GroupIcon,
    },
  ];

  const salesDistributionData = [
    { name: "Total Sales", value: 4000 + 3000 + 2000 + 2780 + 1890 + 2390 }, // 16060
    { name: "Total Expenses", value: 2400 + 1398 + 9800 + 3908 + 4800 + 3800 }, // 26106
  ];
  const salesColors = ["#00C49F", "#FF8042"];

  const orderStatusData = [
    { name: "Delivered", value: 850 },
    { name: "Shipped", value: 90 },
    { name: "Processing", value: 60 },
  ];
  const statusColors = ["#10B981", "#3B82F6", "#F59E0B"];

  const revenueSplitData = [
    { name: "Electronics", value: 5500 },
    { name: "Clothing", value: 3500 },
    { name: "Accessories", value: 2500 },
    { name: "Services", value: 1345 },
  ];
  const revenueColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff4560"];

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | inventory - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for inventory - React.js Tailwind CSS Admin Dashboard Template"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:gap-6 w-full mb-6">
        {/* Set a responsive grid to display all metrics */}
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isUp = metric.trend === "up";
          const TrendIcon = isUp ? ArrowUpIcon : ArrowDownIcon;
          const badgeColor = isUp ? "success" : "error";

          return (
            // Metric Item Start - Using the static JSX structure for the card layout
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
            >
              {/* Icon section */}
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <Icon className="text-gray-800 size-6 dark:text-white/90" />
              </div>

              {/* Value and Badge section */}
              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {metric.name}
                  </span>
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    {metric.value}
                  </h4>
                </div>

                {/* Badge for trend */}
                <Badge color={badgeColor}>
                  <TrendIcon />
                  {metric.change}
                </Badge>
              </div>
            </div>
            // Metric Item End
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Sales vs. Expenses
          </h3>
          <PieGraph
            data={salesDistributionData}
            dataKey="value"
            nameKey="name"
            colors={salesColors}
            innerRadius={70}
            outerRadius={100}
            height={250}
            showLegend={true}
          />
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Order Status
          </h3>
          <PieGraph
            data={orderStatusData}
            dataKey="value"
            nameKey="name"
            colors={statusColors}
            innerRadius={0}
            outerRadius={100}
            height={250}
            showLegend={true}
          />
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Revenue Split by Product
          </h3>
          <PieGraph
            data={revenueSplitData}
            dataKey="value"
            nameKey="name"
            colors={revenueColors}
            innerRadius={60}
            outerRadius={95}
            height={250}
            showLegend={true}
          />
        </div>
      </div>
      <BarChart />
    </>
  );
}
