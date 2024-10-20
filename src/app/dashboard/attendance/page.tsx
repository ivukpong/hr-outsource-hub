"use client";

import Button from "@/app/components/Button";
import DashContainer from "@/app/components/DashContainer";
import EmployeeSelect from "@/app/components/EmployeeSelect";
import CustomInput from "@/app/components/Input";
import Layout from "@/app/components/Layout";
import Modal from "@/app/components/Modal";

import Pagination from "@/app/components/Pagination";
import { CircularProgress } from "@mui/material";
import { Attendance, Employee, Team } from "@prisma/client";
import Image from "next/image";

import React, { useState } from "react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaUpload } from "react-icons/fa6";

function Page() {
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState<
    (Attendance & { team: Team; employee: Employee })[]
  >([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filtered, setFiltered] = useState(attendance);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [employeeId, setEmployeeID] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    // Check if any files are selected
    if (!files || !files[0]) {
      toast.error("Please select a file");
      return;
    }

    // Set the file state with the first file selected
    setFile(files[0]);

    const formData = new FormData();
    formData.append("file", files[0]);

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
      setEmployeeID("");
      setCheckInDate("");
    } catch (error: unknown) {
      console.error("Error uploading file:", error);

      // Handle the error correctly using type assertion
      if (error instanceof Error) {
        toast.error("Error uploading file: " + error.message);
      } else {
        toast.error("Error uploading file: An unknown error occurred.");
      }
    }
  };

  // Calculate the total number of pages
  const totalEmployees = filtered.length;

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEmployees);

  // Slice the data to show only the current page's items
  const currentEmployees = filtered.slice(startIndex, endIndex);

  const onSearch = (text: string) => {
    setSearch(text);
    const filteredAttendace = attendance.filter(
      (data) =>
        data.employee.firstName?.includes(text) ||
        data.employee.lastName?.includes(text) ||
        data.type.includes(text) ||
        data.checkIn.toLocaleString().includes(text) ||
        data.team.name?.includes(text) ||
        data.status.includes(text)
    );
    setFiltered(filteredAttendace);
  };

  async function fetchAttendance() {
    const res = await fetch("/api/attendance");
    const data = await res.json();
    setAttendance(data);
    setFiltered(data);
  }

  async function fetchEmployees() {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
    setLoading(false);
  }

  const getFormat = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleString("en-US", options);
  };

  useEffect(() => {
    setLoading(true);
    fetchAttendance();
    fetchEmployees();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const attendanceData = {
      employeeId: parseInt(employeeId),
      checkIn: new Date(checkInDate),
      teamId: employees.filter((emp) => emp.id === parseInt(employeeId))[0]
        .teamId,
      type: employees.filter((emp) => emp.id === parseInt(employeeId))[0]
        .officeLocation,
    };

    // Submit data to API
    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Attendance recorded successfully");
        handleCloseModal(); // Close the modal after submission
      } else {
        toast.error(result.error || "Failed to submit attendance");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };

  return (
    <DashContainer>
      <Layout header="Attendance" desc="Employee Attendance">
        <Toaster />
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <Toaster />
          <div className="w-full max-w-lg">
            <h2 className="text-dark dark:text-white text-xl font-semibold mb-4">
              Attendance Form
            </h2>
            <form onSubmit={handleSubmit}>
              <EmployeeSelect
                htmlFor="employee"
                label="Select Employee"
                id="Employee"
                value={employeeId}
                options={employees}
                onChange={(e) => setEmployeeID(e.target.value)}
                required
              />

              <CustomInput
                htmlFor="checkInDate"
                label="Check In Time"
                id="checkInDate"
                type="datetime-local"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
              />

              <div className="flex justify-between mt-5 gap-5">
                <div className="w-full">
                  <Button
                    text="Cancel"
                    type="button"
                    outline
                    click={handleCloseModal}
                  />
                </div>
                <div className="w-full">
                  <Button text="Submit" type="submit" />
                </div>
              </div>
            </form>
          </div>
        </Modal>
        {loading ? (
          <div className="flex h-full w-full items-center justify-center text-primary">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <div className="">
            <div className="flex w-full justify-center md:justify-between items-center mb-4">
              <div className="relative flex w-full justify-start items-center">
                <CustomInput
                  htmlFor="search"
                  label=""
                  id="search"
                  type="text"
                  placeholder="Search"
                  value={search}
                  icon
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
              <div className="flex w-full items-center gap-4 justify-end">
                <Button
                  icon
                  text={"Upload Employee Attendance"}
                  click={handleOpenModal}
                />
                <div className="flex flex-col items-center">
                  <label className="cursor-pointer mb-4">
                    <button className="border border-grey text-[#16151C] dark:text-white px-4 py-2 rounded-[5px] flex gap-2 items-center relative">
                      <FaUpload className="text-xl" />
                      <p>{file ? file.name : "Upload CSV/Excel"}</p>
                      <input
                        type="file"
                        accept=".csv, .xlsx"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </button>
                  </label>
                </div>
              </div>
            </div>
            <div className="container mx-auto p-4 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="">
                  <tr>
                    <th className="px-6 py-3 text-left text-grey font-normal">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-grey font-normal">
                      Employee Name
                    </th>
                    <th className="px-6 py-3 text-left text-grey font-normal">
                      Designation
                    </th>
                    <th className="px-6 py-3 text-left text-grey font-normal">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-grey font-normal">
                      Check In Time
                    </th>
                    <th className="px-6 py-3 text-left text-grey font-normal">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                  {currentEmployees.map((employee, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500  dark:text-white">
                          {getFormat(new Date(employee.checkIn)).split(",")[0]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={employee?.employee?.profilePic ?? ""}
                          alt={`Profile of ${employee.employee.firstName}`}
                          width={40}
                          height={40}
                        />
                        <div className="ml-4">
                          <div className="text-sm  text-gray-500  dark:text-white">
                            {employee.employee.firstName}{" "}
                            {employee.employee.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500  dark:text-white">
                          {employee?.team?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500  dark:text-white">
                          {employee.employee.officeLocation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500  dark:text-white">
                          {getFormat(new Date(employee.checkIn)).split(",")[1]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={
                            employee.status === "On Time"
                              ? "bg-[#3FC28A1A] text-[#3FC28A] px-2 py-1 rounded"
                              : "bg-[#F45B691A] text-[#F45B69] px-2 py-1 rounded"
                          }
                        >
                          {employee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              data={filtered}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              setItemsPerPage={setItemsPerPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </Layout>
    </DashContainer>
  );
}

export default Page;
