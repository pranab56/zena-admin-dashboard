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
        <div className="bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{payload[0].name}</p>
          <p className="text-lg font-black text-gray-900">
            {payload[0].value.toLocaleString()} PTS
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden flex flex-col h-full">
      <CardHeader className="px-6 sm:px-10 py-6 sm:py-8 border-b border-gray-50 bg-[#F9FAFB]/50">
        <CardTitle className="text-xl sm:text-2xl tracking-tight">Points Earned vs Redeemed</CardTitle>
      </CardHeader>
      <CardContent className="p-6 sm:p-10 flex-1 flex items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full">
          <div className="relative group">
            <ResponsiveContainer width={240} height={240}>
              <PieChart>
                <Pie
                  data={pointsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={8}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                  stroke="none"
                >
                  {pointsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-3xl font-black text-gray-900 leading-none group-hover:scale-110 transition-transform">{(total / 1000).toFixed(1)}k</div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Aggregate</div>
            </div>
          </div>
          <div className="flex flex-row lg:flex-col gap-6 flex-wrap justify-center">
            {pointsData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-4 group cursor-pointer">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border border-gray-50 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${entry.fill}20` }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">{entry.name}</span>
                  <span className="text-lg font-black text-gray-700 leading-none">{(entry.value / 1000).toFixed(1)}k</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsPieChart;