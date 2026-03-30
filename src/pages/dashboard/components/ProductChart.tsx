import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CHART_OTHER_COLOR } from '@/constants';
import { formatNumber } from '@/utils/numberUtils';

interface CategoryStock {
  name: string;
  count: number;
  total: number;
  color: string;
}

interface ProductChartProps {
  data: CategoryStock[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-3 rounded-lg shadow-md">
        <p className="text-sm font-semibold mb-1">{data.name}</p>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].fill }} />
          <p className="text-xs text-muted-foreground">
            Stok: <span className="font-medium text-foreground">{formatNumber(data.count)} unit</span>
          </p>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 italic">
          {((data.count / data.total) * 100).toFixed(1)}% dari total stok
        </p>
      </div>
    );
  }
  return null;
};

export function ProductChart({ data, loading }: ProductChartProps) {
  // Group categories if more than 6
  const processedData = (() => {
    if (data.length <= 6) return data;
    
    const sorted = [...data].sort((a, b) => b.count - a.count);
    const top5 = sorted.slice(0, 5);
    const others = sorted.slice(5);
    const otherCount = others.reduce((acc, cat) => acc + cat.count, 0);
    const total = data[0]?.total || 0;
    
    return [
      ...top5,
      {
        name: 'Lainnya',
        count: otherCount,
        total: total,
        color: CHART_OTHER_COLOR
      }
    ];
  })();

  return (
    <Card className="border-none shadow-sm col-span-1 lg:col-span-2 overflow-hidden bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Distribusi Stok per Kategori</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px] w-full pt-0">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            Memuat grafik...
          </div>
        ) : data.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            Tidak ada data untuk ditampilkan.
          </div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                  stroke="none"
                  animationDuration={1000}
                >
                  {processedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  dy={-15}
                  className="fill-foreground font-bold text-3xl tabular-nums"
                >
                  {formatNumber(data[0]?.total || 0)}
                </text>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  dy={10}
                  className="fill-muted-foreground font-medium text-[10px] uppercase tracking-wider"
                >
                  Total Stok
                </text>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }}
                  formatter={(value) => <span className="text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
