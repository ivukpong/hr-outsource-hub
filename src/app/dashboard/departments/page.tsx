"use client";

import Button from "@/app/components/Button";
import DashContainer from "@/app/components/DashContainer";
import DepartmentContainer from "@/app/components/DepartmentContainer";
import EmployeeSelect from "@/app/components/EmployeeSelect";
import CustomInput from "@/app/components/Input";
import Layout from "@/app/components/Layout";
import Modal from "@/app/components/Modal";
import CustomSelect from "@/app/components/Select";
import { CircularProgress } from "@mui/material";
import { Department, Employee, Team } from "@prisma/client";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";

function Page() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<
    (Department & { teams: Team[]; employees: Employee[] })[]
  >([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departmentHeadId, setDepartmentHeadId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [teamLeadId, setTeamLeadId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [filtered, setFiltered] = useState<
    (Department & { teams: Team[]; employees: Employee[] })[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddTeam, setIsAddTeam] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  async function fetchDepartments() {
    const res = await fetch("/api/departments");
    const data = await res.json();
    setDepartments(data.reverse());
    setFiltered(data.reverse());
  }
  async function fetchEmployees() {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  }
  useEffect(() => {
    setLoading(true);
    fetchDepartments();
    fetchEmployees();
    setLoading(false);
  }, []);

  const onSearch = (searched: string) => {
    const text = searched.toLowerCase();
    setSearch(text);
    const filteredDepartments = departments.filter((department) =>
      department.name.toLowerCase().includes(text)
    );
    setFiltered(filteredDepartments);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name: departmentName,
      departmentHeadId: parseInt(departmentHeadId),
    };

    // Assuming you would send this data to an API endpoint
    const response = await fetch("/api/departments", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      toast.success("Department created successfully");
      fetchDepartments();
    } else {
      toast.error("Failed to create department");
    }
    handleCloseModal();
  };

  const addTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name: teamName,
      teamLeadId: parseInt(teamLeadId),
      departmentId: parseInt(departmentId),
    };

    // Assuming you would send this data to an API endpoint
    const response = await fetch("/api/teams", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      toast.success("Team created successfully");
      fetchDepartments();
    } else {
      toast.error("Failed to create team");
    }
    handleCloseModal();
  };
  return (
    <DashContainer>
      <Layout header="Departments" desc="Department Information">
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="w-full max-w-lg">
            <h2 className="text-dark dark:text-white text-xl font-semibold mb-4">
              Add Department
            </h2>
            <form onSubmit={handleSubmit}>
              <CustomInput
                htmlFor="departmentName"
                label="Department Name"
                id="departmentName"
                type="text"
                placeholder="Department Name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
              <EmployeeSelect
                htmlFor="departmentHead"
                label="Select Department Head"
                id="departmentHead"
                value={departmentHeadId}
                options={employees}
                onChange={(e) => setDepartmentHeadId(e.target.value)}
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
        <Modal isOpen={isAddTeam} onClose={() => setIsAddTeam(false)}>
          <div className="w-full max-w-lg">
            <h2 className="text-dark dark:text-white text-xl font-semibold mb-4">
              Add Team
            </h2>
            <form onSubmit={addTeam}>
              <CustomInput
                htmlFor="teamName"
                label="Team Name"
                id="teamName"
                type="text"
                placeholder="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <CustomSelect
                htmlFor="department"
                id="Select Department"
                label="Department"
                value={departmentId}
                options={departments}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
              />
              <EmployeeSelect
                htmlFor="teamLead"
                label="Select Team Lead"
                id="teamLead"
                value={teamLeadId}
                options={employees}
                onChange={(e) => setTeamLeadId(e.target.value)}
                required
              />

              <div className="flex justify-between mt-5 gap-5">
                <div className="w-full">
                  <Button
                    text="Cancel"
                    type="button"
                    outline
                    click={() => setIsAddTeam(false)}
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
          <div className="p-4">
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
                <Button
                  icon
                  text={"Create new department"}
                  click={handleOpenModal}
                />
                <button
                  onClick={() => setIsAddTeam(true)}
                  className="w-fit border mb-4 text-[#16151C] dark:text-white px-4 py-2 rounded-[5px] flex gap-2 items-center"
                >
                  <div className="border rounded-full h-5 w-5 flex items-center justify-center p-2">
                    <i className="fas fa-plus text-xs"></i>
                  </div>
                  <p>Create new team</p>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-dark dark:text-white">
              {filtered.map((department) => (
                <DepartmentContainer
                  department={department}
                  key={department.id}
                />
              ))}
            </div>
          </div>
        )}
      </Layout>
    </DashContainer>
  );
}

export default Page;
