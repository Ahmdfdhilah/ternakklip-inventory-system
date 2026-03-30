import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  Tags
} from 'lucide-react';
import { productService } from '@/services/products';
import type { Category } from '@/services/products/types';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/common';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type DialogKind = 'delete' | 'update' | null;

export function CategoryDialog({ open, onOpenChange, onSuccess }: CategoryDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [confirmKind, setConfirmKind] = useState<DialogKind>(null);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const LIMIT = 10;

  const loadCategories = async (newPage = 1, append = false) => {
    setLoading(true);
    try {
      const { data, error } = await productService.getCategoriesPaginated(newPage, LIMIT);
      if (error) throw error;
      setCategories(prev => append ? [...prev, ...data] : data);
      setHasMore(data.length === LIMIT);
      setPage(newPage);
    } catch (error) {
      toast.error('Gagal mengambil data kategori');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadCategories(1, false);
  }, [open]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadCategories(page + 1, true);
    }
  };

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;
    setLoading(true);
    try {
      await productService.createCategory(newCategoryName.trim());
      setNewCategoryName('');
      loadCategories(1, false);
      onSuccess?.();
      toast.success('Kategori berhasil ditambahkan');
    } catch (error) {
      toast.error('Gagal menambahkan kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCat || !editingName.trim()) return;
    setLoading(true);
    try {
      await productService.updateCategory(selectedCat.id, editingName.trim());
      setConfirmKind(null);
      setEditingId(null);
      loadCategories(1, false);
      onSuccess?.();
      toast.success('Kategori berhasil diubah');
    } catch (error) {
      toast.error('Gagal mengubah kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCat) return;
    setLoading(true);
    try {
      await productService.deleteCategory(selectedCat.id);
      setConfirmKind(null);
      loadCategories(1, false);
      onSuccess?.();
      toast.success('Kategori berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus kategori');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Tags className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle>Kelola Kategori</DialogTitle>
                <DialogDescription>Tambah atau hapus kategori produk.</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Kategori Baru <span className="text-destructive">*</span></Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Nama kategori..." 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
                <Button size="icon" onClick={handleCreate} disabled={loading || !newCategoryName.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Daftar Kategori <span className="text-[10px] text-muted-foreground font-normal ml-1">(Klik ganti nama untuk edit)</span></Label>
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 group border border-transparent hover:border-border transition-all">
                    {editingId === cat.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input 
                          className="h-8"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          autoFocus
                        />
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500" onClick={() => { setSelectedCat(cat); setConfirmKind('update'); }}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setEditingId(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium">{cat.name}</span>
                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => { setSelectedCat(cat); setConfirmKind('delete'); }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                {hasMore && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-xs text-muted-foreground hover:text-primary mt-2"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? 'Memuat...' : 'Muat lebih banyak'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmKind === 'delete'}
        onOpenChange={(o) => !o && setConfirmKind(null)}
        title="Hapus Kategori"
        description={`Apakah Anda yakin ingin menghapus "${selectedCat?.name}"? Produk dengan kategori ini akan menjadi "Tanpa Kategori".`}
        confirmLabel="Hapus"
        variant="destructive"
        isPending={loading}
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={confirmKind === 'update'}
        onOpenChange={(o) => !o && setConfirmKind(null)}
        title="Ubah Kategori"
        description={`Apakah Anda yakin ingin mengubah nama kategori menjadi "${editingName}"?`}
        confirmLabel="Ubah"
        isPending={loading}
        onConfirm={handleUpdate}
      />
    </>
  );
}
