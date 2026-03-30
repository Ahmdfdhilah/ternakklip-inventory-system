import { useEffect, useState, useCallback } from 'react';
import { useLayoutStore } from '@/stores/layoutStore';
import { useURLFilters } from '@/hooks/useURLFilters';
import { productService } from '@/services/products';
import type { Product, ProductFilters } from '@/services/products/types';
import { ProductsTable } from './components/ProductsTable';
import { ProductDialog } from './components/ProductDialog';
import { ProductsFilters } from './components/ProductsFilters';
import { CategoryDialog } from './components/CategoryDialog';
import { ConfirmDialog, Pagination } from '@/components/common';
import { toast } from 'sonner';

interface PageFilters extends Record<string, string | number | undefined> {
  search?: string;
  category_id?: string;
  sort_by?: string;
  sort_dir?: string;
  page?: number;
  limit?: number;
}

export default function ProductsPage() {
  const { setHeader } = useLayoutStore();
  const { filters, setFilter, setFilters } = useURLFilters<PageFilters>({ 
    page: 1, 
    limit: 20, 
    sort_by: 'created_at', 
    sort_dir: 'desc',
    category_id: 'all'
  });

  const [data, setData] = useState<Product[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setHeader({
      title: 'Manajemen Inventaris',
      description: 'Kelola stok barang, kategori, dan pantau ketersediaan produk.',
      breadcrumb: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Inventaris' }
      ]
    });
  }, [setHeader]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts(filters as ProductFilters);
      setData(res.data);
      setMeta(res.meta);
    } catch (error) {
      toast.error('Gagal mengambil data produk');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const subscription = productService.subscribeToStockChanges(() => {
      fetchData();
    });
    return () => { subscription.unsubscribe(); };
  }, []);

  const handleSort = (field: keyof Product) => {
    if (filters.sort_by === field) {
      setFilter('sort_dir', filters.sort_dir === 'asc' ? 'desc' : 'asc');
    } else {
      setFilters({ sort_by: field, sort_dir: 'asc' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await productService.deleteProduct(selectedProduct.id);
      toast.success('Produk berhasil dihapus');
      setConfirmDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Gagal menghapus produk');
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-4  px-6 pb-6">
      <ProductsFilters
        search={filters.search || ''}
        categoryId={filters.category_id || 'all'}
        onSearch={(v) => setFilter('search', v || undefined)}
        onCategoryChange={(v) => setFilter('category_id', v)}
        onManageCategories={() => setCategoryDialogOpen(true)}
        onAddProduct={() => { setSelectedProduct(null); setProductDialogOpen(true); }}
      />

      <ProductsTable 
        products={data}
        isLoading={loading}
        sortBy={filters.sort_by as keyof Product}
        sortDir={(filters.sort_dir as 'asc' | 'desc') || 'desc'}
        onSort={handleSort}
        onEdit={(p) => { setSelectedProduct(p); setProductDialogOpen(true); }}
        onDelete={(p) => { setSelectedProduct(p); setConfirmDeleteDialogOpen(true); }}
      />

      {meta && meta.total_pages > 1 && (
        <Pagination
          page={filters.page || 1}
          limit={meta.limit}
          totalItems={meta.total_items}
          totalPages={meta.total_pages}
          onPageChange={(p) => setFilter('page', p)}
          onLimitChange={(l) => setFilter('limit', l)}
        />
      )}

      <ProductDialog 
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        product={selectedProduct}
        onSuccess={fetchData}
      />

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onSuccess={fetchData}
      />

      <ConfirmDialog
        open={confirmDeleteDialogOpen}
        onOpenChange={setConfirmDeleteDialogOpen}
        title="Hapus Produk"
        description={`Apakah Anda yakin ingin menghapus "${selectedProduct?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
