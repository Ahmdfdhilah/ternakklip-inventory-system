import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, ListChecks } from 'lucide-react';
import { formatNumber } from '@/utils/numberUtils';

interface DashboardStatsProps {
  stats: {
    totalStock: number;
    lowStockCount: number;
    totalProducts: number;
  };
  loading?: boolean;
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  const cards = [
    {
      title: 'Total Barang',
      value: stats.totalProducts,
      icon: Package,
      description: 'Jenis produk unik',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Total Stok',
      value: stats.totalStock,
      icon: ListChecks,
      description: 'Unit barang tersedia',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Stok Menipis',
      value: stats.lowStockCount,
      icon: AlertTriangle,
      description: 'Butuh pengadaan segera',
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-none shadow-sm overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : formatNumber(card.value)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
