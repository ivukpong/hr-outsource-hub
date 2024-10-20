// Dashboard.js
"use client";

import React, { useEffect, useState } from "react";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

import Layout from "../components/Layout";
import DashContainer from "../components/DashContainer";
import { User } from "@prisma/client";
import { CircularProgress } from "@mui/material";
import DepartmentChart from "../components/DepartmentChart";
import Schedule from "../components/Schedule";
import Announcements from "../components/Announcements";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<{
    totalEmployees: number;
    totalTeams: number;
    averageCheckInTime: string;
    totalDepartments: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    <div className="flex h-full w-full items-center justify-center text-primary">
      <CircularProgress color="inherit" />
    </div>;
  }

  useEffect(() => {
    const getUser = async () => {
      const data = localStorage.getItem("user");
      const temp = data ? JSON.parse(data) : null;
      setUser(temp);
    };
    getUser();
  }, []);

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good Morning!";
    } else if (currentHour < 18) {
      return "Good Afternoon!";
    } else {
      return "Good Evening!";
    }
  };

  return (
    <DashContainer>
      <Layout
        header={`Hello ${user?.name?.split(" ")[0]}👋`}
        desc={getGreeting()}
      >
        {loading ? (
          <div className="flex h-full w-full items-center justify-center text-primary">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 text-white lg:grid-cols-3">
            <div className="col-span-2">
              <div className="grid grid-cols-1 gap-4 text-white md:grid-cols-2 lg:grid-cols-3">
                <div className="p-5 flex h-[130px] flex-col justify-around bg-[#29AB91] rounded-lg md:h-[100px] lg:h-[130px] xl:h-[150px]">
                  <p className="text-sm">Total Contract Staff</p>
                  <h2 className="text-xl font-bold">{stats?.totalEmployees}</h2>
                  <div className="flex gap-2 items-center">
                    <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center bg-[#FFFFFF4D] ">
                      <FaArrowTrendUp />
                    </div>
                    <p className="text-xs font-light">+14% inc.</p>
                  </div>
                </div>
                <div className="p-5 flex h-[130px] flex-col justify-around bg-[#377DFF] rounded-lg md:h-[100px] lg:h-[130px] xl:h-[150px]">
                  <p className="text-sm">Total Departments</p>
                  <h2 className="text-xl font-bold">
                    {stats?.totalDepartments}
                  </h2>
                  <div className="flex gap-2 items-center">
                    <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center bg-[#FFFFFF4D] ">
                      <FaArrowTrendDown />
                    </div>
                    <p className="text-xs font-light">-10% dec.</p>
                  </div>
                </div>
                {/* <div className="p-5 flex h-[130px] flex-col justify-around bg-[#FFA600] rounded-lg md:h-[100px] lg:h-[130px] xl:h-[150px]">
                <p className="text-sm">Total Teams</p>
                <h2 className="text-xl font-bold">{stats?.totalTeams}</h2>
                <div className="flex gap-2 items-center">
                  <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center bg-[#FFFFFF4D] ">
                    <FaArrowTrendUp />
                  </div>
                  <p className="text-xs font-light">+2% inc.</p>
                </div>
              </div> */}
                <div className="p-5 flex h-[130px] flex-col justify-around bg-[#FF6441] rounded-lg md:h-[100px] lg:h-[130px] xl:h-[150px] mb-10">
                  <p className="text-sm">Average Check In Time</p>
                  <h2 className="text-xl font-bold">
                    {stats?.averageCheckInTime}
                  </h2>
                  <div className="flex gap-2 items-center">
                    <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center bg-[#FFFFFF4D] ">
                      <FaArrowTrendUp />
                    </div>
                    <p className="text-xs font-light">+36% inc.</p>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-center mb-10 pl-2">
                <h2 className="text-xl font-bold">
                  Onboarding Statistics Performace Chart
                </h2>
                <DepartmentChart />
              </div>
              <Announcements />
            </div>
            <Schedule />
          </div>
        )}
      </Layout>
    </DashContainer>
  );
};
export default Dashboard;
