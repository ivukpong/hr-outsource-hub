import { CircularProgress } from "@mui/material";
import { Employee, ScheduleParticipants } from "@prisma/client";
import React, { useEffect, useState } from "react";

interface Event {
  id: number;
  time: string;
  title: string;
  location: string;
  startTime: string; // Assuming this comes from your backend
  participants: { participant: ScheduleParticipants; Employee: Employee }[]; // Assuming this comes from your backend
}

interface EventListProps {
  selectedDate: string; // Keep as string to match the API date format
}

const EventList: React.FC<EventListProps> = ({ selectedDate }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true); // Set loading state before fetching
      setError(null); // Clear previous errors
      try {
        const response = await fetch("/api/schedules"); // Adjust the URL according to your route
        if (!response.ok) {
          throw new Error("Failed to fetch schedules");
        }
        const data = await response.json(); // Await the JSON response
        setEvents(data); // Set the events from the fetched data
        console.log(data);
      } catch (err) {
        if (err instanceof Error) {
          // Now TypeScript knows err is an Error
          setError(err.message);
        } else {
          // Handle non-Error types if necessary
          console.error("Unknown error:", err);
        }
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchEvents();
  }, [selectedDate]); // Fetch when selectedDate changes

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-primary">
        <CircularProgress color="inherit" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filter events based on the selectedDate
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.startTime).toISOString().split("T")[0]; // Extract date from startTime
    return eventDate === selectedDate; // Compare with selectedDate
  });

  // Function to format time as hh:mm am/pm
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Ensure 12-hour format with am/pm
    });
  };

  return (
    <div className="p-4">
      {filteredEvents.length === 0 ? (
        <p className="text-primary text-center w-full my-2">
          No events for this date.
        </p>
      ) : (
        filteredEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between mb-4"
          >
            {/* Time */}
            <div className="flex items-center pr-2">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatTime(event.startTime)}
              </div>
            </div>
            <div className="h-10 w-[2px] bg-gradient-to-b from-[#E04403] to-transparent" />
            {/* Event Info */}
            <div className="flex-grow pl-2">
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {event.title}
              </div>
              <div className="text-xs text-gray-500  dark:text-white">
                {event.location}
              </div>
            </div>

            {/* Avatars + Attendees */}
            <div className="flex items-center">
              {/* Placeholder avatars */}
              {event.participants.slice(0, 2).map((participant) => (
                <div
                  key={participant.Employee.id}
                  className="w-6 h-6 bg-gray-300 rounded-full overflow-hidden -ml-2"
                >
                  {/* Image placeholder for avatars */}
                  <img
                    src={participant.Employee.profilePic || ""}
                    alt="attendee avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Attendees count */}
              <div className="text-sm text-gray-500  dark:text-white ml-2">
                +{event.participants.length - 2}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EventList;
