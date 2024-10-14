"use client";

import { Employee } from "@prisma/client";
import React, { useState } from "react";

function EmployeeSelect({
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
  options: Employee[]; // Define options array
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}) {
  // State to handle the search input and visibility of the dropdown
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filtered options based on search query
  const filteredOptions = options.filter(
    (option) =>
      option.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle opening/closing dropdown
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      {/* Container for the custom select box */}
      <div className="relative">
        {/* Search and select input */}
        <input
          type="text"
          placeholder="Select or search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={toggleDropdown}
          className="w-full border py-2 px-3 rounded leading-tight focus:outline-none focus:shadow-outline"
          required={required}
        />

        {/* Dropdown menu (shown only if dropdown is open) */}
        {isDropdownOpen && (
          <ul className="absolute w-full border bg-white z-10 max-h-60 overflow-y-auto mt-1 rounded shadow-lg">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  onClick={() => {
                    onChange({ target: { value: option.id } } as any);
                    setSearchQuery(`${option.firstName} ${option.lastName}`); // Update the search input with the selected option
                    setIsDropdownOpen(false); // Close the dropdown
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                >
                  {option.firstName} {option.lastName}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default EmployeeSelect;
