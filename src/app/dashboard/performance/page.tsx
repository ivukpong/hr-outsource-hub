"use client";

import DashContainer from "@/app/components/DashContainer";
import CustomInput from "@/app/components/Input";
import Layout from "@/app/components/Layout";

import React, { useState } from "react";
import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import CustomSelect from "@/app/components/Select";
import toast from "react-hot-toast";
import { useEffect } from "react";
import {
  Category,
  Department,
  Employee,
  Kpi,
  Performance,
  Team,
} from "@prisma/client";
import EmployeeSelect from "@/app/components/EmployeeSelect";
import { CircularProgress } from "@mui/material";
import Pagination from "@/app/components/Pagination";
import Image from "next/image";

function Page() {
  const [search, setSearch] = useState("");
  const [performance, setPerformance] = useState([]);
  const [filtered, setFiltered] = useState(performance);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [kpis, setKpis] = useState<Category[]>([]);
  const [teams, setTeams] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeID] = useState("");
  const [earnedDate, setDateEarned] = useState("");
  const [team, setTeam] = useState("");
  const [pointsEarned, setPointsEarned] = useState("");
  const [kpi, setKpi] = useState("");
  const [selectedTeam, setSelectedTeams] = useState<number[]>([]);
  const [selectedKpis, setSelectedKpis] = useState<number[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const totalEmployees = filtered.length;

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEmployees);

  // Slice the data to show only the current page's items
  const currentPerformance = filtered.slice(startIndex, endIndex);

  // Toggle department selection
  const handleTeamChange = (teamId: number) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleKPiChange = (categoryId: number) => {
    setSelectedKpis((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle apply filter
  const handleApplyFilter = () => {
    const temp = performance.filter(
      (reward: { employee: { teamId: number }; categoryId: number }) => {
        const matchesDepartment =
          selectedTeam.length === 0 ||
          selectedTeam.includes(reward.employee.teamId);
        const matchesCategory =
          selectedKpis.length === 0 || selectedKpis.includes(reward.categoryId);

        return matchesDepartment && matchesCategory;
      }
    );

    setFiltered(temp);
    setIsFilterOpen(false);
  };

  async function fetchPerformance() {
    const res = await fetch("/api/performance");
    const data = await res.json();
    setPerformance(data);
    setFiltered(data);
    setLoading(false);
  }

  async function fetchKpis() {
    const res = await fetch("/api/kpis");
    const data = await res.json();
    setKpis(data);
  }
  async function fetchTeams() {
    const res = await fetch("/api/teams");
    const data = await res.json();
    setTeams(data);
  }

  async function fetchEmployees() {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  }

  useEffect(() => {
    setLoading(true);
    fetchTeams();
    fetchKpis();
    fetchEmployees();
    fetchPerformance();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onSearch = (text: string) => {
    setSearch(text);
    const filteredEmployees = performance.filter(
      (reward: {
        employee: { firstName: string | string[]; lastName: string | string[] };
        kpi: { name: string | string[] };
        team: { name: string | string[] };
        progress: { toString: () => string | string[] };
      }) =>
        reward.employee.firstName.includes(text) ||
        reward.employee.lastName.includes(text) ||
        reward.kpi.name.includes(text) ||
        reward.team.name.includes(text) ||
        reward.progress.toString().includes(text)
    );
    setFiltered(filteredEmployees);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      employeeId,
      evaluationDate: earnedDate,
      teamId: parseInt(team),
      score: parseInt(pointsEarned),
      kpiId: parseInt(kpi),
    };

    // Assuming you would send this data to an API endpoint
    const response = await fetch("/api/performance", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      toast.success("Reward submitted successfully");
      fetchPerformance();
    } else {
      toast.error("Failed to submit reward");
    }
    handleCloseModal();
  };
  return (
    <DashContainer>
      <Layout header="Performance" desc="Performance Management">
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="w-full max-w-lg">
            <h2 className="text-dark dark:text-white text-xl font-semibold mb-4">
              Performance Form
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
                htmlFor="team"
                label="Select Team"
                id="team"
                value={team}
                options={teams}
                onChange={(e) => setTeam(e.target.value)}
                required
              />

              <div className="mt-4">
                <CustomSelect
                  htmlFor="category"
                  label="Select KPI"
                  id="kpi"
                  value={kpi}
                  options={kpis}
                  onChange={(e) => setKpi(e.target.value)}
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
                {teams.map((department: Department) => (
                  <label className="flex items-center" key={department.id}>
                    <input
                      type="checkbox"
                      className="form-checkbox appearance-none w-4 h-4 rounded border border-gray-300 checked:bg-orange-600 checked:border-orange-600 checked:text-white focus:outline-none transition duration-200"
                      onChange={() => handleTeamChange(department.id)}
                      checked={selectedTeam.includes(department.id)}
                    />
                    <span className="ml-2">{department.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-4 max-h-[50%] ">
              <h3 className="font-semibold mb-2">Categories</h3>
              <div className="grid grid-cols-2 gap-2 overflow-y-auto">
                {kpis.map((category: Category) => (
                  <label className="flex items-center" key={category.id}>
                    <input
                      type="checkbox"
                      className="form-checkbox appearance-none w-4 h-4 rounded border border-gray-300 checked:bg-orange-600 checked:border-orange-600 checked:text-white focus:outline-none transition duration-200"
                      onChange={() => handleKPiChange(category.id)}
                      checked={selectedKpis.includes(category.id)}
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
        {loading ? (
          <div className="flex h-full w-full items-center justify-center text-primary">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <div className="">
            <div className="flex w-full justify-center md:justify-between items-center mb-4 flex-wrap">
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
                <Button text={"Set Employee KPI"} click={handleOpenModal} />
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="border mb-4 border-grey text-[#16151C] dark:text-white px-4 py-2 rounded-[5px] flex gap-2 items-center w-fit "
                >
                  <p>Filter</p>
                  <i className="fas fa-filter"></i>
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center text-primary">
                <p>No performance record added</p>
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
                          Designation
                        </th>
                        <th className="px-6 py-3 text-left text-grey font-normal">
                          Key Performance Indicator
                        </th>
                        <th className="px-6 py-3 text-left text-grey font-normal">
                          KPI Progress
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                      {currentPerformance.map(
                        (
                          perform: Performance & {
                            employee: Employee;
                            kpi: Kpi;
                            team: Team & { department: Department };
                            earnedDate: string;
                          },
                          index
                        ) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap flex items-center">
                              <Image
                                className="h-10 w-10 rounded-full"
                                src={perform?.employee?.profilePic ?? ""}
                                alt={`Profile of ${perform.employee.id}`}
                                width={40}
                                height={40}
                              />
                              <div className="ml-4">
                                <div className="text-sm  text-gray-500 dark:text-white">
                                  {perform.employee.firstName}{" "}
                                  {perform.employee.lastName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500  dark:text-white">
                                {new Date(
                                  perform?.evaluationDate ?? ""
                                ).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500  dark:text-white">
                                {perform.team?.department?.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500  dark:text-white">
                                {perform.team?.name}
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-[#FFA100]">
                                {perform.kpi?.name}
                              </div>{" "}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-bold text-sm text-[#129D44]">
                                {perform.progress}%
                              </div>{" "}
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
