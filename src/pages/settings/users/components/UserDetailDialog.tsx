import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { UserResponse, UserRole } from '@/services/users/types';

const ROLE_LABEL: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  user: 'Pengguna',
};

const ROLE_VARIANT: Record<UserRole, 'default' | 'secondary' | 'outline'> = {
  super_admin: 'default',
  admin: 'secondary',
  user: 'outline',
};

interface UserDetailDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserResponse | null;
}

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 py-2">
    <span className="text-sm text-muted-foreground shrink-0">{label}</span>
    <span className="text-sm text-right">{children}</span>
  </div>
);

export const UserDetailDialog = ({ open, onClose, user }: UserDetailDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Detail Pengguna</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_path ?? undefined} />
            <AvatarFallback className="text-lg">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email ?? '-'}</p>
          </div>
        </div>

        <Separator />

        <div className="divide-y">
          <DetailRow label="Role">
            <Badge variant={ROLE_VARIANT[user.role]}>{ROLE_LABEL[user.role]}</Badge>
          </DetailRow>
          <DetailRow label="Status">
            <Badge variant={user.is_active ? 'default' : 'secondary'}>
              {user.is_active ? 'Aktif' : 'Nonaktif'}
            </Badge>
          </DetailRow>
          <DetailRow label="Bergabung">
            {user.created_at
              ? format(new Date(user.created_at), 'd MMMM yyyy', { locale: id })
              : '-'}
          </DetailRow>
          <DetailRow label="ID">
            <span className="font-mono text-xs text-muted-foreground truncate max-w-[160px]">
              {user.id}
            </span>
          </DetailRow>
        </div>
      </DialogContent>
    </Dialog>
  );
};
