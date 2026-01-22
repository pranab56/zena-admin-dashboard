import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface VisitsData {
  month: string;
  visits: number;
}

interface VisitsTrendChartProps {
  visitsData: VisitsData[];
  highlightedMonth: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm">
        Total Visits {(payload[0].value / 1000).toFixed(1)}k
      </div>
    );
  }
  return null;
};

const VisitsTrendChart = ({ visitsData, highlightedMonth }: VisitsTrendChartProps) => {
  return (
    <Card className="border-0 shadow">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Visits Trend Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={visitsData}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 14 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 14 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="visits" radius={[8, 8, 0, 0]}>
              {visitsData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.month === highlightedMonth ? '#EC4899' : '#FDE2E4'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VisitsTrendChart;