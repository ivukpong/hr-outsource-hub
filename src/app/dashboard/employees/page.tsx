"use client";

import Button from "@/app/components/Button";
import DashContainer from "@/app/components/DashContainer";
import CustomInput from "@/app/components/Input";
import Layout from "@/app/components/Layout";
import { Department, Employee, Team } from "@prisma/client";
import Link from "next/link";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "@/app/components/Modal";
import Pagination from "@/app/components/Pagination";
import Image from "next/image";

function Employees() {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<
    (Employee & { department: Department; teams: Team })[]
  >([]);
  const [filtered, setFiltered] =
    useState<(Employee & { department: Department; teams: Team })[]>(employees);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page
  const [id, setId] = useState<number | null>(null); // Default items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const totalEmployees = filtered.length;

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEmployees);

  // Slice the data to show only the current page's items
  const currentEmployees = filtered.slice(startIndex, endIndex);
  const router = useRouter();
  const searchParams = useSearchParams();

  const dept = searchParams.get("department");

  // Toggle department selection
  const handleDepartmentChange = (departmentId: number) => {
    setSelectedDepartments((prev) =>
      prev.includes(departmentId)
        ? prev.filter((id) => id !== departmentId)
        : [...prev, departmentId]
    );
  };

  // Handle apply filter
  const handleApplyFilter = () => {
    const temp = employees.filter((employee) => {
      const matchesDepartment =
        selectedDepartments.length === 0 ||
        selectedDepartments.includes(employee?.departmentId ?? 0);
      const matchesType =
        selectedType === "" || employee.officeLocation === selectedType;

      return matchesDepartment && matchesType;
    });

    setFiltered(temp);
    handleCloseModal();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (employeeId: number) => {
    setId(employeeId);
    setIsDelete(true);
  };

  const handleCancel = () => {
    setIsDelete(false);
  };

  const onSearch = (searched: string) => {
    const text = searched.toLowerCase();
    setSearch(text);
    const filteredEmployees = employees.filter(
      (employee) =>
        employee.firstName?.toLowerCase().includes(text) ||
        employee.lastName?.toLowerCase().includes(text) ||
        employee.department?.name?.toLowerCase().includes(text) ||
        employee.emailAddress?.toLowerCase().includes(text)
    );
    setFiltered(filteredEmployees);
  };

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employees");
      const data: (Employee & { department: Department; teams: Team })[] =
        await res.json();

      // Filter employees based on department
      const temp: (Employee & { department: Department; teams: Team })[] = dept
        ? data.filter((employee) => employee.departmentId?.toString() === dept)
        : data;

      setEmployees(temp.reverse());
      setFiltered(temp.reverse());
      console.log(temp); // Log filtered employees
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  }, [dept]);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [fetchEmployees, fetchDepartments]);

  async function deleteEmployee(id: number) {
    const res = await fetch(`/api/employees?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
    } else {
      toast.error(data.error);
    }
    await fetchEmployees();
  }

  const handleNavigate = (employee: Employee) => {
    localStorage.setItem("selectedEmployee", JSON.stringify(employee));
    router.push("/dashboard/employees/edit");
  };

  return loading ? (
    <div className="flex h-full w-full items-center justify-center text-primary">
      <CircularProgress color="inherit" />
    </div>
  ) : (
    <div className="p-4">
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div>
          <h2 className="text-lg font-semibold mb-4">Filter</h2>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Department</h3>
            <div className="grid grid-cols-2 gap-2">
              {departments.map((department: Department) => (
                <label className="flex items-center" key={department.id}>
                  <input
                    type="checkbox"
                    className="form-checkbox appearance-none w-4 h-4 rounded border border-gray-300 checked:bg-orange-600 checked:border-orange-600 checked:text-white focus:outline-none transition duration-200"
                    onChange={() => handleDepartmentChange(department.id)}
                    checked={selectedDepartments.includes(department.id)}
                  />
                  <span className="ml-2">{department.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Select Type</h3>
            <div className="flex items-center space-x-4">
              {["Remote", "Hybrid", "On-site"].map((type) => (
                <label className="flex items-center" key={type}>
                  <input
                    type="radio"
                    name="type"
                    className="form-radio appearance-none w-4 h-4 rounded-full border border-gray-300 checked:bg-orange-600 checked:border-orange-600 focus:outline-none transition duration-200 relative"
                    onChange={() => setSelectedType(type)}
                    checked={selectedType === type}
                  />
                  <span className="ml-2">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              className="px-4 py-2 border rounded-md"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded-md"
              onClick={handleApplyFilter}
            >
              Apply
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isDelete} onClose={handleCancel}>
        <div className="rounded-lg text-center max-w-sm">
          {/* Success Icon */}
          <Image
            src="/images/delete.png" // Path to the image
            alt="Trash Icon" // Alt text for accessibility
            width={80} // Set the width (adjust based on your design)
            height={80} // Set the height (adjust based on your design)
            className="h-20 mb-4 mx-auto" // Apply existing styles
          />{" "}
          {/* Success Message */}
          <h2 className="text-2xl font-semibold mb-2">Delete Employee</h2>
          <p className="text-gray-600 mb-6 w-[75%] mx-auto">
            Are you sure you want to delete this employee? This action cannot be
            undone.
          </p>
          {/* Go Home Button */}
          {id && (
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => deleteEmployee(id)}
                className="bg-[#D92D20] text-white py-2 cursor-pointer px-4 rounded-[5px] w-full"
              >
                Delete
              </button>
              <button
                onClick={handleCancel}
                className="border-[#D5D7DA] border text-[#666666] dark:text-white py-2 cursor-pointer px-4 rounded-[5px] w-full"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </Modal>
      <div className="flex w-full justify-center md:justify-between items-center mb-4 md:flex-row flex-col">
        <div className="relative flex justify-center md:justify-start items-center">
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
        <div className="flex items-center gap-4 justify-center md:justify-end">
          <Link href={"/dashboard/employees/add"}>
            <Button icon text={"Add New Employee"} />
          </Link>
          <button
            onClick={handleOpenModal}
            className="border mb-4 border-grey text-[#16151C] dark:text-white px-4 py-2 rounded-[5px] flex gap-2 items-center w-fit mx-auto"
          >
            <p>Filter</p>
            <i className="fas fa-filter"></i>
          </button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center text-primary">
          <p>No employees onboarded</p>
        </div>
      ) : (
        <div>
          <div className="container mx-auto p-0 md:py-4 overflow-auto">
            <table
              className="min-w-full divide-y divide-gray-200"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="text-grey">
                <tr className="border-b border-gray-700 font-normal">
                  <td
                    className="py-2 px-4 whitespace-nowrap"
                    style={{ minWidth: "150px" }}
                  >
                    Employee Name
                  </td>
                  <td
                    className="py-2 px-4 whitespace-nowrap"
                    style={{ minWidth: "100px" }}
                  >
                    Employee ID
                  </td>
                  <td
                    className="py-2 px-4 whitespace-nowrap"
                    style={{ minWidth: "150px" }}
                  >
                    Department
                  </td>
                  <td
                    className="py-2 px-4 whitespace-nowrap"
                    style={{ minWidth: "150px" }}
                  >
                    Designation
                  </td>
                  <td
                    className="py-2 px-4 whitespace-nowrap"
                    style={{ minWidth: "200px" }}
                  >
                    Email
                  </td>
                  <td
                    className="py-2 px-4 whitespace-nowrap"
                    style={{ minWidth: "100px" }}
                  >
                    Action
                  </td>
                </tr>
              </thead>
              <tbody className="text-[#16151C] dark:text-white divide-y divide-gray-700">
                {currentEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="py-2 px-4 h-full flex items-center justify-start whitespace-nowrap overflow-hidden text-ellipsis">
                      <Image
                        src={employee.profilePic || "/default-profile-pic.jpg"}
                        alt={`Profile picture of ${employee.firstName}`}
                        width={32}
                        height={32}
                        className="rounded-full mr-2"
                      />
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap overflow-hidden text-ellipsis">
                      {employee.id}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap overflow-hidden text-ellipsis">
                      {employee.department.name}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap overflow-hidden text-ellipsis">
                      {employee.teams.name}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap overflow-hidden text-ellipsis">
                      {employee.emailAddress}
                    </td>
                    <td className="py-2 px-4 flex items-center h-full relative bottom-2">
                      <div onClick={() => handleNavigate(employee)}>
                        <i className="fas fa-pen text-[#16151C] dark:text-white mr-2 cursor-pointer"></i>
                      </div>
                      <i
                        onClick={() => handleDelete(employee.id)}
                        className="fas fa-trash text-red-400 cursor-pointer"
                      ></i>
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
          />{" "}
        </div>
      )}
    </div>
  );
}

function Page() {
  return (
    <DashContainer>
      <Layout header="Employees" desc="Employee Information">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center text-primary">
              <CircularProgress color="inherit" />
            </div>
          }
        >
          <Employees />
        </Suspense>
      </Layout>
    </DashContainer>
  );
}

export default Page;
