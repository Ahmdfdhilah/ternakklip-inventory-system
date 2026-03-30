import { useState } from 'react';
import {
  Columns3,
  Eye,
  MoreVertical,
  Pencil,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
  Users as UsersIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import type { UserResponse, SortField, SortDir } from '@/services/users/types';
import { SortableHeader } from '@/components/common/SortableHeader';
import { formatDate } from '@/utils/dateUtils';
import { ROLE_LABELS, ROLE_VARIANTS } from '@/constants/roles';

interface Column {
  key: string;
  label: string;
  hideable: boolean;
}

const COLUMNS: Column[] = [
  { key: 'role',       label: 'Role',       hideable: true },
  { key: 'status',     label: 'Status',     hideable: true },
  { key: 'created_at', label: 'Dibuat',     hideable: true },
];

interface UsersTableProps {
  users: UserResponse[];
  isLoading: boolean;
  sortBy: SortField | undefined;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
  onDetail: (user: UserResponse) => void;
  onEdit: (user: UserResponse) => void;
  onEditRole: (user: UserResponse) => void;
  onToggleActive: (user: UserResponse) => void;
  onDelete: (user: UserResponse) => void;
}

export const UsersTable = ({
  users,
  isLoading,
  sortBy,
  sortDir,
  onSort,
  onDetail,
  onEdit,
  onEditRole,
  onToggleActive,
  onDelete,
}: UsersTableProps) => {
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({
    role: true,
    status: true,
    created_at: true,
  });

  const toggleCol = (key: string) =>
    setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }));

  const headerRow = (
    <TableRow>
      <SortableHeader field="name" sortBy={sortBy} sortDir={sortDir} onSort={onSort}>
        Pengguna
      </SortableHeader>

      {visibleCols.role && (
        <SortableHeader field="role" sortBy={sortBy} sortDir={sortDir} onSort={onSort}>
          Role
        </SortableHeader>
      )}

      {visibleCols.status && (
        <SortableHeader 
          field="is_active" 
          sortBy={sortBy} 
          sortDir={sortDir} 
          onSort={onSort}
          className="hidden md:table-cell"
        >
          Status
        </SortableHeader>
      )}

      {visibleCols.created_at && (
        <SortableHeader 
          field="created_at" 
          sortBy={sortBy} 
          sortDir={sortDir} 
          onSort={onSort}
          className="hidden lg:table-cell"
        >
          Dibuat
        </SortableHeader>
      )}

      <TableHead className="w-10">
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
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                </TableCell>
                {visibleCols.role       && <TableCell><Skeleton className="h-5 w-16" /></TableCell>}
                {visibleCols.status     && <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-14" /></TableCell>}
                {visibleCols.created_at && <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>}
                <TableCell><Skeleton className="h-7 w-7 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <Empty className="border bg-card">
        <EmptyHeader>
          <EmptyMedia variant="icon"><UsersIcon /></EmptyMedia>
          <EmptyTitle>Tidak ada pengguna ditemukan</EmptyTitle>
          <EmptyDescription>Coba ubah filter pencarian atau tambah pengguna baru.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="rounded-md border bg-card shadow-sm">
      <Table>
        <TableHeader>{headerRow}</TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
              <TableCell>
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={user.avatar_path ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              </TableCell>

              {visibleCols.role && (
                <TableCell>
                  <Badge variant={ROLE_VARIANTS[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                </TableCell>
              )}

              {visibleCols.status && (
                <TableCell className="hidden md:table-cell">
                  <Badge variant={user.is_active ? 'default' : 'secondary'}>
                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </TableCell>
              )}

              {visibleCols.created_at && (
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {formatDate(user.created_at)}
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
                    <DropdownMenuItem onClick={() => onDetail(user)} className="cursor-pointer">
                      <Eye size={14} className="mr-2" />
                      Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer">
                      <Pencil size={14} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditRole(user)} className="cursor-pointer">
                      <ShieldCheck size={14} className="mr-2" />
                      Ubah Role
                    </DropdownMenuItem>
                    {user.role !== 'super_admin' && (
                      <>
                        <DropdownMenuSeparator />
                        {user.is_active ? (
                          <DropdownMenuItem
                            className="text-amber-600 cursor-pointer"
                            onClick={() => onToggleActive(user)}
                          >
                            <UserX size={14} className="mr-2" />
                            Nonaktifkan
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-green-600 cursor-pointer"
                            onClick={() => onToggleActive(user)}
                          >
                            <UserCheck size={14} className="mr-2" />
                            Aktifkan
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer"
                          onClick={() => onDelete(user)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </>
                    )}
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
