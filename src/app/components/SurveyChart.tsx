import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Define the structure for survey statistics
interface SurveyStat {
  category: string;
  count: number;
}

const SurveyChart: React.FC = () => {
  const [surveyStats, setSurveyStats] = useState<SurveyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveyStats = async () => {
      try {
        const response = await fetch("/api/surveys/count");
        const data = await response.json();

        console.log(data);

        // Transform data to match the chart requirements
        const formattedData: SurveyStat[] = data.surveysByCategory.map(
          (item: { category: string; count: number }) => ({
            category: item.category,
            count: item.count,
          })
        );

        setSurveyStats(formattedData);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyStats();
  }, []);

  // Check if there's no data to display
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-primary">
        <CircularProgress color="inherit" />
      </div>
    );
  }

  if (surveyStats.length === 0) {
    return <div>No survey data available</div>;
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: {
        category: string;
      };
    }>;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="custom-tooltip bg-white dark:bg-gray-800 border border-[#ccc] p-[10px] text-dark dark:text-white rounded-[10px]">
          <p className="label">{`Category: ${payload[0].payload.category}`}</p>
          <p className="desc">{`Surveys: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  return (
    <div>
      {/* <h2>Survey Statistics</h2> */}
      {/* Bar Chart */}
      {/* <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={surveyStats}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="category"
            stroke="#bbb"
            tick={{ fill: "#666666", fontSize: 14, fontWeight: "bold" }}
            interval={0} // Ensures all ticks are displayed
          />
          <YAxis
            stroke="#bbb"
            tick={{ fill: "#666666", fontSize: 14, fontWeight: "bold" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#007BFF" />
        </BarChart>
      </ResponsiveContainer> */}

      <h2>Survey Distribution by Category</h2>
      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={surveyStats}
            dataKey="count"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({ name }) => name} // Display category names as labels
          >
            {surveyStats.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`#${(((1 << 24) * Math.random()) | 0).toString(16)}`}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SurveyChart;
