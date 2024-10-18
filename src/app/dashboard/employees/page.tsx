"use client";

import Button from "@/app/components/Button";
import DashContainer from "@/app/components/DashContainer";
import CustomInput from "@/app/components/Input";
import Layout from "@/app/components/Layout";
import { Department, Employee, Team } from "@prisma/client";
import Link from "next/link";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
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
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page
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

  const onSearch = (text: string) => {
    setSearch(text);
    const filteredEmployees = employees.filter(
      (employee) =>
        employee.firstName?.includes(text) ||
        employee.lastName?.includes(text) ||
        employee.department?.name.includes(text) ||
        employee.emailAddress?.includes(text)
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

      setEmployees(temp);
      setFiltered(temp);
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
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
        <div className="relative">
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
        <div className="flex items-center gap-4">
          <Link href={"/dashboard/employees/add"}>
            <Button icon text={"Add New Employee"} />
          </Link>
          <button
            onClick={handleOpenModal}
            className="border mb-4 border-grey text-[#16151C] px-4 py-2 rounded-[5px] flex gap-2 items-center"
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-grey">
                <tr className="border-b border-gray-700 font-normal">
                  {/* <td className="py-2 whitespace-nowrap w-10"></td> */}
                  <td className="py-2 whitespace-nowrap">Employee Name</td>
                  <td className="py-2 whitespace-nowrap">Employee ID</td>
                  <td className="py-2 whitespace-nowrap">Department</td>
                  <td className="py-2 whitespace-nowrap">Designation</td>
                  <td className="py-2 whitespace-nowrap">Email</td>
                  <td className="py-2 whitespace-nowrap">Action</td>
                </tr>
              </thead>
              <tbody className="text-[#16151C] divide-y divide-gray-700">
                {currentEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="py-2 h-full flex items-center justify-start whitespace-nowrap">
                      <Image
                        src={employee.profilePic || "/default-profile-pic.jpg"}
                        alt={`Profile picture of ${employee.firstName}`}
                        width={32}
                        height={32}
                        className="rounded-full mr-2"
                      />
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="py-2 whitespace-nowrap">{employee.id}</td>
                    <td className="py-2 whitespace-nowrap">
                      {employee.department.name}
                    </td>
                    <td className="py-2 whitespace-nowrap">
                      {employee.teams.name}
                    </td>
                    <td className="py-2 whitespace-nowrap">
                      {employee.emailAddress}
                    </td>
                    <td className="py-2 flex items-center h-full relative bottom-2">
                      <div onClick={() => handleNavigate(employee)}>
                        <i className="fas fa-pen text-[#16151C] mr-2 cursor-pointer"></i>
                      </div>
                      <i
                        onClick={() => deleteEmployee(employee.id)}
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
        <Toaster />

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
