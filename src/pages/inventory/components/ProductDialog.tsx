import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Check, X } from 'lucide-react';
import { productService } from '@/services/products';
import type { Product, Category } from '@/services/products/types';
import { toast } from 'sonner';
import { formatNumber, parseNumber } from '@/utils/numberUtils';

const productSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  sku: z.string().optional().nullable(),
  category_id: z.string().optional().nullable(),
  stock_count: z.number().min(0, 'Stok tidak boleh negatif'),
  min_stock_level: z.number().min(0, 'Minimal stok tidak boleh negatif'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  image_url: z.string().optional().nullable(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSuccess: () => void;
}

export function ProductDialog({ open, onOpenChange, product, onSuccess }: ProductDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);


  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      category_id: '',
      stock_count: 0,
      min_stock_level: 10,
      price: 0,
      image_url: '',
    },
    mode: 'onChange'
  });

  const loadCategories = useCallback(async () => {
    const res = await productService.getCategories();
    setCategories(res.data);
  }, []);

  useEffect(() => {
    if (open) {
      loadCategories();
      if (product) {
        form.reset({
          name: product.name,
          sku: product.sku || '',
          category_id: product.category_id?.toString() || '',
          stock_count: Number(product.stock_count),
          min_stock_level: Number(product.min_stock_level),
          price: Number(product.price),
          image_url: product.image_url || '',
        });
      } else {
        form.reset({
          name: '',
          sku: '',
          category_id: '',
          stock_count: 0,
          min_stock_level: 10,
          price: 0,
          image_url: '',
        });
      }
    }
  }, [open, product, form, loadCategories]);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const res = await productService.createCategory(newCatName.trim());
      if (res.data) {
        setCategories(prev => [...prev, res.data]);
        form.setValue('category_id', res.data.id.toString());
        setNewCatName('');
        setShowAddCategory(false);
        toast.success(`Kategori "${newCatName}" ditambahkan`);
      }
    } catch (error) {
      toast.error('Gagal menambahkan kategori');
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        category_id: values.category_id ? parseInt(values.category_id) : null,
      };

      if (product) {
        await productService.updateProduct(product.id, payload);
        toast.success('Produk berhasil diperbarui');
      } else {
        await productService.createProduct(payload);
        toast.success('Produk berhasil ditambahkan');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Ubah Produk' : 'Tambah Produk Baru'}</DialogTitle>
          <DialogDescription>
            Isi formulir di bawah ini untuk mengelola data barang inventaris.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Produk <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input placeholder="Contoh: T-Shirt Black" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl><Input placeholder="TS-001" {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <div className="flex flex-col gap-2">
                      {!showAddCategory ? (
                        <div className="flex gap-2">
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Pilih kategori" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            onClick={() => setShowAddCategory(true)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Nama kategori *" 
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            className="flex-1"
                            autoFocus
                          />
                          <Button type="button" size="icon" className="bg-emerald-500 hover:bg-emerald-600" onClick={handleAddCategory}>
                            <Check className="h-4 w-4 text-white" />
                          </Button>
                          <Button type="button" size="icon" variant="outline" onClick={() => setShowAddCategory(false)}>
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stok Saat Ini <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="0"
                        value={formatNumber(field.value)}
                        onChange={(e) => {
                          const raw = parseNumber(e.target.value);
                          if (/^\d*$/.test(raw)) {
                            field.onChange(raw === '' ? '' : Number(raw));
                          }
                        }}
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                    <div className="min-h-[1.25rem]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="min_stock_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stok Minimal (Alert) <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="0"
                        value={formatNumber(field.value)}
                        onChange={(e) => {
                          const raw = parseNumber(e.target.value);
                          if (/^\d*$/.test(raw)) {
                            field.onChange(raw === '' ? '' : Number(raw));
                          }
                        }}
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                    <div className="min-h-[1.25rem]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Satuan <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      placeholder="0"
                      value={formatNumber(field.value)}
                      onChange={(e) => {
                        const raw = parseNumber(e.target.value);
                        if (/^\d*$/.test(raw)) {
                          field.onChange(raw === '' ? '' : Number(raw));
                        }
                      }}
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
              <Button type="submit" disabled={loading || !form.formState.isValid}>{loading ? 'Menyimpan...' : 'Simpan Produk'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
