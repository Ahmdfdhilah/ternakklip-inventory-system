import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/services/products/types';
import { formatRelativeTime } from '@/utils/dateUtils';
import { Package } from 'lucide-react';

interface LatestProductsProps {
  products: Product[];
  loading?: boolean;
}

export function LatestProducts({ products, loading }: LatestProductsProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-none shadow-sm h-full bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Produk Terbaru</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')} className="text-xs font-medium text-primary hover:bg-primary/5">
          Lihat semua
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="py-10 text-center text-muted-foreground text-sm italic">Memuat data produk...</div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-sm italic">Belum ada produk.</div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="flex items-center justify-between group py-1">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors shrink-0">
                    <Package size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Diperbarui {formatRelativeTime(product.last_updated)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0 pl-2">
                  <p className="text-xs font-bold tabular-nums">
                    {product.stock_count} 
                    <span className="text-[10px] font-normal text-muted-foreground ml-1">unit</span>
                  </p>
                  {product.category?.name && (
                    <p className="text-[10px] text-muted-foreground max-w-[80px] truncate">
                      {product.category.name}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
