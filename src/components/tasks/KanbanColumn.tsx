import { Task, TaskStatus } from "@/types/database";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const statusColors: Record<TaskStatus, string> = {
  todo: "border-t-muted-foreground",
  in_progress: "border-t-primary",
  done: "border-t-success",
};

export function KanbanColumn({
  title,
  status,
  tasks,
  onUpdate,
  onDelete,
  onEdit,
}: KanbanColumnProps) {
  const columnTasks = tasks.filter((task) => task.status === status);

  return (
    <div className={cn("flex-1 min-w-[300px] bg-muted/30 rounded-lg border-t-4", statusColors[status])}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {columnTasks.length}
          </span>
        </div>
      </div>
      <div className="p-3 space-y-3 min-h-[200px]">
        {columnTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
        {columnTasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}
