import { CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DepartmentChart = () => {
  const [chartData, setChartData] = useState<
    Array<{ month: string; employees: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch("/api/onboarding-stats");
        const data = await response.json();

        console.log(data);

        // Transform data to match the chart requirements
        const formattedData = data.map(
          (item: { month: string; count: number }) => ({
            month: item.month,
            employees: item.count,
          })
        );

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformanceData();
  }, []);

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: {
        month: string;
      };
    }>;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="custom-tooltip bg-white dark:bg-gray-800 border border-[#ccc] p-[10px] text-dark dark:text-white rounded-[10px]">
          <p className="label">{`Month: ${payload[0].payload.month}`}</p>
          <p className="desc">{`Employees: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return loading ? (
    <div className="flex h-full w-full items-center justify-center text-primary">
      <CircularProgress color="inherit" />
    </div>
  ) : (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={getRandomColor()} stopOpacity={0.7} />
            <stop offset="95%" stopColor={getRandomColor()} stopOpacity={0} />
          </linearGradient>
          {/* <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#007BFF" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#007BFF" stopOpacity={0} />
          </linearGradient> */}
        </defs>
        <XAxis
          dataKey="month"
          stroke="#bbb"
          tick={{ fill: "#666666", fontSize: 14, fontWeight: "bold" }}
        />
        <YAxis
          stroke="#bbb"
          tick={{ fill: "#666666", fontSize: 14, fontWeight: "bold" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="employees"
          stroke={getRandomColor()}
          fillOpacity={0.2}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
// Function to generate random color for the area fill
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default DepartmentChart;
