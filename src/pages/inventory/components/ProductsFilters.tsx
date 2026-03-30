import { useState, useEffect } from 'react';
import { Search, Plus, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { productService } from '@/services/products';
import type { Category, CategoriesResponse } from '@/services/products/types';

interface ProductsFiltersProps {
  search: string;
  categoryId: string;
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onManageCategories: () => void;
  onAddProduct: () => void;
}

export const ProductsFilters = ({
  search,
  categoryId,
  onSearch,
  onCategoryChange,
  onManageCategories,
  onAddProduct,
}: ProductsFiltersProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    productService.getCategories().then((res: CategoriesResponse) => {
      setCategories(res.data);
    });
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card p-4 rounded-lg border border-border shadow-sm mb-6">
      <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative flex-1 sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Cari produk atau SKU..."
            className="pl-9"
          />
        </div>
        
        <Select value={categoryId} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <Button variant="outline" onClick={onManageCategories} className="flex-1 md:flex-initial">
          <Tags size={16} className="mr-2" />
          Kategori
        </Button>
        <Button onClick={onAddProduct} className="flex-1 md:flex-initial">
          <Plus size={16} className="mr-2" />
          Tambah Produk
        </Button>
      </div>
    </div>
  );
};
