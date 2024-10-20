import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaUpload } from "react-icons/fa";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; // Get the files from the input
    if (files && files.length > 0) {
      setFile(files[0]); // Set the first file to the state
    } else {
      setFile(null); // Handle the case where no files are selected
    }
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
      toast.success(result.message || "File uploaded successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file: " + error.message);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Toaster />
      <label className="cursor-pointer mb-4">
        <button className="border border-grey text-[#16151C] dark:text-white px-4 py-2 rounded-[5px] flex gap-2 items-center relative">
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
        className="border border-grey text-[#16151C] dark:text-white px-4 py-2 rounded-[5px] mt-2"
        disabled={!file}
      >
        Submit
      </button>
    </div>
  );
};

export default FileUpload;
