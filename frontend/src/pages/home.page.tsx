import React from 'react';
import { CheckCircle2, Clock, BarChart3, TrendingUp } from 'lucide-react';
import { useGetStatistics } from '../hook/tasks/task.get.statistics.hook';
import TaskStats from '../components/task.stats.chart';

interface Statistics
{
  total: number;
  completed: number;
  pending: number;
}
const HomePage: React.FC = () => {
  const {data,isLoading} = useGetStatistics();
  const {total,completed,pending}: Statistics = data;
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Track your productivity and task distribution.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Tasks" value={total} icon={<BarChart3 className="text-blue-500" />}  />
        <StatCard title="Completed" value={completed} icon={<CheckCircle2 className="text-emerald-500" />}  />
        <StatCard title="Pending" value={pending} icon={<Clock className="text-amber-500" />} />
      </div>

      {/* Analytics Chart */}
     <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl">
  <div className="flex justify-between items-center mb-8">
    <h3 className="text-xl font-bold text-white flex items-center gap-2">
      <TrendingUp className="text-blue-500" size={20} />
      Task Statistics
    </h3>
  </div>

   <TaskStats stats={{total,completed,pending}} />
</div>
    </div>
  );
};

const StatCard = ({ title, value, icon}: any) => (
  <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl hover:border-gray-700 transition group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-800 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
    </div>
    <p className="text-gray-400 text-sm font-medium">{title}</p>
    <h2 className="text-4xl font-bold text-white mt-1">{value}</h2>
  </div>
);

export default HomePage;