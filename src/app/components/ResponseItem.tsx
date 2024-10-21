import Image from "next/image";
import React from "react";

function ResponseItem({
  response,
}: {
  response: { name: string; time: string; survey: string };
}) {
  const randomId = Math.floor(Math.random() * 70) + 1; // Generate a random number between 1 and 70

  return (
    <div className="flex items-center justify-between p-3 mb-2 border dark:border-gray-500 rounded-lg">
      <div className="flex items-center">
        <Image
          src={`https://i.pravatar.cc/512?img=${randomId}`} // Random avatar image
          alt={`Avatar of ${response.name}`}
          width={40}
          height={40}
          className="rounded-full mr-3"
          priority // Optional: use priority if this image is critical to load first
        />
        <div>
          <p className="font-medium text-sm text-[#16151C] dark:text-white">
            {response.name}
          </p>
          <p className="text-[#D9D9D9] text-xs">{response.time}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="bg-[#F0F3F7] text-[#656565] dark:border-gray-500 border-[#D5D7DA] border-[0.5px] px-3 py-1 rounded-[5px] text-xs mr-3">
          {response.survey}
        </span>
        <i className="fas fa-ellipsis-v text-[#1E1E1E] dark:text-white"></i>
      </div>
    </div>
  );
}

export default ResponseItem;
