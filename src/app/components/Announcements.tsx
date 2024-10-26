import React, { useEffect, useState } from "react";
import { BsPinAngleFill } from "react-icons/bs";
import Modal from "./Modal";
import CustomInput from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<
    { id: number; title: string; description: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setLoading(true);

    try {
      const announcementData = {
        title,
        description,
        date,
      };
      const response = await fetch("/api/announcements", {
        method: "POST", // Use POST method for creating a new survey
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify(announcementData), // Convert surveyData to JSON string
      });

      if (!response.ok) {
        // Check if the response is not OK (status not in the range 200-299)
        toast.error("Failed to create announcement");
        throw Error("Failed to create announcement");
      }

      const data = await response.json(); // Parse the JSON response
      setTitle("");
      setDescription("");
      setDate("");
      handleCloseModal();
      setLoading(false);
      toast.success("Announcement created successfully");
      return data; // Return the created survey data or handle it as needed
    } catch (error) {
      setLoading(false);
      toast.error("Failed to create announcement");
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
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("/api/announcements"); // Adjust the endpoint as needed
        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const data = await response.json();
        setAnnouncements(data.reverse());
      } catch (error) {
        if (error instanceof Error) {
          // Now TypeScript knows err is an Error
          setError(error.message);
        } else {
          // Handle non-Error types if necessary
          console.error("Unknown error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return <div>Loading announcements...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="pt-4 bg-white dark:bg-gray-800 rounded-[5px] text-black dark:text-white border border-[#ECEEF6] dark:border-gray-500">
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="w-full max-w-lg">
          <h2 className="text-dark dark:text-white text-xl font-semibold mb-4">
            Announcement Form
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
              htmlFor="date"
              id="date"
              label="Date"
              type="date"
              placeholder="Enter Date"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDate(e.target.value)
              }
              required
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
                <Button text="Create" loading={loading} type="submit" />
              </div>
            </div>
          </form>
        </div>
      </Modal>
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-lg font-semibold">Announcements</h2>
        <button
          className="px-4 py-2 bg-[#E04403] text-white rounded-md"
          onClick={handleOpenModal}
        >
          Add New +
        </button>
      </div>
      <ul className="text-black dark:text-white border-b border-[#ECEEF6] dark:border-gray-500 p-4">
        {announcements.slice(0, 5).map((announcement) => (
          <li
            key={announcement.id}
            className="p-4 rounded-[5px] mb-4 border border-[#ECEEF6] dark:border-gray-500 bg-[#FAFAFA]  dark:bg-gray-800 flex items-center justify-between"
          >
            <div className="">
              <h3 className="font-bold text-base">{announcement.title}</h3>
              <p className="text-sm opacity-40">{announcement.description}</p>
            </div>
            <div className="flex space-x-2 items-center">
              <BsPinAngleFill />
              <button>...</button>
            </div>
          </li>
        ))}
      </ul>
      <a href="#" className="block text-center text-[#E04403] p-4">
        See All
      </a>
    </div>
  );
};

export default Announcements;
