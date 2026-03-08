import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TaskStatsProps
{
    stats:{
        total: number;
        completed: number;
        pending:  number;
    }
}
export default function TaskStats({ stats }: TaskStatsProps) {
  const chartData = [
    { name: "Completed", value: stats.completed },
    { name: "Pending", value: stats.pending },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl">
      <h3 className="text-xl font-bold text-white mb-6">
        Task Statistics
      </h3>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />

            <XAxis
              dataKey="name"
              stroke="#6b7280"
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              stroke="#6b7280"
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.name === "Completed"
                      ? "#22c55e"
                      : entry.name === "Pending"
                      ? "#f59e0b"
                      : "#ef4444"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}