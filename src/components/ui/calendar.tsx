import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    eachDayOfInterval,
    isToday,
    setMonth,
    setYear,
    getYear,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface CalendarProps {
    selected?: Date;
    onSelect?: (date: Date) => void;
    disabled?: (date: Date) => boolean;
    className?: string;
}

export function Calendar({ selected, onSelect, disabled, className }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = React.useState(selected || new Date());

    const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const startMonth = startOfMonth(currentMonth);
    const endMonth = endOfMonth(currentMonth);
    const startDate = startOfWeek(startMonth);
    const endDate = endOfWeek(endMonth);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const years = React.useMemo(() => {
        const currentYear = getYear(new Date());
        const yearsArray = [];
        for (let i = currentYear - 100; i <= currentYear + 10; i++) {
            yearsArray.push(i);
        }
        return yearsArray.reverse();
    }, []);

    const months = [
        { value: 0, label: 'Januari' },
        { value: 1, label: 'Februari' },
        { value: 2, label: 'Maret' },
        { value: 3, label: 'April' },
        { value: 4, label: 'Mei' },
        { value: 5, label: 'Juni' },
        { value: 6, label: 'Juli' },
        { value: 7, label: 'Agustus' },
        { value: 8, label: 'September' },
        { value: 9, label: 'Oktober' },
        { value: 10, label: 'November' },
        { value: 11, label: 'Desember' },
    ];

    const handleMonthChange = (month: string) => {
        setCurrentMonth(setMonth(currentMonth, parseInt(month)));
    };

    const handleYearChange = (year: string) => {
        setCurrentMonth(setYear(currentMonth, parseInt(year)));
    };

    return (
        <div className={cn('p-3 bg-card text-card-foreground rounded-md shadow-md border animate-in fade-in zoom-in-95 duration-200', className)}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1 flex-1 items-center">
                    <Select value={currentMonth.getMonth().toString()} onValueChange={handleMonthChange}>
                        <SelectTrigger className="h-8 py-0 px-2 text-xs font-medium border-none shadow-none focus:ring-0 bg-transparent hover:bg-muted transition-colors">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((m) => (
                                <SelectItem key={m.value} value={m.value.toString()} className="text-xs">
                                    {m.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={currentMonth.getFullYear().toString()} onValueChange={handleYearChange}>
                        <SelectTrigger className="h-8 py-0 px-2 text-xs font-medium border-none shadow-none focus:ring-0 bg-transparent hover:bg-muted transition-colors">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                            {years.map((y) => (
                                <SelectItem key={y} value={y.toString()} className="text-xs">
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 p-0"
                        onClick={prevMonth}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 p-0"
                        onClick={nextMonth}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {daysOfWeek.map((day) => (
                    <div
                        key={day}
                        className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider py-1"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                    const isSelected = selected && isSameDay(day, selected);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isTodayDay = isToday(day);

                    return (
                        <button
                            key={idx}
                            onClick={() => !disabled?.(day) && onSelect?.(day)}
                            disabled={disabled?.(day)}
                            className={cn(
                                'h-8 w-8 text-xs rounded-full flex items-center justify-center transition-all duration-200',
                                !isCurrentMonth && 'text-muted-foreground/30',
                                isCurrentMonth && !disabled?.(day) && 'hover:bg-accent hover:text-accent-foreground',
                                isTodayDay && !isSelected && 'border-2 border-primary text-primary font-bold',
                                isSelected && 'bg-primary text-primary-foreground font-bold shadow-sm scale-110',
                                disabled?.(day) && 'opacity-50 cursor-not-allowed bg-muted'
                            )}
                        >
                            {format(day, 'd')}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
