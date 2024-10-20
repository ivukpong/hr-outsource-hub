import React from "react";
import { FaEye, FaCommentDots } from "react-icons/fa"; // Importing icons

function SurveyItem({
  survey,
}: {
  survey: {
    id: string;
    title: string;
    time: string;
    views: string;
    responses: string;
  };
}) {
  return (
    <div className="flex items-center justify-between p-4 mb-4 bg-transparent border-[0.5px] border-[#E3E3E3] rounded-[5px]">
      {/* Left Section */}
      <div className="w-full">
        <div className="flex justify-between items-center w-full">
          <span className="w-fit bg-[#F0F3F7] text-[#656565] border-[#D5D7DA] border-[0.5px] px-[6px] py-[3px] rounded-[5px] text-xs mr-3">
            {survey.id}
          </span>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <FaEye className="text-[#E0E4EA]" />
              <span className="text-black dark:text-white ">
                {survey.views}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <FaCommentDots className="text-[#E0E4EA]" />
              <span className="text-black dark:text-white ">
                {survey.responses}
              </span>
            </div>
          </div>
        </div>
        <p className="font-bold text-sm my-3">{survey.title}</p>
        <p className="text-[#CECECE] text-xs">{survey.time}</p>
      </div>

      {/* Right Section */}
    </div>
  );
}

export default SurveyItem;
