import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { UserResponse, UserRole } from '@/services/users/types';

const createSchema = z.object({
  name:     z.string().min(1, 'Nama wajib diisi'),
  email:    z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role:     z.enum(['super_admin', 'admin', 'user'] as const),
});

const editSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  role: z.enum(['super_admin', 'admin', 'user'] as const),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues   = z.infer<typeof editSchema>;

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  user?: UserResponse | null;
  isPending: boolean;
  onSubmitCreate: (values: CreateValues) => void;
  onSubmitEdit:   (values: EditValues)   => void;
}

export const UserFormDialog = ({
  open,
  onClose,
  user,
  isPending,
  onSubmitCreate,
  onSubmitEdit,
}: UserFormDialogProps) => {
  const isEdit = !!user;

  const createForm = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: '', email: '', password: '', role: 'user' },
    mode: 'onChange'
  });

  const editForm = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: user?.name ?? '', role: user?.role ?? 'user' },
    mode: 'onChange'
  });

  useEffect(() => {
    if (open) {
      if (isEdit && user) {
        editForm.reset({ name: user.name, role: user.role });
      } else {
        createForm.reset({ name: '', email: '', password: '', role: 'user' });
      }
    }
  }, [open, user]);

  const handleClose = () => {
    if (!isPending) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
        </DialogHeader>

        {isEdit ? (
          <form
            id="user-edit-form"
            onSubmit={editForm.handleSubmit(onSubmitEdit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name">Nama <span className="text-destructive">*</span></Label>
                <Input
                  id="edit-name"
                  {...editForm.register('name')}
                  placeholder="Nama lengkap"
                />
                <div className="min-h-[20px]">
                  {editForm.formState.errors.name && (
                    <p className="text-xs text-destructive mt-1">{editForm.formState.errors.name.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Role <span className="text-destructive">*</span></Label>
                <Select
                  value={editForm.watch('role')}
                  onValueChange={(v) => editForm.setValue('role', v as UserRole, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">Pengguna</SelectItem>
                  </SelectContent>
                </Select>
                <div className="min-h-[20px]" />
              </div>
            </div>
          </form>
        ) : (
          <form
            id="user-create-form"
            onSubmit={createForm.handleSubmit(onSubmitCreate)}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="create-name">Nama <span className="text-destructive">*</span></Label>
              <Input
                id="create-name"
                {...createForm.register('name')}
                placeholder="Nama lengkap"
              />
              <div className="min-h-[20px]">
                {createForm.formState.errors.name && (
                  <p className="text-xs text-destructive mt-1">{createForm.formState.errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="create-email">Email <span className="text-destructive">*</span></Label>
                <Input
                  id="create-email"
                  type="email"
                  {...createForm.register('email')}
                  placeholder="email@contoh.com"
                />
                <div className="min-h-[20px]">
                  {createForm.formState.errors.email && (
                    <p className="text-xs text-destructive mt-1">{createForm.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="create-password">Password <span className="text-destructive">*</span></Label>
                <Input
                  id="create-password"
                  type="password"
                  {...createForm.register('password')}
                  placeholder="Min. 6"
                />
                <div className="min-h-[20px]">
                  {createForm.formState.errors.password && (
                    <p className="text-xs text-destructive mt-1">{createForm.formState.errors.password.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Role <span className="text-destructive">*</span></Label>
              <Select
                value={createForm.watch('role')}
                onValueChange={(v) => createForm.setValue('role', v as UserRole, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">Pengguna</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Batal
          </Button>
          <Button
            type="submit"
            form={isEdit ? 'user-edit-form' : 'user-create-form'}
            disabled={isPending || (isEdit ? !editForm.formState.isValid : !createForm.formState.isValid)}
          >
            {isPending && <Spinner size="sm" className="mr-2" />}
            {isEdit ? 'Simpan' : 'Buat Pengguna'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
