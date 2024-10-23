import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FC } from "react";

interface MyCalendarProps {
  selectedDate: Date | null; // Change to Date or null
  onDateSelect: (date: Date | null) => void; // Function to handle date selection
}

const MyCalendar: FC<MyCalendarProps> = ({ selectedDate, onDateSelect }) => {
  const handleDateChange = (value: Date | Date[] | null) => {
    if (Array.isArray(value)) {
      // If a range is selected, take the first date
      onDateSelect(value[0] || null);
    } else if (value instanceof Date) {
      onDateSelect(value); // Call onDateSelect if value is a valid date
    } else {
      onDateSelect(null); // Handle null case
    }
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      // Check if the date is today
      const isSelected = date.toDateString() === selectedDate?.toDateString();
      return isSelected
        ? "!bg-[#E04403] text-white rounded-[5px]"
        : date.toDateString() === new Date()?.toDateString()
          ? "!bg-[#FFEDE5] dark:text-gray-800"
          : "dark:!bg-gray-800"; // Active color for today
    }
  };

  return (
    <Calendar
      className={"!border-0 dark:!bg-gray-800"}
      tileClassName={tileClassName}
      // selectRange
      onChange={handleDateChange} // Updated to handle Date | Date[] | null
      value={selectedDate} // Use selectedDate directly
    />
  );
};

export default MyCalendar;
