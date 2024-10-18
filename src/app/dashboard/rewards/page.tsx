"use client";

import Cards from "@/app/components/Cards";
import DashContainer from "@/app/components/DashContainer";
import CustomInput from "@/app/components/Input";
import Layout from "@/app/components/Layout";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

import React, { useState } from "react";
import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import CustomSelect from "@/app/components/Select";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { Category, Department, Employee, Reward } from "@prisma/client";
import EmployeeSelect from "@/app/components/EmployeeSelect";
import { CircularProgress } from "@mui/material";
import Pagination from "@/app/components/Pagination";
import Image from "next/image";

function Page() {
  const [search, setSearch] = useState("");
  const [rewards, setRewards] = useState([]);
  const [filtered, setFiltered] = useState(rewards);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeID] = useState("");
  const [earnedDate, setDateEarned] = useState("");
  const [department, setDepartment] = useState("");
  const [pointsEarned, setPointsEarned] = useState("");
  const [category, setCategory] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const totalEmployees = filtered.length;

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEmployees);

  // Slice the data to show only the current page's items
  const currentRewards = filtered.slice(startIndex, endIndex);

  // Toggle department selection
  const handleDepartmentChange = (departmentId: number) => {
    setSelectedDepartments((prev) =>
      prev.includes(departmentId)
        ? prev.filter((id) => id !== departmentId)
        : [...prev, departmentId]
    );
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle apply filter
  const handleApplyFilter = () => {
    const temp = rewards.filter(
      (reward: { employee: { departmentId: number }; categoryId: number }) => {
        const matchesDepartment =
          selectedDepartments.length === 0 ||
          selectedDepartments.includes(reward.employee.departmentId);
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(reward.categoryId);

        return matchesDepartment && matchesCategory;
      }
    );

    setFiltered(temp);
    setIsFilterOpen(false);
  };

  async function fetchRewards() {
    const res = await fetch("/api/rewards");
    const data = await res.json();
    setRewards(data);
    setFiltered(data);
  }

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  }
  async function fetchDepartments() {
    const res = await fetch("/api/departments");
    const data = await res.json();
    setDepartments(data);
  }

  async function fetchEmployees() {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  }

  useEffect(() => {
    setLoading(true);
    fetchDepartments();
    fetchCategories();
    fetchEmployees();
    fetchRewards();
    setLoading(false);
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onSearch = (text: string) => {
    setSearch(text);
    const filteredEmployees = rewards.filter(
      (reward: {
        employee: { firstName: string | string[]; lastName: string | string[] };
        department: { name: string | string[] };
        category: { name: string | string[] };
        progress: { toString: () => string | string[] };
      }) =>
        reward.employee.firstName.includes(text) ||
        reward.employee.lastName.includes(text) ||
        reward.department.name.includes(text) ||
        reward.category.name.includes(text) ||
        reward.progress.toString().includes(text)
    );
    setFiltered(filteredEmployees);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      employeeId,
      earnedDate,
      departmentId: parseInt(department),
      pointsEarned: parseInt(pointsEarned),
      categoryId: parseInt(category),
    };

    // Assuming you would send this data to an API endpoint
    const response = await fetch("/api/rewards", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      toast.success("Reward submitted successfully");
      fetchRewards();
    } else {
      toast.error("Failed to submit reward");
    }
    handleCloseModal();
  };
  return (
    <DashContainer>
      <Toaster />
      <Layout header="Rewards" desc="Rewards and Incentives">
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="w-full max-w-lg">
            <h2 className="text-dark text-xl font-semibold mb-4">
              Rewards Form
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
              <div className="flex space-x-4 w-full">
                <div className="w-1/2">
                  <CustomInput
                    htmlFor="pointsEarned"
                    label="Points Earned"
                    id="pointsEarned"
                    type="number"
                    placeholder="Enter Points"
                    value={pointsEarned}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPointsEarned(e.target.value)
                    }
                    required
                  />
                </div>
                <div className="w-1/2">
                  <CustomInput
                    htmlFor="earnedDate"
                    label="Date Earned"
                    id="earnedDate"
                    type="date"
                    value={earnedDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setDateEarned(e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <CustomSelect
                htmlFor="department"
                label="Select Department"
                id="department"
                value={department}
                options={departments}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />

              <div className="mt-4">
                <CustomSelect
                  htmlFor="category"
                  label="Select Category"
                  id="category"
                  value={category}
                  options={categories}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>

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
                  <Button text="Apply" type="submit" />
                </div>
              </div>
            </form>
          </div>
        </Modal>
        <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
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
              <h3 className="font-semibold mb-2">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category: Category) => (
                  <label className="flex items-center" key={category.id}>
                    <input
                      type="checkbox"
                      className="form-checkbox appearance-none w-4 h-4 rounded border border-gray-300 checked:bg-orange-600 checked:border-orange-600 checked:text-white focus:outline-none transition duration-200"
                      onChange={() => handleCategoryChange(category.id)}
                      checked={selectedCategories.includes(category.id)}
                    />
                    <span className="ml-2">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                className="px-4 py-2 border rounded-md"
                onClick={() => setIsFilterOpen(false)}
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
        <Cards />
        {loading ? (
          <div className="flex h-full w-full items-center justify-center text-primary">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <div className="">
            <div className="flex w-full justify-center md:justify-between items-center mb-4">
              <div className="relative flex w-full justify-start items-center ml-4">
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
                  text={"Create Reward Campaign"}
                  click={handleOpenModal}
                />
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="border mb-4 border-grey text-[#16151C] px-4 py-2 rounded-[5px] flex gap-2 items-center"
                >
                  <p>Filter</p>
                  <i className="fas fa-filter"></i>
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center text-primary">
                <p>No rewards added</p>
              </div>
            ) : (
              <div>
                <div className="container mx-auto p-4 overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="">
                      <tr>
                        <th className="px-6 py-3 text-left text-grey font-normal">
                          Employee Name
                        </th>
                        <th className="px-6 py-3 text-left text-grey font-normal">
                          Date Earned
                        </th>
                        <th className="px-6 py-3 text-left text-grey font-normal">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-grey font-normal">
                          Category
                        </th>

                        <th className="px-6 py-3 text-left text-grey font-normal">
                          Points Earned
                        </th>
                        <th className="px-6 py-3 text-left text-grey font-normal">
                          Progress
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentRewards.map(
                        (
                          reward: Reward & {
                            employee: Employee;
                            category: Category;
                            department: Department;
                            earnedDate: string;
                          },
                          index
                        ) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap flex items-center">
                              <Image
                                className="h-10 w-10 rounded-full"
                                src={reward?.employee?.profilePic ?? ""}
                                alt={`Profile of ${reward.employee.id}`}
                                width={40}
                                height={40}
                              />
                              <div className="ml-4">
                                <div className="text-sm  text-gray-900">
                                  {reward.employee.firstName}{" "}
                                  {reward.employee.lastName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(
                                  reward.earnedDate
                                ).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {reward.department?.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {reward.category?.name}
                              </div>
                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {reward.departmentHead?.firstName}{" "}
                              {reward.departmentHead?.lastName}
                            </div>
                          </td> */}
                            {/* <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={
                                employee.status === "Present"
                                  ? "bg-[#3FC28A1A] text-[#3FC28A] px-2 py-1 rounded"
                                  : "bg-[#F45B691A] text-[#F45B69] px-2 py-1 rounded"
                              }
                            >
                              {employee.status}
                            </span>
                          </td> */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-[#FFA100]">
                                {reward.pointsEarned}
                              </div>{" "}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div style={{ width: 35, height: 35 }}>
                                <CircularProgressbar
                                  value={reward?.progress ?? 0}
                                  text={`${reward.progress}%`}
                                  strokeWidth={15}
                                  styles={buildStyles({
                                    rotation: 0,
                                    strokeLinecap: "round",
                                    textSize: "28px",
                                    pathTransitionDuration: 0.5,
                                    pathTransition:
                                      "stroke-dashoffset 0.5s ease 0s",
                                    pathColor: `#FFA100`,
                                    textColor: "#1E1E1E",
                                    trailColor: "rgba(30, 30, 30, 0.102)",
                                  })}
                                />
                              </div>
                            </td>
                          </tr>
                        )
                      )}{" "}
                    </tbody>{" "}
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
        )}
      </Layout>
    </DashContainer>
  );
}

export default Page;
