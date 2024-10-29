"use client";

import React from "react";

function CustomSelect({
  htmlFor,
  label,
  id,
  options = [],
  value,
  onChange = () => {},
  required = false,
  type,
}: {
  htmlFor?: string;
  label?: string;
  id?: string;
  options: { id: number | string; name: string }[]; // Define options array
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  type?: boolean;
}) {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      <div className="flex items-center shadow border rounded w-full py-2 px-3 gap-2 text-dark dark:text-white">
        <select
          className="appearance-none bg-transparent leading-tight focus:outline-none focus:shadow-outline w-full "
          id={id}
          value={value}
          onChange={(e) => onChange(e)}
          required={required}
        >
          <option className="text-dark" value="" disabled>
            -- Select --
          </option>
          {options.map((option, index) => (
            <option
              className="text-dark"
              key={index}
              value={type ? option.name : option.id}
            >
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default CustomSelect;
