import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { KanbanColumn } from "@/components/tasks/KanbanColumn";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Task } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Board() {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const { projects } = useProjects();

  useKeyboardShortcuts([
    { key: "n", callback: () => setTaskDialogOpen(true), description: "New task" },
  ]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6 animate-fade-in h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Kanban Board</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Drag and organize your tasks
            </p>
          </div>
          <Button onClick={() => setTaskDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          <KanbanColumn
            title="To Do"
            status="todo"
            tasks={tasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onEdit={handleEditTask}
          />
          <KanbanColumn
            title="In Progress"
            status="in_progress"
            tasks={tasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onEdit={handleEditTask}
          />
          <KanbanColumn
            title="Done"
            status="done"
            tasks={tasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onEdit={handleEditTask}
          />
        </div>
      </div>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSubmit={createTask}
        projects={projects}
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
