import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

function StatCard({
  item,
}: {
  item: {
    id: number;
    icon: IconDefinition;
    title: string;
    trend: string;
    value: number | undefined;
    color: string;
    stat: string;
    trendText: string;
  };
}) {
  return (
    <div
      key={item.id}
      className="p-4 rounded-lg shadow-md flex flex-col justify-between border-[#E3E3E3]  dark:border-gray-500 border-[0.5px]"
    >
      <div className="flex items-center justify-between text-[#D5D7DA]">
        <FontAwesomeIcon icon={item.icon} size="lg" />
        {/* You can add a menu icon here if needed */}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-black dark:text-white ">
          {item.value}
        </h3>
        <h3 className="text-sm font-medium text-[#D5D7DA]">{item.title}</h3>
        <p className={`mt-2 ${item.color} text-[#646464] opacity-[57] text-xs`}>
          {item.trend === "up" ? (
            <span className="text-[#27AB57]">↑ {item.stat}</span>
          ) : (
            <span className="text-[#ED2929]">↓ {item.stat}</span>
          )}{" "}
          <span className="text-gray-400">{item.trendText}</span>
        </p>
      </div>
    </div>
  );
}

export default StatCard;
