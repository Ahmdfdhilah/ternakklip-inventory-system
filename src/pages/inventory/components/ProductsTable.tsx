import { useState } from 'react';
import {
  Columns3,
  MoreVertical,
  Pencil,
  Trash2,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import type { Product } from '@/services/products/types';
import { SortableHeader } from '@/components/common/SortableHeader';
import { formatCurrency } from '@/utils/numberUtils';
import { formatDate } from '@/utils/dateUtils';

interface Column {
  key: string;
  label: string;
  hideable: boolean;
}

const COLUMNS: Column[] = [
  { key: 'category', label: 'Kategori', hideable: true },
  { key: 'sku', label: 'SKU', hideable: true },
  { key: 'stock', label: 'Stok', hideable: true },
  { key: 'price', label: 'Harga', hideable: true },
  { key: 'updated_at', label: 'Terakhir', hideable: true },
];

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  sortBy: keyof Product | undefined;
  sortDir: 'asc' | 'desc';
  onSort: (field: keyof Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductsTable = ({
  products,
  isLoading,
  sortBy,
  sortDir,
  onSort,
  onEdit,
  onDelete,
}: ProductsTableProps) => {
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({
    category: true,
    sku: true,
    stock: true,
    price: true,
    updated_at: true,
  });

  const toggleCol = (key: string) =>
    setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }));

  const headerRow = (
    <TableRow>
      <SortableHeader field="name" sortBy={sortBy} sortDir={sortDir} onSort={onSort}>
        Produk
      </SortableHeader>
      
      {visibleCols.category && (
        <SortableHeader field="category_id" sortBy={sortBy} sortDir={sortDir} onSort={onSort}>
          Kategori
        </SortableHeader>
      )}

      {visibleCols.sku && (
        <SortableHeader 
          field="sku" 
          sortBy={sortBy} 
          sortDir={sortDir} 
          onSort={onSort}
          className="hidden md:table-cell"
        >
          SKU
        </SortableHeader>
      )}

      {visibleCols.stock && (
        <SortableHeader 
          field="stock_count" 
          sortBy={sortBy} 
          sortDir={sortDir} 
          onSort={onSort}
          className="text-right"
          containerClassName="justify-end"
        >
          Stok
        </SortableHeader>
      )}

      {visibleCols.price && (
        <SortableHeader 
          field="price" 
          sortBy={sortBy} 
          sortDir={sortDir} 
          onSort={onSort}
          className="text-right hidden lg:table-cell"
          containerClassName="justify-end"
        >
          Harga
        </SortableHeader>
      )}

      {visibleCols.updated_at && (
        <SortableHeader 
          field="last_updated" 
          sortBy={sortBy} 
          sortDir={sortDir} 
          onSort={onSort}
          className="hidden xl:table-cell"
        >
          Terakhir
        </SortableHeader>
      )}

      <TableHead className="w-10 text-right">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Columns3 size={14} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Kolom</p>
            {COLUMNS.filter((c) => c.hideable).map((col) => (
              <div key={col.key} className="flex items-center gap-2">
                <Checkbox
                  id={`col-${col.key}`}
                  checked={visibleCols[col.key]}
                  onCheckedChange={() => toggleCol(col.key)}
                />
                <Label htmlFor={`col-${col.key}`} className="text-sm cursor-pointer">
                  {col.label}
                </Label>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </TableHead>
    </TableRow>
  );

  if (isLoading) {
    return (
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>{headerRow}</TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </TableCell>
                {visibleCols.category && <TableCell><Skeleton className="h-5 w-20" /></TableCell>}
                {visibleCols.sku && <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-16" /></TableCell>}
                {visibleCols.stock && <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>}
                {visibleCols.price && <TableCell className="text-right hidden lg:table-cell"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>}
                {visibleCols.updated_at && <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-24" /></TableCell>}
                <TableCell><Skeleton className="h-7 w-7 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Empty className="border bg-card">
        <EmptyHeader>
          <EmptyMedia variant="icon"><Package /></EmptyMedia>
          <EmptyTitle>Tidak ada produk ditemukan</EmptyTitle>
          <EmptyDescription>Coba ubah filter pencarian atau tambah produk baru.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="rounded-md border bg-card shadow-sm">
      <Table>
        <TableHeader>{headerRow}</TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
              <TableCell>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground lg:hidden">
                    SKU: {product.sku || '-'}
                  </p>
                </div>
              </TableCell>

              {visibleCols.category && (
                <TableCell className="text-sm">
                  {product.category?.name || 'Tanpa Kategori'}
                </TableCell>
              )}

              {visibleCols.sku && (
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {product.sku || '-'}
                </TableCell>
              )}

              {visibleCols.stock && (
                <TableCell className="text-right">
                  <span className={`text-sm font-medium ${product.stock_count <= product.min_stock_level ? 'text-destructive animate-pulse' : ''}`}>
                    {product.stock_count}
                  </span>
                </TableCell>
              )}

              {visibleCols.price && (
                <TableCell className="text-right hidden lg:table-cell text-sm font-medium">
                  {formatCurrency(product.price)}
                </TableCell>
              )}

              {visibleCols.updated_at && (
                <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                  {formatDate(product.last_updated)}
                </TableCell>
              )}

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto flex hover:bg-muted">
                      <MoreVertical size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(product)} className="cursor-pointer">
                      <Pencil size={14} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive font-medium cursor-pointer"
                      onClick={() => onDelete(product)}
                    >
                      <Trash2 size={14} className="mr-2" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
