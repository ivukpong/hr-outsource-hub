import { Employee } from "@prisma/client";
import React, { useState, useEffect } from "react";

function EmployeeNames({
  htmlFor,
  label,
  options = [],
  onChange = () => {},
  required = false,
}: {
  htmlFor?: string;
  label?: string;
  options: Employee[];
  onChange: (selectedEmails: string[]) => void;
  required?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);

  // Derive selectedEmails from selectedEmployees to contain only emails
  const selectedEmails = selectedEmployees.map(
    (employee) => employee.emailAddress
  );

  useEffect(() => {
    onChange(selectedEmails.filter((email): email is string => email !== null)); // Pass only non-null emails to parent component
  }, [selectedEmails, onChange]);

  // Filtered options based on search query
  const filteredOptions = options.filter(
    (option) =>
      option.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.emailAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle email selection
  const toggleEmailSelection = (employee: Employee) => {
    setSelectedEmployees((prev) => {
      const isAlreadySelected = prev.some(
        (e) => e.emailAddress === employee.emailAddress
      );
      const newSelectedEmployees = isAlreadySelected
        ? prev.filter((e) => e.emailAddress !== employee.emailAddress) // Remove if already selected
        : [...prev, employee]; // Add if not selected

      return newSelectedEmployees;
    });
  };

  // Handle input change for search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true); // Open dropdown if closed
    }
  };

  // Handle input blur to close dropdown
  const handleBlur = () => {
    setTimeout(() => {
      setIsDropdownOpen(false); // Close dropdown on blur
    }, 200); // Delay to allow for item selection
  };

  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search employee by name..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={handleBlur}
          className="w-full border py-2 px-3 rounded leading-tight focus:outline-none focus:shadow-outline"
          required={required}
        />

        <div className="mt-2">
          {selectedEmployees.length > 0 ? (
            <div className="flex flex-wrap">
              {selectedEmployees.map((employee) => (
                <span
                  key={employee.emailAddress}
                  className="bg-blue-500 text-white rounded-full px-2 py-1 mr-2 mb-2"
                >
                  {employee.firstName} {employee.lastName}
                  <button
                    onClick={() => toggleEmailSelection(employee)}
                    className="ml-1 text-red-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No employee selected</p>
          )}
        </div>

        {isDropdownOpen && (
          <ul className="absolute w-full border bg-white dark:bg-gray-800 z-10 max-h-60 overflow-y-auto mt-1 rounded shadow-lg">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  onClick={() => toggleEmailSelection(option)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                    selectedEmployees.some(
                      (e) => e.emailAddress === option.emailAddress
                    )
                      ? "bg-gray-200"
                      : ""
                  }`}
                >
                  {option.firstName} {option.lastName}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 dark:text-white">
                No results found
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default EmployeeNames;
