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
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch("/api/onboarding-stats");
        const data = await response.json();
        console.log(data);
        setChartData(data);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformanceData();
  }, []);

  return loading ? null : (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={getRandomColor()} stopOpacity={0.7} />
            <stop offset="95%" stopColor={getRandomColor()} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          stroke="#bbb"
          tick={{ fill: "#666666", fontSize: 14, fontWeight: "bold" }}
        />
        <YAxis
          stroke="#bbb"
          tick={{ fill: "#666666", fontSize: 14, fontWeight: "bold" }}
        />
        <Tooltip />
        {/* Dynamically add an Area for each department */}
        {chartData.length > 0 &&
          Object.keys(chartData[0])
            .filter((key) => key !== "name")
            .map((department) => (
              <Area
                key={department}
                type="monotone"
                dataKey={department}
                stroke={getRandomColor()} // Assign a color to each department
                fillOpacity={0.2}
                fill="url(#colorValue)"
              />
            ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Function to generate random color for each department line
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default DepartmentChart;
