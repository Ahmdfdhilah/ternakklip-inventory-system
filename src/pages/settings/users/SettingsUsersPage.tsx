import { useEffect, useState } from 'react';
import { useLayoutStore } from '@/stores/layoutStore';
import { useURLFilters } from '@/hooks/useURLFilters';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useSetUserActive,
  useDeleteUser,
} from '@/hooks/tanstackHooks/useUsers';
import { ConfirmDialog } from '@/components/common';
import { Pagination } from '@/components/common';
import {
  UsersFilters,
  UsersTable,
  UserFormDialog,
  UserDetailDialog,
} from './components';
import type { UserResponse, SortField, SortDir } from '@/services/users/types';

interface UsersFiltersShape extends Record<string, string | number | undefined> {
  search?: string;
  role?: string;
  is_active?: string;
  sort_by?: string;
  sort_dir?: string;
  page?: number;
  limit?: number;
}

type DialogKind = 'create' | 'edit' | 'detail' | 'toggleActive' | 'delete' | null;

interface DialogState {
  kind: DialogKind;
  user: UserResponse | null;
}

const CLOSED: DialogState = { kind: null, user: null };

export default function SettingsUsersPage() {
  const { setHeader } = useLayoutStore();
  const { filters, setFilter, setFilters } = useURLFilters<UsersFiltersShape>({ page: 1, limit: 20 });
  const [dialog, setDialog] = useState<DialogState>(CLOSED);

  useEffect(() => {
    setHeader({
      title: 'Manajemen Pengguna',
      description: 'Kelola hak akses, status aktif, dan profil pengguna sistem.',
      breadcrumb: [
        { label: 'Dashboard', href: '/dashboard'},
        { label: 'Manajemen Pengguna' }
      ]
    });
  }, [setHeader]);

  const { data, isLoading } = useUsers({
    page:     filters.page,
    limit:    filters.limit,
    search:   filters.search,
    role:     filters.role,
    is_active: filters.is_active !== undefined
      ? filters.is_active === 'true'
      : undefined,
    sort_by:  (filters.sort_by as SortField) ?? undefined,
    sort_dir: (filters.sort_dir as SortDir)  ?? 'desc',
  });

  const users = data?.data ?? [];
  const meta  = data?.meta;

  const handleSort = (field: SortField) => {
    if (filters.sort_by === field) {
      setFilter('sort_dir', filters.sort_dir === 'asc' ? 'desc' : 'asc');
    } else {
      setFilters({
        sort_by: field,
        sort_dir: 'asc',
      });
    }
  };

  const createUser = useCreateUser({
    onSuccess: () => setDialog(CLOSED),
  });

  const updateUser = useUpdateUser({
    onSuccess: () => setDialog(CLOSED),
  });

  const setUserActive = useSetUserActive({
    onSuccess: () => setDialog(CLOSED),
  });

  const deleteUser = useDeleteUser({
    onSuccess: () => setDialog(CLOSED),
  });

  return (
    <div className="flex flex-col gap-4 pt-4 px-6 pb-6">
      <UsersFilters
        search={filters.search ?? ''}
        role={filters.role ?? 'all'}
        isActive={filters.is_active ?? 'all'}
        onSearch={(v) => setFilter('search', v || undefined)}
        onRole={(v) => setFilter('role', v === 'all' ? undefined : v)}
        onIsActive={(v) => setFilter('is_active', v === 'all' ? undefined : v)}
        onAdd={() => setDialog({ kind: 'create', user: null })}
      />

      <UsersTable
        users={users}
        isLoading={isLoading}
        sortBy={(filters.sort_by as SortField) ?? undefined}
        sortDir={(filters.sort_dir as SortDir) ?? 'desc'}
        onSort={handleSort}
        onDetail={(u) => setDialog({ kind: 'detail',       user: u })}
        onEdit={(u)   => setDialog({ kind: 'edit',         user: u })}
        onEditRole={(u) => setDialog({ kind: 'edit',       user: u })}
        onToggleActive={(u) => setDialog({ kind: 'toggleActive', user: u })}
        onDelete={(u) => setDialog({ kind: 'delete',       user: u })}
      />

      {meta && meta.total_pages > 1 && (
        <Pagination
          page={filters.page ?? 1}
          limit={meta.limit}
          totalItems={meta.total_items}
          totalPages={meta.total_pages}
          onPageChange={(p) => setFilter('page', p)}
          onLimitChange={(l) => setFilter('limit', l)}
        />
      )}

      <UserFormDialog
        open={dialog.kind === 'create' || dialog.kind === 'edit'}
        onClose={() => setDialog(CLOSED)}
        user={dialog.kind === 'edit' ? dialog.user : null}
        isPending={createUser.isPending || updateUser.isPending}
        onSubmitCreate={(values) => createUser.mutate(values)}
        onSubmitEdit={(values) =>
          dialog.user && updateUser.mutate({ userId: dialog.user.id, data: values })
        }
      />

      <UserDetailDialog
        open={dialog.kind === 'detail'}
        onClose={() => setDialog(CLOSED)}
        user={dialog.user}
      />

      <ConfirmDialog
        open={dialog.kind === 'toggleActive'}
        onOpenChange={(o) => !o && setDialog(CLOSED)}
        title={dialog.user?.is_active ? 'Nonaktifkan Pengguna' : 'Aktifkan Pengguna'}
        description={
          dialog.user?.is_active
            ? `Apakah Anda yakin ingin menonaktifkan "${dialog.user?.name}"? Pengguna tidak bisa login hingga diaktifkan kembali.`
            : `Apakah Anda yakin ingin mengaktifkan kembali "${dialog.user?.name}"?`
        }
        confirmLabel={dialog.user?.is_active ? 'Nonaktifkan' : 'Aktifkan'}
        variant={dialog.user?.is_active ? 'destructive' : 'default'}
        isPending={setUserActive.isPending}
        onConfirm={() =>
          dialog.user &&
          setUserActive.mutate({ userId: dialog.user.id, is_active: !dialog.user.is_active })
        }
      />

      <ConfirmDialog
        open={dialog.kind === 'delete'}
        onOpenChange={(o) => !o && setDialog(CLOSED)}
        title="Hapus Pengguna"
        description={`Apakah Anda yakin ingin menghapus "${dialog.user?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        variant="destructive"
        isPending={deleteUser.isPending}
        onConfirm={() => dialog.user && deleteUser.mutate(dialog.user.id)}
      />
    </div>
  );
}
