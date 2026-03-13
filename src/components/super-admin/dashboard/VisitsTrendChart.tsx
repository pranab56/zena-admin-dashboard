import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface VisitsData {
  month: string;
  visits: number;
}

interface VisitsTrendChartProps {
  visitsData: VisitsData[];
  highlightedMonth: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: VisitsData;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  const { t } = useTranslation();
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm">
        {t('total_visits')} {payload[0].value}
      </div>
    );
  }
  return null;
};

const VisitsTrendChart = ({ visitsData, highlightedMonth }: VisitsTrendChartProps) => {
  const { t } = useTranslation();
  return (
    <Card className="border-0 shadow">
      <CardHeader className="p-5 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-serif">{t('visits_trend')}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visitsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitsTrendChart;