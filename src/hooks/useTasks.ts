import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Task, TaskStatus, TaskPriority } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*, project:projects(*)")
        .eq("user_id", user.id)
        .is("parent_task_id", null)
        .order("position", { ascending: true });

      if (error) throw error;
      setTasks((data || []) as Task[]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error fetching tasks",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const createTask = async (taskData: {
    title: string;
    description?: string;
    project_id?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string;
    parent_task_id?: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...taskData,
          user_id: user.id,
        })
        .select("*, project:projects(*)")
        .single();

      if (error) throw error;
      
      if (!taskData.parent_task_id) {
        setTasks((prev) => [...prev, data as Task]);
      }
      
      toast({ title: "Task created" });
      return data as Task;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error creating task",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select("*, project:projects(*)")
        .single();

      if (error) throw error;
      
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? (data as Task) : task))
      );
      
      return data as Task;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error updating task",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
      
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast({ title: "Task deleted" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error deleting task",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
