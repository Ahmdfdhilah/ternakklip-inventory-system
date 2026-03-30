import { useEffect, useState, useCallback } from 'react';
import { useLayoutStore } from '@/stores/layoutStore';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TopographyBackground } from '@/components/common/TopographyBackground';
import { Calendar } from 'lucide-react';
import type { CurrentUser } from '@/stores/authStore';
import { DashboardStats } from './components/DashboardStats';
import { ProductChart } from './components/ProductChart';
import { LatestProducts } from './components/LatestProducts';
import { productService } from '@/services/products';
import type { Category, Product } from '@/services/products/types';
import { toast } from 'sonner';
import { CHART_COLORS } from '@/constants';
import { formatDateFull } from '@/utils/dateUtils';

export default function DashboardPage() {
  const { setHeader } = useLayoutStore();
  const { userData } = useAuthStore();
  
  const [stats, setStats] = useState({ totalStock: 0, lowStockCount: 0, totalProducts: 0 });
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [s, c, p] = await Promise.all([
        productService.getDashboardStats(),
        productService.getCategories(),
        productService.getProducts({ sort_by: 'last_updated', sort_dir: 'desc', limit: 10 })
      ]);
      setStats(s);
      setLatestProducts(p.data);
      
      const { data: products } = await productService.getProducts({ limit: 1000 });
      const total = s.totalStock || 1;
      const distribution = c.data.map((cat: Category, idx: number) => {
        const count = products.filter(p => p.category_id === cat.id).reduce((acc, p) => acc + p.stock_count, 0);
        return { name: cat.name, count, total, color: CHART_COLORS[idx % CHART_COLORS.length] };
      });
      setCategoryData(distribution);
    } catch (error) {
      toast.error('Gagal memperbarui dashboard');
    } finally {
      setLoading(false);
    }
  }, [productService]);

  useEffect(() => {
    setHeader({
      title: 'Ringkasan Operasional',
      description: 'Pantau stok, kategori, dan produk terbaru di gudang Anda secara real-time.',
      breadcrumb: [{ label: 'Dashboard' }]
    });
    fetchData();
  }, [setHeader, fetchData]);

  useEffect(() => {
    const sub = productService.subscribeToStockChanges(() => {
      fetchData();
    });
    return () => { sub.unsubscribe(); };
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6">
      <DashboardHero userData={userData} />
      
      <DashboardStats stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductChart data={categoryData} loading={loading} />
        <LatestProducts products={latestProducts} loading={loading} />
      </div>
    </div>
  );
}

interface DashboardHeroProps {
  userData: CurrentUser | null;
}

export function DashboardHero({ userData }: DashboardHeroProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = formatDateFull(currentTime);
  const formattedTime = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <Card className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden rounded-xl border-0">
      <div className="absolute inset-0">
        <TopographyBackground />
      </div>
      <CardContent className="py-4 px-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-primary-foreground/30 shrink-0">
              <AvatarImage src={userData?.avatar_path ?? undefined} />
              <AvatarFallback className="text-base font-semibold bg-primary-foreground/20 text-primary-foreground">
                {userData?.name?.slice(0, 2).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-primary-foreground/70 text-sm font-light">Selamat datang,</p>
              <p className="text-primary-foreground text-xl sm:text-3xl font-semibold leading-tight truncate">
                {userData?.name ?? '—'}
              </p>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1.5">
            <span className="text-xl sm:text-3xl font-semibold tracking-wider text-primary-foreground tabular-nums">
              {formattedTime} <span className="text-sm sm:text-lg font-light">WIB</span>
            </span>
            <div className="flex items-center gap-2 bg-primary-foreground/10 py-1.5 px-3 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-primary-foreground/80 shrink-0" />
              <p className="text-xs sm:text-sm font-medium text-primary-foreground whitespace-nowrap">{formattedDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
