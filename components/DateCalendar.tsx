import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateCalendarProps {
    selectedDate: Date;
    onSelect: (date: Date) => void;
    onClose?: () => void;
}

const DateCalendar: React.FC<DateCalendarProps> = ({ selectedDate, onSelect }) => {
    const [viewDate, setViewDate] = useState(new Date(selectedDate));

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const daysOfWeek = ["D", "L", "M", "Mi", "J", "V", "S"];

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onSelect(newDate);
    };

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const numDays = daysInMonth(currentYear, currentMonth);
    const startDay = firstDayOfMonth(currentYear, currentMonth);

    const prevMonthDays = daysInMonth(currentYear, currentMonth - 1);
    const days = [];

    // Fill in prefix days from previous month
    for (let i = startDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, currentMonth: false });
    }

    // Fill in days of current month
    for (let i = 1; i <= numDays; i++) {
        days.push({ day: i, currentMonth: true });
    }

    // Fill in suffix days for next month to complete the 6x7 grid if needed
    const totalSlots = 42;
    const nextMonthDaysNeeded = totalSlots - days.length;
    for (let i = 1; i <= nextMonthDaysNeeded; i++) {
        days.push({ day: i, currentMonth: false });
    }

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day &&
            today.getMonth() === currentMonth &&
            today.getFullYear() === currentYear;
    };

    const isSelected = (day: number) => {
        return selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear;
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">
                    {monthNames[currentMonth]} {currentYear}
                </h3>
                <div className="flex gap-1">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-500 hover:text-slate-900"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-500 hover:text-slate-900"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map(day => (
                    <div key={day} className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-tight py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((d, i) => (
                    <button
                        key={i}
                        disabled={!d.currentMonth}
                        onClick={() => handleDateClick(d.day)}
                        className={`
              h-8 w-8 text-xs flex items-center justify-center rounded-lg transition-all
              ${!d.currentMonth ? 'text-slate-200 cursor-default' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'}
              ${d.currentMonth && isSelected(d.day) ? 'bg-blue-600 !text-white font-bold shadow-md shadow-blue-500/20' : ''}
              ${d.currentMonth && isToday(d.day) && !isSelected(d.day) ? 'text-blue-600 font-bold' : ''}
            `}
                    >
                        {d.day}
                    </button>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <button
                    onClick={() => onSelect(new Date())}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                    Hoy
                </button>
                <div className="text-[10px] text-slate-400 font-medium italic">
                    Seleccionado: {selectedDate.toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default DateCalendar;
