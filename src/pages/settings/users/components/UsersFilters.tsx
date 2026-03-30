import { Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UsersFiltersProps {
  search: string;
  role: string;
  isActive: string;
  onSearch: (value: string) => void;
  onRole: (value: string) => void;
  onIsActive: (value: string) => void;
  onAdd: () => void;
}

export const UsersFilters = ({
  search,
  role,
  isActive,
  onSearch,
  onRole,
  onIsActive,
  onAdd,
}: UsersFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card p-4 rounded-lg border border-border shadow-sm mb-6">
      <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative flex-1 sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={role} onValueChange={onRole}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Role</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>

          <Select value={isActive} onValueChange={onIsActive}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="true">Aktif</SelectItem>
              <SelectItem value="false">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={onAdd} className="w-full md:w-auto gap-2">
        <UserPlus className="h-4 w-4" />
        Tambah Pengguna
      </Button>
    </div>
  );
};
