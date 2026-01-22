import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface PointsData {
  name: string;
  value: number;
  fill: string;
}

interface PointsPieChartProps {
  pointsData: PointsData[];
}

const PointsPieChart = ({ pointsData }: PointsPieChartProps) => {
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
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-xs text-gray-500">1.0k</div>
            </div>
          </div>
          <div className="ml-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              <span className="text-sm text-gray-600">Redeemed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-300"></div>
              <span className="text-sm text-gray-600">Earned</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsPieChart;