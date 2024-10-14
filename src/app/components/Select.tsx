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
}: {
  htmlFor?: string;
  label?: string;
  id?: string;
  options: { id: number; name: string }[]; // Define options array
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      <div className="flex items-center shadow border rounded w-full py-2 px-3 gap-2 text-dark">
        <select
          className="appearance-none leading-tight focus:outline-none focus:shadow-outline w-full"
          id={id}
          value={value}
          onChange={(e) => onChange(e)}
          required={required}
        >
          <option value="" disabled>
            -- Select --
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default CustomSelect;
