import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/attendance-upload", {
        method: "POST",
        body: formData, // Using FormData to upload file
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const result = await response.json();
      alert(result.message || "File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="cursor-pointer mb-4">
        <button className="border border-grey text-[#16151C] px-4 py-2 rounded-[5px] flex gap-2 items-center relative">
          <FaUpload className="text-xl" />
          <p>{file ? file.name : "Upload CSV/Excel"}</p>
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </button>
      </label>
      <button
        onClick={handleFileUpload}
        className="border border-grey text-[#16151C] px-4 py-2 rounded-[5px] mt-2"
        disabled={!file}
      >
        Submit
      </button>
    </div>
  );
};

export default FileUpload;
