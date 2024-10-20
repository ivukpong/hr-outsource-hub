import React from "react";

const Card = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex  border border-[#A2A1A833] rounded-[10px] px-3 py-6 shadow-md bg-white dark:bg-gray-800 flex-col">
    <div className=" bg-[#7152F31A] border border-[#7152F3] rounded-[20px] w-fit flex items-center justify-center text-[#7152F3] px-[14px] py-[7.5px]">
      RECOGNITION
    </div>
    <div className="">
      <div className="flex-grow flex items-center gap-[14px] text-black dark:text-white text-sm font-bold my-4">
        <p>{title}</p>
      </div>
      <p className="text-[#1E1E1E] dark:text-gray-400 font-light text-sm">
        {description}
      </p>
    </div>
  </div>
);

export default Card;
