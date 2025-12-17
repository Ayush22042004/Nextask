import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { Task } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { cn } from "@/lib/utils";

export default function CalendarView() {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const { projects } = useProjects();

  const tasksOnSelectedDate = useMemo(() => {
    return tasks.filter(
      (task) => task.due_date && isSameDay(new Date(task.due_date), selectedDate)
    );
  }, [tasks, selectedDate]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      if (task.due_date) {
        const dateKey = format(new Date(task.due_date), "yyyy-MM-dd");
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)!.push(task);
      }
    });
    return map;
  }, [tasks]);

  const handleCreateTaskOnDate = () => {
    setTaskDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-muted-foreground text-sm mt-1">
              View tasks by due date
            </p>
          </div>
          <Button onClick={handleCreateTaskOnDate} className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Calendar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {format(currentMonth, "MMMM yyyy")}
                </h2>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="w-full"
                modifiers={{
                  hasTasks: (date) => {
                    const dateKey = format(date, "yyyy-MM-dd");
                    return tasksByDate.has(dateKey);
                  },
                }}
                modifiersClassNames={{
                  hasTasks: "bg-primary/20 font-semibold",
                }}
              />
            </CardContent>
          </Card>

          {/* Tasks for selected date */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">
                {format(selectedDate, "EEEE, MMMM d")}
              </h3>
              <div className="space-y-3">
                {tasksOnSelectedDate.length > 0 ? (
                  tasksOnSelectedDate.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "p-3 rounded-lg border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors",
                        task.status === "done" && "opacity-60"
                      )}
                      onClick={() => setEditingTask(task)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            task.status === "done" && "line-through"
                          )}
                        >
                          {task.title}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs shrink-0",
                            task.priority === "urgent" && "border-destructive text-destructive",
                            task.priority === "high" && "border-warning text-warning"
                          )}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      {task.project && (
                        <Badge
                          variant="outline"
                          className="mt-2 text-xs"
                          style={{
                            borderColor: task.project.color,
                            color: task.project.color,
                          }}
                        >
                          {task.project.name}
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No tasks due on this day</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCreateTaskOnDate}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Task
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSubmit={(data) => createTask({ ...data, due_date: selectedDate.toISOString() })}
        projects={projects}
        initialData={{ due_date: selectedDate.toISOString() }}
      />

      <TaskDialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onSubmit={(data) => editingTask && updateTask(editingTask.id, data)}
        projects={projects}
        initialData={editingTask || undefined}
        mode="edit"
      />
    </MainLayout>
  );
}
