import { Department, Employee, Team } from "@prisma/client";
import Link from "next/link";
import React from "react";

function DepartmentContainer({
  department,
}: {
  department: Department & { teams: Team[]; employees: Employee[] };
}) {
  const { name } = department;
  return (
    <div className="w-full mx-auto rounded-[5px] p-6 border-[#A2A1A833] border">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">{name} Department</h1>
        <Link
          href={`/dashboard/employees?department=${department.id}`}
          className="text-[#E04403]"
        >
          View All
        </Link>
      </div>
      <div className="flex justify-between items-center w-full">
        <p className="mb-4 text-grey">
          {department.teams.length} Team
          {department.teams.length === 1 ? "" : "s"}
        </p>
        <p className="mb-4 text-grey">
          {department.employees.length} Member
          {department.employees.length === 1 ? "" : "s"}
        </p>
      </div>
      <hr className="border-gray-700 mb-4" />
      <div className="space-y-4">
        {department.teams.length === 0 ? (
          <p>No teams present</p>
        ) : (
          department.teams.slice(0, 5).map((team: Team) => (
            <div className="flex items-center" key={team.id}>
              <div className="flex-1">
                <p className="text-dark dark:text-white">{team.name}</p>
                {/* <p className="text-grey">
                  {
                    department.teams.find(
                      (team: Team) => team.id === employee.teamId
                    ).name
                  }
                </p> */}
              </div>
              <i className="fas fa-chevron-right text-dark dark:text-white"></i>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DepartmentContainer;
