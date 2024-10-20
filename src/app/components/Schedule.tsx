import { useState } from "react";
import MyCalendar from "./Calendar";
import EventList from "./EventList";

const Schedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(2024, 9, 21)
  ); // Default to October 21, 2024

  // Format the selected date to YYYY-MM-DD for the API call
  const formattedDate = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : "";

  return (
    <div className="min-h-screen text-black dark:text-white">
      <div className="mx-auto bg-white dark:bg-gray-800 rounded-lg py-6 px-2">
        <h1 className="text-2xl font-bold mb-4">My Schedule</h1>
        <div className="">
          {/* Calendar */}
          <MyCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
          <EventList selectedDate={formattedDate} />{" "}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
