import { useMemo } from "react";
import { Task } from "@/types/database";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ListTodo,
  Target,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";

interface DashboardStatsProps {
  tasks: Task[];
}

export function DashboardStats({ tasks }: DashboardStatsProps) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const overdue = tasks.filter(
      (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== "done"
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, todo, overdue, completionRate };
  }, [tasks]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayStart = startOfDay(date);
      const completedOnDay = tasks.filter(
        (t) =>
          t.status === "done" &&
          t.updated_at &&
          format(new Date(t.updated_at), "yyyy-MM-dd") === format(dayStart, "yyyy-MM-dd")
      ).length;

      return {
        date: format(date, "EEE"),
        completed: completedOnDay,
      };
    });
    return last7Days;
  }, [tasks]);

  const pieData = [
    { name: "To Do", value: stats.todo, color: "hsl(var(--muted-foreground))" },
    { name: "In Progress", value: stats.inProgress, color: "hsl(var(--primary))" },
    { name: "Done", value: stats.completed, color: "hsl(var(--success))" },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Marvel Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="marvel-card p-4 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider">TOTAL AGENTS</p>
              <p className="text-3xl font-black text-yellow-300 mt-1">{stats.total}</p>
            </div>
            <ListTodo className="h-8 w-8 text-yellow-400/70 marvel-icon" />
          </div>
        </div>

        <div className="marvel-card p-4 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-400 font-bold uppercase tracking-wider">DEPLOYED</p>
              <p className="text-3xl font-black text-green-400 mt-1">{stats.completed}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-400/70" />
          </div>
        </div>

        <div className="marvel-card p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider">ACTIVE</p>
              <p className="text-3xl font-black text-yellow-400 mt-1">{stats.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400/70 marvel-icon" />
          </div>
        </div>

        <div className="marvel-card p-4 border-l-4 border-l-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">STATUS</p>
              <p className="text-3xl font-black mt-1 text-green-400">{stats.overdue}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-gray-400/70" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="marvel-card p-6">
          <div className="pb-4 border-b border-yellow-500/30">
            <h3 className="marvel-title font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              WEEKLY COMBAT REPORT
            </h3>
          </div>
          <div className="h-[200px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FDB913" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C41E3A" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(196, 30, 58, 0.2)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#FDB913" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#FDB913" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(20, 20, 40, 0.95)",
                    borderColor: "#C41E3A",
                    borderRadius: "8px",
                    border: "2px solid #FDB913",
                  }}
                  labelStyle={{ color: "#FDB913" }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#FDB913"
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="marvel-card p-6">
          <div className="pb-4 border-b border-yellow-500/30">
            <h3 className="marvel-title font-bold flex items-center gap-2">
              <Target className="h-4 w-4 text-yellow-400" />
              TEAM ROSTER
            </h3>
          </div>
          <div className="h-[200px] flex items-center justify-center pt-4">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(20, 20, 40, 0.95)",
                      borderColor: "#C41E3A",
                      borderRadius: "8px",
                      border: "2px solid #FDB913",
                    }}
                    labelStyle={{ color: "#FDB913" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-yellow-400/50 text-sm font-bold">Awaiting deployment</p>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs text-yellow-300 font-bold">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
