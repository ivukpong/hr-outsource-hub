import React from "react";

function SettingPills({
  name,
  active,
  setActive,
}: {
  name: string;
  active: string;
  setActive: (name: string) => void;
}) {
  return (
    <h1
      onClick={() => setActive(name)}
      className={`${active === name ? "bg-[#EBEBEB] opacity-40 dark:opacity-100 dark:text-dark" : ""} font-bold rounded-[4px] px-4 py-[6px] cursor-pointer `}
    >
      {name}
    </h1>
  );
}

export default SettingPills;
