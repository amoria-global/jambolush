import React, { useState, useRef, useEffect } from 'react';

interface CustomDatePickerProps {
  value: string;
  onChange: (e: any) => void;
  min?: string;
  occupiedDates?: string[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ 
  value, 
  onChange, 
  min, 
  occupiedDates = [], 
  placeholder = "Add date",
  disabled = false,
  label = "Date"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to check if a date is occupied
  const isDateOccupied = (date: Date): boolean => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return occupiedDates.includes(dateStr);
  };

  // Helper function to check if date is in the past
  const isDateInPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
  };

  // Helper function to check if date is before min date
  const isBeforeMin = (date: Date): boolean => {
    if (!min) return false;
    const minDate = new Date(min);
    minDate.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < minDate;
  };

  // Helper function to check if date is valid for selection
  const isDateValid = (date: Date): boolean => {
    if (isBeforeMin(date)) return false;
    return !isDateInPast(date) && !isDateOccupied(date);
  };

  // Generate calendar days
  const generateCalendarDays = (): Date[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: Date[] = [];
    const currentDate = new Date(startDate);
    
    // Always generate 42 days (6 weeks) for consistent grid
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Handle date selection
  const handleDateSelect = (date: Date): void => {
    if (isDateValid(date)) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      onChange({ target: { value: formattedDate } });
      setIsOpen(false);
    }
  };

  // Handle navigation
  const navigateMonth = (direction: number): void => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update current month when value changes
  useEffect(() => {
    if (value) {
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const calendarDays = generateCalendarDays();

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field */}
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`relative w-full transition-all ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className={`
          px-3 py-2.5 border rounded-lg transition-all
          ${disabled ? 'bg-gray-50 border-gray-200' : 
            isOpen ? 'border-[#083A85] shadow-md bg-white' : 
            'border-gray-400 hover:border-gray-600 bg-white'}
        `}>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${value ? 'text-gray-900' : 'text-gray-400'}`}>
              {value ? formatDisplayDate(value) : placeholder}
            </span>
            {!disabled && (
              <i className={`bi bi-calendar3 text-xs ${isOpen ? 'text-[#083A85]' : 'text-gray-400'}`}></i>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div 
          className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl z-50 border border-gray-200 w-[320px] max-w-[calc(100vw-2rem)]"
        >
          {/* Month Navigation Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
              aria-label="Previous month"
            >
              <i className="bi bi-chevron-left text-[#083A85]"></i>
            </button>

            <h3 className="text-base font-semibold text-gray-900">
              {formatMonthYear(currentMonth)}
            </h3>

            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
              aria-label="Next month"
            >
              <i className="bi bi-chevron-right text-[#083A85]"></i>
            </button>
          </div>

          {/* Calendar Content */}
          <div className="p-4">
            {/* Days of Week */}
            <div className="grid grid-cols-7 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-[11px] font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                const isSelected = value && new Date(value).toDateString() === date.toDateString();
                const isOccupied = isDateOccupied(date);
                const isPast = isDateInPast(date);
                const isValid = isDateValid(date);
                const isToday = new Date().toDateString() === date.toDateString();
                
                // Determine button classes
                let buttonClasses = "relative w-full h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all ";

                if (!isCurrentMonth) {
                  buttonClasses += "text-transparent cursor-default ";
                } else if (isSelected) {
                  buttonClasses += "bg-[#083A85] text-white hover:bg-[#062a5f] ";
                } else if (isOccupied) {
                  buttonClasses += "text-gray-300 cursor-not-allowed bg-gray-50 ";
                } else if (isPast || !isValid) {
                  buttonClasses += "text-gray-300 cursor-not-allowed ";
                } else if (isToday) {
                  buttonClasses += "text-[#083A85] font-bold hover:bg-gray-100 cursor-pointer border border-[#083A85] ";
                } else {
                  buttonClasses += "text-gray-700 hover:bg-gray-100 cursor-pointer ";
                }

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => isCurrentMonth && isValid && handleDateSelect(date)}
                    disabled={!isCurrentMonth || !isValid}
                    className={buttonClasses}
                    title={
                      isOccupied ? 'This date is unavailable' :
                      isPast ? 'Past dates cannot be selected' :
                      !isValid ? 'This date is not available' :
                      ''
                    }
                  >
                    {isCurrentMonth && (
                      <>
                        <span className={isOccupied ? 'line-through decoration-2' : ''}>
                          {date.getDate()}
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;