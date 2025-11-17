import ComponentCard from "../../components/common/ComponentCard";
import BarChartOne from "../../components/charts/bar/BarChartOne";
import PageMeta from "../../components/common/PageMeta";

export default function BarChart() {
  return (
    <div>
      <PageMeta
        title="Inventory | React.js Chart Dashboard | Inventory - React.js Admin Dashboard Template"
        description="This is React.js Chart Dashboard page for Inventory - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="space-y-6">
        <ComponentCard title="Sales Chart">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
