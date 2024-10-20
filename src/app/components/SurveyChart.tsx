import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", value: 30 },
  { month: "Feb", value: 50 },
  { month: "Mar", value: 45 },
  { month: "Apr", value: 60 },
  { month: "May", value: 75 },
  { month: "Jun", value: 50 },
  { month: "Jul", value: 80 },
  { month: "Aug", value: 70 },
  { month: "Sep", value: 90 },
  { month: "Oct", value: 85 },
  { month: "Nov", value: 95 },
  { month: "Dec", value: 100 },
];

const SurveyChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#007BFF" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#007BFF" stopOpacity={0} />
          </linearGradient>
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
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#007BFF"
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SurveyChart;
