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
        const response = await fetch("/api/departments-performance");
        const data = await response.json();
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
        <XAxis dataKey="name" />
        <YAxis />
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
                fill={getRandomColor()} // Use consistent color for the area fill
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
