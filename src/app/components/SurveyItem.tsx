import { Survey } from "@prisma/client";
import React from "react";
import { FaEye, FaCommentDots } from "react-icons/fa"; // Importing icons

function SurveyItem({ survey }: { survey: Survey }) {
  const getFormat = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <div className="flex items-center justify-between p-4 mb-4 bg-transparent border-[0.5px] border-[#E3E3E3] dark:border-gray-500 rounded-[5px]">
      {/* Left Section */}
      <div className="w-full">
        <div className="flex justify-between items-center w-full">
          <span className="w-fit bg-[#F0F3F7] text-[#656565] border-[#D5D7DA] border-[0.5px] px-[6px] py-[3px] rounded-[5px] text-xs mr-3">
            {survey.category}
          </span>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <FaEye className="text-[#E0E4EA]" />
              <span className="text-black dark:text-white ">
                {survey.seenCount}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <FaCommentDots className="text-[#E0E4EA]" />
              <span className="text-black dark:text-white ">
                {survey.completedCount}
              </span>
            </div>
          </div>
        </div>
        <p className="font-bold text-sm my-3">{survey.title}</p>
        <p className="text-[#CECECE] text-xs">
          {getFormat(new Date(survey.createdAt))}
        </p>
      </div>

      {/* Right Section */}
    </div>
  );
}

export default SurveyItem;
