import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, TaskFilters, TaskSortBy, SortOrder } from "@/types/task";
import { getRecommendedTask, calculateTaskScore } from "@/utils/smartEngine";

interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
  sortBy: TaskSortBy;
  sortOrder: SortOrder;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  setSortBy: (sortBy: TaskSortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  getFilteredTasks: () => Task[];
  getRecommendedTask: () => Task | null;
  getTaskById: (id: string) => Task | undefined;
}

// Demo tasks for initial state
const demoTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Finish the quarterly project proposal and send it to the team for review.",
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    priority: "HIGH",
    category: "Work",
    isCompleted: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Study for certification exam",
    description: "Review chapters 5-8 of the study guide and complete practice tests.",
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    priority: "MEDIUM",
    category: "Study",
    isCompleted: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Grocery shopping",
    description: "Buy vegetables, fruits, and weekly essentials.",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    priority: "LOW",
    category: "Personal",
    isCompleted: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "Team meeting preparation",
    description: "Prepare slides and agenda for Monday's team sync meeting.",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "MEDIUM",
    category: "Work",
    isCompleted: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    title: "Exercise routine",
    description: "Complete 30-minute cardio and strength training session.",
    dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    priority: "LOW",
    category: "Personal",
    isCompleted: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    title: "Review research paper",
    description: "Read and annotate the latest research paper on machine learning.",
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    priority: "HIGH",
    category: "Study",
    isCompleted: false,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: demoTasks,
      filters: {
        priority: "ALL",
        category: "ALL",
        deadline: "ALL",
      },
      sortBy: "dueDate",
      sortOrder: "asc",

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      toggleComplete: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
          ),
        }));
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (sortOrder) => set({ sortOrder }),

      getFilteredTasks: () => {
        const { tasks, filters, sortBy, sortOrder } = get();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        let filtered = [...tasks];

        // Apply priority filter
        if (filters.priority !== "ALL") {
          filtered = filtered.filter((t) => t.priority === filters.priority);
        }

        // Apply category filter
        if (filters.category !== "ALL") {
          filtered = filtered.filter((t) => t.category === filters.category);
        }

        // Apply deadline filter
        if (filters.deadline === "TODAY") {
          const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
          filtered = filtered.filter((t) => {
            const due = new Date(t.dueDate);
            return due >= today && due < tomorrow;
          });
        } else if (filters.deadline === "THIS_WEEK") {
          filtered = filtered.filter((t) => {
            const due = new Date(t.dueDate);
            return due >= today && due < weekEnd;
          });
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0;

          if (sortBy === "dueDate") {
            comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          } else if (sortBy === "priority") {
            const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
            comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          } else if (sortBy === "createdAt") {
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }

          return sortOrder === "asc" ? comparison : -comparison;
        });

        return filtered;
      },

      getRecommendedTask: () => {
        const { tasks } = get();
        return getRecommendedTask(tasks);
      },

      getTaskById: (id) => {
        const { tasks } = get();
        return tasks.find((t) => t.id === id);
      },
    }),
    {
      name: "task-store",
    }
  )
);
