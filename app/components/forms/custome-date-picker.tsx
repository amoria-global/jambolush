import React, { useState, useRef, useEffect } from 'react';

interface CustomDatePickerProps {
  value: string;
  onChange: (e: any ) => void;
  min?: string;
  occupiedDates?: string[]; // Changed from object array to string array
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ 
  value, 
  onChange, 
  min, 
  occupiedDates = [], 
  placeholder = "Select date",
  disabled = false,
  label = "Date"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to check if a date is occupied
  const isDateOccupied = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return occupiedDates.includes(dateStr);
  };

  // Helper function to check if date is in the past
  const isDateInPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
  };

  // Helper function to check if date is after min date
  const isDateValid = (date: Date): boolean => {
    if (min && new Date(date) < new Date(min)) return false;
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
    
    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Handle date selection
  const handleDateSelect = (date: Date): void => {
    if (isDateValid(date)) {
      const formattedDate = date.toISOString().split('T')[0];
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

  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calendarDays = generateCalendarDays();
  const monthYear = currentMonth.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="block text-base font-semibold text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Input Display */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition cursor-pointer ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
          <i className="bi bi-calendar3 text-gray-400"></i>
        </div>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <i className="bi bi-chevron-left text-gray-600"></i>
            </button>
            
            <h3 className="text-lg font-semibold text-[#083A85]">
              {monthYear}
            </h3>
            
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <i className="bi bi-chevron-right text-gray-600"></i>
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
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
              
              let buttonClasses = "w-full h-10 flex items-center justify-center text-sm rounded-lg transition ";
              
              if (!isCurrentMonth) {
                buttonClasses += "text-gray-300 cursor-default ";
              } else if (isSelected) {
                buttonClasses += "bg-[#083A85] text-white font-semibold ";
              } else if (isOccupied) {
                buttonClasses += "bg-[#F20C8F] text-white cursor-not-allowed ";
              } else if (isPast || !isValid) {
                buttonClasses += "text-gray-400 cursor-not-allowed ";
              } else {
                buttonClasses += "text-[#083A85] hover:bg-[#083A85] hover:text-white cursor-pointer font-medium ";
              }

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => isCurrentMonth && handleDateSelect(date)}
                  disabled={!isCurrentMonth || !isValid}
                  className={buttonClasses}
                  title={
                    isOccupied ? 'Date is not available' : 
                    isPast ? 'Date is in the past' : 
                    !isValid ? 'Date is not available' : ''
                  }
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#083A85] rounded"></div>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#F20C8F] rounded"></div>
                <span className="text-gray-600">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span className="text-gray-600">Unavailable</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;