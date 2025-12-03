









// used



import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics() {
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
      icon: GroupIcon, // Assuming refunds might also use a Group or a different icon like Money/Refresh
    },
    {
      name: "New Users",
      value: "1,029",
      change: "8.44%",
      trend: "up",
      icon: GroupIcon,
    },
  ];

  // The grid layout is moved outside the map to contain all items.
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:gap-6 w-full"> 
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
  );
}