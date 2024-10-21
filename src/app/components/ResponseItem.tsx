import Image from "next/image";
import React from "react";

function ResponseItem({
  response,
}: {
  response: { name: string; time: string; survey: string };
}) {
  return (
    <div className="flex items-center justify-between p-3 mb-2 border dark:border-gray-500 rounded-lg">
      <div className="flex items-center">
        <Image
          src="https://placehold.co/40x40" // Image URL
          alt={`Avatar of ${response.name}`} // Alt text
          width={40} // Set the width of the image
          height={40} // Set the height of the image
          className="rounded-full mr-3" // Apply existing styles
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
