import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Task } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Clock, AlertTriangle } from "lucide-react";
import { isPast, isToday, isTomorrow, addDays, isBefore } from "date-fns";

export default function Dashboard() {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const { projects } = useProjects();

  useKeyboardShortcuts([
    { key: "n", callback: () => setTaskDialogOpen(true), description: "New task" },
  ]);

  const upcomingTasks = tasks
    .filter((t) => {
      if (t.status === "done") return false;
      if (!t.due_date) return false;
      const dueDate = new Date(t.due_date);
      return isBefore(dueDate, addDays(new Date(), 7));
    })
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5);

  const overdueTasks = tasks.filter(
    (t) => t.due_date && isPast(new Date(t.due_date)) && t.status !== "done"
  );

  const handleCreateTask = async (taskData: Partial<Task>) => {
    await createTask(taskData as Parameters<typeof createTask>[0]);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Marvel Title Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="marvel-title text-4xl font-black">AVENGERS HQ</h1>
            <div className="marvel-divider"></div>
            <p className="text-muted-foreground text-sm mt-2">
              ⚡ Welcome back, Agent! Here's your mission overview. Status: ACTIVE
            </p>
          </div>
          <Button onClick={() => setTaskDialogOpen(true)} className="marvel-button gap-2">
            <Plus className="h-4 w-4" />
            NEW MISSION
          </Button>
        </div>

        <DashboardStats tasks={tasks} />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upcoming Missions */}
          <div className="marvel-card p-6">
            <div className="pb-4 border-b-2 border-yellow-500/30">
              <h2 className="marvel-title text-lg font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400 marvel-icon" />
                ⚠️ MISSION TIMELINE
              </h2>
            </div>
            <div className="space-y-3 pt-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    onEdit={handleEditTask}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">
                  🛡️ All missions on schedule
                </p>
              )}
            </div>
          </div>

          {/* Overdue Missions - CRITICAL ALERT */}
          <div className={`marvel-card p-6 ${overdueTasks.length > 0 ? "border-red-600 border-2" : ""}`}>
            <div className={`pb-4 ${overdueTasks.length > 0 ? "border-b-2 border-red-500 animate-pulse" : "border-b-2 border-yellow-500/30"}`}>
              <h2 className="marvel-title text-lg font-bold flex items-center gap-2">
                <AlertTriangle className={`h-5 w-5 ${overdueTasks.length > 0 ? "text-red-500 animate-spin" : "text-yellow-400"} marvel-icon`} />
                {overdueTasks.length > 0 ? "🚨 CRITICAL MISSIONS" : "✅ STATUS NORMAL"}
              </h2>
            </div>
            <div className="space-y-3 pt-4">
              {overdueTasks.length > 0 ? (
                overdueTasks.slice(0, 5).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    onEdit={handleEditTask}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8 text-green-500 font-bold">
                  ✅ All missions operational
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSubmit={handleCreateTask}
        projects={projects}
      />

      <TaskDialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onSubmit={handleUpdateTask}
        projects={projects}
        initialData={editingTask || undefined}
        mode="edit"
      />
    </MainLayout>
  );
}
