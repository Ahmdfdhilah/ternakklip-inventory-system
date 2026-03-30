import * as React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export interface DatePickerProps {
    value?: string;
    onChange?: (value: string | undefined) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    showIcon?: boolean;
    disabledDays?: (date: Date) => boolean;
}

export function DatePicker({
    value,
    onChange,
    placeholder = 'Pilih tanggal...',
    className,
    disabled,
    required,
    showIcon = true,
    disabledDays,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    const date = React.useMemo(() => {
        if (!value) return undefined;
        const parsed = parseISO(value);
        return isValid(parsed) ? parsed : undefined;
    }, [value]);

    const handleSelect = (selectedDate: Date) => {
        const formatted = format(selectedDate, 'yyyy-MM-dd');
        onChange?.(formatted);
        setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.(undefined);
    };

    const displayValue = React.useMemo(() => {
        if (!date) return placeholder;
        return format(date, 'EEEE, d MMMM yyyy', { locale: id });
    }, [date, placeholder]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-slot="input-group-control"
                    className={cn(
                        'w-full justify-start text-left font-normal h-9 px-3 transition-all duration-200',
                        'rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0',
                        !date && 'text-muted-foreground',
                        className
                    )}
                    disabled={disabled}
                    type="button"
                >
                    {showIcon && <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
                    <span className="flex-1 truncate">{displayValue}</span>
                    {date && !disabled && !required && (
                        <X
                            className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                            onClick={handleClear}
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none shadow-xl" align="start">
                <Calendar
                    selected={date}
                    onSelect={handleSelect}
                    disabled={disabledDays}
                    className="rounded-lg shadow-lg border"
                />
            </PopoverContent>
        </Popover>
    );
}
