// import { Employee } from "@prisma/client";
// import React, { useState } from "react";

// function EmployeeEmails({
//   htmlFor,
//   label,
//   options = [],
//   onChange = () => {},
//   required = false,
// }: {
//   htmlFor?: string;
//   label?: string;
//   options: Employee[]; // Define options array
//   onChange: (selectedEmails: (string | null)[]) => void; // Update onChange to accept an array of emails
//   required?: boolean;
// }) {
//   // State to handle the search input, visibility of the dropdown, and selected emails
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedEmails, setSelectedEmails] = useState<(string | null)[]>([]);

//   // Filtered options based on search query
//   const filteredOptions = options.filter(
//     (option) =>
//       option.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       option.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       option.emailAddress?.toLowerCase().includes(searchQuery.toLowerCase()) // Include emailAddress
//   );

//   // Handle opening/closing dropdown
//   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

//   // Handle selecting/deselecting an email or custom email entry
//   const toggleEmailSelection = (email: string | null) => {
//     setSelectedEmails((prev) => {
//       const newSelectedEmails = prev.includes(email)
//         ? prev.filter((e) => e !== email) // Remove if already selected
//         : [...prev, email]; // Add if not selected

//       onChange(newSelectedEmails); // Update parent with new selection
//       return newSelectedEmails;
//     });
//   };

//   // Handle input change for search and custom email
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     if (!isDropdownOpen) {
//       setIsDropdownOpen(true); // Open dropdown if closed
//     }
//   };

//   // Handle input blur to close dropdown
//   const handleBlur = () => {
//     setTimeout(() => {
//       setIsDropdownOpen(false); // Close dropdown on blur
//     }, 200); // Delay to allow for item selection
//   };

//   return (
//     <div className="mb-4">
//       <label
//         className="block text-gray-700 text-sm font-bold mb-2"
//         htmlFor={htmlFor}
//       >
//         {label}
//       </label>
//       {/* Container for the custom select box */}
//       <div className="relative">
//         {/* Search and select input */}
//         <input
//           type="text"
//           placeholder="Select or enter an email..."
//           value={searchQuery}
//           onChange={handleInputChange}
//           onFocus={toggleDropdown}
//           onBlur={handleBlur} // Add onBlur handler here
//           className="w-full border py-2 px-3 rounded leading-tight focus:outline-none focus:shadow-outline"
//           required={required}
//         />

//         {/* Display selected emails */}
//         <div className="mt-2">
//           {selectedEmails.length > 0 ? (
//             <div className="flex flex-wrap">
//               {selectedEmails.map((email) => (
//                 <span
//                   key={email}
//                   className="bg-blue-500 text-white rounded-full px-2 py-1 mr-2 mb-2"
//                 >
//                   {email}
//                   <button
//                     onClick={() => toggleEmailSelection(email)}
//                     className="ml-1 text-red-500"
//                   >
//                     &times;
//                   </button>
//                 </span>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500">No emails selected</p>
//           )}
//         </div>

//         {/* Dropdown menu (shown only if dropdown is open) */}
//         {isDropdownOpen && (
//           <ul className="absolute w-full border bg-white dark:bg-gray-800 z-10 max-h-60 overflow-y-auto mt-1 rounded shadow-lg">
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((option) => (
//                 <li
//                   key={option.id}
//                   onClick={() => toggleEmailSelection(option.emailAddress)}
//                   className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
//                     selectedEmails.includes(option.emailAddress)
//                       ? "bg-gray-200"
//                       : ""
//                   }`}
//                 >
//                   {option.emailAddress}
//                 </li>
//               ))
//             ) : (
//               <li className="px-4 py-2 text-gray-500 dark:text-white">
//                 No results found
//               </li>
//             )}
//             {/* Allow custom email entry */}
//             {searchQuery &&
//               !filteredOptions.find(
//                 (option) => option.emailAddress === searchQuery
//               ) && (
//                 <li
//                   onClick={() => toggleEmailSelection(searchQuery)}
//                   className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
//                     selectedEmails.includes(searchQuery) ? "bg-gray-200" : ""
//                   }`}
//                 >
//                   Add custom email: {searchQuery}
//                 </li>
//               )}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default EmployeeEmails;

import { Employee } from "@prisma/client";
import React, { useState } from "react";

function EmployeeEmails({
  htmlFor,
  label,
  options = [],
  onChange = () => {},
  required = false,
}: {
  htmlFor?: string;
  label?: string;
  options: Employee[];
  onChange: (selectedEmails: (string | null)[]) => void;
  required?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<(string | null)[]>([]);

  // Filtered options based on search query
  const filteredOptions = options.filter(
    (option) =>
      option.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.emailAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle opening dropdown
  const toggleDropdown = () => setIsDropdownOpen(true);

  // Handle selecting/deselecting an email
  const toggleEmailSelection = (email: string | null) => {
    setSelectedEmails((prev) => {
      const newSelectedEmails = prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email];

      onChange(newSelectedEmails);
      return newSelectedEmails;
    });
  };

  // Handle input change for search and custom email
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  // Close dropdown on blur after delay for item selection
  const handleBlur = () => {
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
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
          placeholder="Select or enter an email..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={toggleDropdown}
          onBlur={handleBlur}
          className="w-full border py-2 px-3 rounded leading-tight focus:outline-none focus:shadow-outline"
          required={required}
        />

        {/* Display selected emails */}
        <div className="mt-2">
          {selectedEmails.length > 0 ? (
            <div className="flex flex-wrap">
              {selectedEmails.map((email, index) => (
                <span
                  key={email || index}
                  className="bg-blue-500 text-white dark:text-dark rounded-full px-2 py-1 mr-2 mb-2"
                >
                  {email}
                  <button
                    onClick={() => toggleEmailSelection(email)}
                    className="ml-1 text-red-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No emails selected</p>
          )}
        </div>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <ul className="absolute w-full border bg-white dark:bg-gray-800 z-10 max-h-60 overflow-y-auto mt-1 rounded shadow-lg">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  onClick={() => toggleEmailSelection(option.emailAddress)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                    selectedEmails.includes(option.emailAddress)
                      ? "bg-gray-200"
                      : ""
                  }`}
                >
                  {option.emailAddress}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 dark:text-white">
                No results found
              </li>
            )}
            {/* Allow custom email entry */}
            {searchQuery &&
              !filteredOptions.find(
                (option) => option.emailAddress === searchQuery
              ) && (
                <li
                  onClick={() => toggleEmailSelection(searchQuery)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                    selectedEmails.includes(searchQuery) ? "bg-gray-200" : ""
                  }`}
                >
                  Add custom email: {searchQuery}
                </li>
              )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default EmployeeEmails;
