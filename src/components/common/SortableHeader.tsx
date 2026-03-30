import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface SortableHeaderProps<T> {
  field: T;
  sortBy: T | undefined;
  sortDir: 'asc' | 'desc';
  onSort: (field: T) => void;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

const SortIcon = ({ isActive, sortDir }: { isActive: boolean; sortDir: 'asc' | 'desc' }) => {
  if (!isActive) return <ArrowUpDown size={13} className="text-muted-foreground/30" />;
  return sortDir === 'asc' 
    ? <ArrowUp size={13} className="text-foreground" /> 
    : <ArrowDown size={13} className="text-foreground" />;
};

export function SortableHeader<T>({
  field,
  sortBy,
  sortDir,
  onSort,
  children,
  className,
  containerClassName,
}: SortableHeaderProps<T>) {
  const isActive = sortBy === field;

  return (
    <TableHead className={cn(className)}>
      <button
        onClick={() => onSort(field)}
        className={cn(
          "flex items-center gap-1.5 hover:text-foreground transition-colors select-none group py-2",
          containerClassName
        )}
      >
        <span className="font-semibold text-xs uppercase tracking-wider">
          {children}
        </span>
        <SortIcon isActive={isActive} sortDir={sortDir} />
      </button>
    </TableHead>
  );
}
