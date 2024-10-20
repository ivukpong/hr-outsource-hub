import React, { useEffect, useState } from "react";
import { BsPinAngleFill } from "react-icons/bs";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<
    { id: number; title: string; description: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("/api/announcements"); // Adjust the endpoint as needed
        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        setError(error.message);
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
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-lg font-semibold">Announcements</h2>
        <button className="px-4 py-2 bg-[#E04403] text-white rounded-md">
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
