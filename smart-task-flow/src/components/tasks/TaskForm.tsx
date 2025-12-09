import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { createTask, updateTask } from "@/lib/taskService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  task?: any;
  isEditing?: boolean;
}

export function TaskForm({ task, isEditing = false }: TaskFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority?.toUpperCase() || "MEDIUM");
  const [category, setCategory] = useState(task?.category || "Work");
  const [status, setStatus] = useState(task?.status?.toUpperCase() || "TODO");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.due_date ? new Date(task.due_date) : undefined
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }
  
    if (!dueDate) {
      toast({ title: "Error", description: "Please pick a due date", variant: "destructive" });
      return;
    }
  
    // Save LOCAL date correctly (no timezone shift)
    const localDateString = [
      dueDate.getFullYear(),
      String(dueDate.getMonth() + 1).padStart(2, "0"),
      String(dueDate.getDate()).padStart(2, "0")
    ].join("-");
  
    const payload = {
      title,
      description,
      priority,
      status,
      category,
      due_date: localDateString,   // <-- FIXED
    };
  
    if (isEditing && task) {
      await updateTask(task.id, payload);
      toast({ title: "Task updated" });
    } else {
      await createTask(user!.id, payload);
      toast({ title: "Task created" });
    }
  
    navigate("/tasks");
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* title */}
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      {/* description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
      </div>

      {/* priority + category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Work">Work</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Study">Study</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* status */}
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODO">To Do</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* due date */}
      <div className="space-y-2">
        <Label>Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("justify-start", !dueDate && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
          </PopoverContent>
        </Popover>
      </div>

      {/* actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="gradient" className="flex-1">
          {isEditing ? "Update Task" : "Create Task"}
        </Button>

        <Button type="button" variant="outline" onClick={() => navigate("/tasks")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
