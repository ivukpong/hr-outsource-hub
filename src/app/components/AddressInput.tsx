import React, { useState } from "react";

function CustomInput({
  htmlFor,
  label,
  id,
  type,
  placeholder,
  value,
  onChange = () => {},
  required = false,
  icon,
}: {
  htmlFor?: string;
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: boolean;
}) {
  const [suggestions, setSuggestions] = useState<{ display_name: string }[]>(
    []
  );
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchTerm
        )}&format=json&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
      setIsDropdownVisible(true);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
    }
  };

  return (
    <div className="mb-4 relative">
      <label
        className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      <div className="flex items-center shadow border rounded w-full py-2 px-3 gap-2 text-dark dark:text-white">
        {icon && (
          <i className="fas fa-search left-3 top-2.5 text-dark dark:text-white"></i>
        )}
        <input
          className="appearance-none bg-transparent leading-tight focus:outline-none focus:shadow-outline w-full"
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e);
            handleSearch(e.target.value);
          }}
          required={required}
        />
      </div>
      {isDropdownVisible && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white dark:bg-gray-800 shadow-md rounded-lg mt-1 max-h-60 overflow-y-auto w-full">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="cursor-pointer px-4 py-2 hover:bg-gray-200"
              onClick={() => {
                const inputElement = document.querySelector(
                  "input"
                ) as HTMLInputElement; // Target your specific input element if necessary
                if (inputElement) {
                  const inputEvent = new Event("input", { bubbles: true });
                  inputElement.value = suggestion.display_name;
                  inputElement.dispatchEvent(inputEvent); // Manually dispatch the input event
                }
                setIsDropdownVisible(false); // Hide dropdown after selecting
              }}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomInput;
