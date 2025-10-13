/** @format */

import { EnhancedWorkout } from "../../types/enhanced-types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VolumeProgressChartProps {
  workouts: EnhancedWorkout[];
}

interface ChartDataPoint {
  date: string;
  volume: number;
  formattedDate: string;
}

export default function VolumeProgressChart({
  workouts,
}: VolumeProgressChartProps) {
  // Filter completed workouts with volume data
  const workoutsWithVolume = workouts.filter(
    (w) => w.completed_at && w.total_volume > 0
  );

  // If not enough data, show empty state
  if (workoutsWithVolume.length < 3) {
    return (
      <div className="border-2 border-white p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-mono font-bold mb-3">
          📈 Volume Progress
        </h3>
        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-600">
          <p className="text-gray-400 font-mono text-sm mb-2">
            Not enough data yet
          </p>
          <p className="text-gray-500 font-sans text-xs">
            Complete at least 3 workouts with weights to see your progress
          </p>
        </div>
      </div>
    );
  }

  // Aggregate data by date for the last 30 days
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  // Group workouts by date and sum volume
  const volumeByDate = new Map<string, number>();

  workoutsWithVolume
    .filter((w) => new Date(w.completed_at!) >= last30Days)
    .forEach((workout) => {
      const date = new Date(workout.completed_at!).toISOString().split("T")[0];
      const currentVolume = volumeByDate.get(date) || 0;
      volumeByDate.set(date, currentVolume + workout.total_volume);
    });

  // Create chart data array with all dates in range (including empty days)
  const chartData: ChartDataPoint[] = [];
  const today = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const volume = volumeByDate.get(dateStr) || 0;

    chartData.push({
      date: dateStr,
      volume: Math.round(volume),
      formattedDate: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    });
  }

  // Calculate stats
  const totalVolume = chartData.reduce((sum, d) => sum + d.volume, 0);
  const avgVolume = Math.round(totalVolume / chartData.filter((d) => d.volume > 0).length) || 0;
  const maxVolume = Math.max(...chartData.map((d) => d.volume));

  return (
    <div className="border-2 border-white p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-mono font-bold">
            📈 Volume Progress
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Last 30 days
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 font-mono">Avg per workout</p>
          <p className="text-xl md:text-2xl font-mono text-teal-400">
            {avgVolume > 0 ? `${(avgVolume / 1000).toFixed(1)}k` : "0"}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              vertical={false}
            />

            <XAxis
              dataKey="formattedDate"
              stroke="#9ca3af"
              style={{ fontSize: "10px", fontFamily: "monospace" }}
              tick={{ fill: "#9ca3af" }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />

            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: "10px", fontFamily: "monospace" }}
              tick={{ fill: "#9ca3af" }}
              tickLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                border: "2px solid #2dd4bf",
                borderRadius: "0",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#fff", marginBottom: "4px" }}
              itemStyle={{ color: "#2dd4bf" }}
              formatter={(value: number) => [
                `${(value / 1000).toFixed(1)}k kg`,
                "Volume",
              ]}
            />

            <Area
              type="monotone"
              dataKey="volume"
              stroke="#2dd4bf"
              strokeWidth={2}
              fill="url(#volumeGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#2dd4bf",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4 border-t-2 border-white pt-4">
        <div className="text-center">
          <p className="text-xs text-gray-400 font-mono mb-1">Total</p>
          <p className="text-base md:text-lg font-mono text-white">
            {(totalVolume / 1000).toFixed(0)}k
          </p>
          <p className="text-xs text-gray-500 font-sans">kg</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 font-mono mb-1">Peak Day</p>
          <p className="text-base md:text-lg font-mono text-teal-400">
            {(maxVolume / 1000).toFixed(1)}k
          </p>
          <p className="text-xs text-gray-500 font-sans">kg</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 font-mono mb-1">Workouts</p>
          <p className="text-base md:text-lg font-mono text-white">
            {chartData.filter((d) => d.volume > 0).length}
          </p>
          <p className="text-xs text-gray-500 font-sans">sessions</p>
        </div>
      </div>
    </div>
  );
}
