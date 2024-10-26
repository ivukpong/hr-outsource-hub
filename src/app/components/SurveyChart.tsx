import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SurveyChart = () => {
  const [surveyStats, setSurveyStats] = useState<
    Array<{ month: string; count: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveyStats = async () => {
      try {
        const response = await fetch("/api/surveys/count");
        const data = await response.json();

        // Transform data to match the chart requirements
        const formattedData = data.map(
          (item: { month: string; count: number }) => ({
            month: item.month,
            count: item.count,
          })
        );

        setSurveyStats(formattedData);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveyStats();
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
          <p className="desc">{`Surveys: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return loading ? null : (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={surveyStats}
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
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#007BFF"
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SurveyChart;
