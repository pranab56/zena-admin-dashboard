import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';

interface PointsData {
  name: string;
  value: number;
  fill: string;
  [key: string]: string | number;
}

interface PointsPieChartProps {
  pointsData: PointsData[];
}

// Type for Recharts tooltip payload
interface TooltipPayload {
  name: string;
  value: number;
  payload: PointsData;
  dataKey: string;
  color: string;
  fill: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: TooltipPayload[];
}

const PointsPieChart = ({ pointsData }: PointsPieChartProps) => {
  const total = pointsData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].value.toLocaleString()} points
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-0 shadow">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Points Earned vs Redeemed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative">
            <ResponsiveContainer width={250} height={250}>
              <PieChart>
                <Pie
                  data={pointsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {pointsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-xs text-gray-500">{(total / 1000).toFixed(1)}k</div>
            </div>
          </div>
          <div className="ml-8 space-y-4">
            {pointsData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                ></div>
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsPieChart;