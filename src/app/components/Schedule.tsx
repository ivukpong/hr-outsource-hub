import { useEffect, useState } from "react";
import MyCalendar from "./Calendar";
import EventList from "./EventList";
import toast from "react-hot-toast";
import Modal from "./Modal";
import CustomInput from "./Input";
import Button from "./Button";
import EmployeeNames from "./EmployeeNames";
import { Employee } from "@prisma/client";

const Schedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(2024, 9, 21)
  ); // Default to October 21, 2024
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [participants, setParticipants] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  async function fetchEmployees() {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  }

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setLoading(true);

    try {
      const scheduleData = {
        title,
        description,
        startTime,
        endTime,
        location,
        participants,
      };
      const response = await fetch("/api/schedules", {
        method: "POST", // Use POST method for creating a new survey
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify(scheduleData), // Convert surveyData to JSON string
      });

      if (!response.ok) {
        // Check if the response is not OK (status not in the range 200-299)
        toast.error("Failed to create schedule");
        throw Error("Failed to create schedule");
      }

      const data = await response.json(); // Parse the JSON response
      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setLocation("");
      setParticipants([]);
      handleCloseModal();
      setLoading(false);
      toast.success("Schedule create successfully");

      toast.success(data.message);
      return data; // Return the created survey data or handle it as needed
    } catch (error) {
      setLoading(false);
      toast.error("Failed to create schedule");
      console.error("Error creating survey:", error); // Log the error
      throw error; // Propagate error if needed
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Format the selected date to YYYY-MM-DD for the API call
  const formattedDate = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : "";

  return (
    <div className="min-h-screen text-black dark:text-white">
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="w-full">
          <h2 className="text-dark dark:text-white text-xl font-semibold mb-4">
            Schedule Form
          </h2>
          <form onSubmit={handleSubmit}>
            <CustomInput
              htmlFor="title"
              label="Title"
              id="title"
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              required
            />
            <CustomInput
              htmlFor="description"
              label="Description"
              id="description"
              type="text"
              placeholder="Enter Description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDescription(e.target.value)
              }
              required
            />
            <CustomInput
              htmlFor="startTime"
              id="startTime"
              label="Start Time"
              type="datetime-local"
              placeholder="Enter Start Time"
              value={startTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStartTime(e.target.value)
              }
              required
            />
            <CustomInput
              htmlFor="endTime"
              id="endTime"
              label="End Time"
              type="datetime-local"
              placeholder="Enter End Time"
              value={endTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEndTime(e.target.value)
              }
              required
            />
            <CustomInput
              htmlFor="location"
              id="location"
              label="Location"
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocation(e.target.value)
              }
              required
            />

            <EmployeeNames
              htmlFor="participants"
              label="Select Participants"
              options={employees}
              onChange={(e) => {
                setParticipants(e);
                console.log(participants);
              }}
            />

            <div className="flex justify-between mt-5 gap-5">
              <div className="w-full">
                <Button
                  text="Cancel"
                  type="button"
                  outline
                  click={handleCloseModal}
                />
              </div>
              <div className="w-full">
                <Button text="Add" loading={loading} type="submit" />
              </div>
            </div>
          </form>
        </div>
      </Modal>
      <div className="mx-auto bg-white dark:bg-gray-800 rounded-lg py-6 px-2">
        <div className="flex justify-between items-center mb-4 px-4">
          <h1 className="text-lg font-semibold">My Schedule</h1>
          <button
            className="px-4 py-2 bg-[#E04403] text-white rounded-md"
            onClick={handleOpenModal}
          >
            +
          </button>
        </div>
        <div className="flex flex-col justify-center w-full">
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
