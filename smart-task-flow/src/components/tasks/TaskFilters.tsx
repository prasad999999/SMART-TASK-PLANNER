import { Filter, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TaskFilters as TaskFiltersType, TaskSortBy } from "@/types/task";

interface TaskFiltersProps {
  filters: TaskFiltersType;
  sortBy: TaskSortBy;
  sortOrder: "asc" | "desc";

  onFiltersChange: (filters: Partial<TaskFiltersType>) => void;
  onSortByChange: (sortBy: TaskSortBy) => void;
  onSortOrderChange: (order: "asc" | "desc") => void;
}

export function TaskFilters({
  filters,
  sortBy,
  sortOrder,
  onFiltersChange,
  onSortByChange,
  onSortOrderChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      
      {/* LABEL */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">Filters:</span>
      </div>

      {/* PRIORITY FILTER */}
      <Select
        value={filters.priority}
        onValueChange={(value) =>
          onFiltersChange({ priority: value as TaskFiltersType["priority"] })
        }
      >
        <SelectTrigger className="w-[130px] h-9">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Priorities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      {/* CATEGORY FILTER */}
      <Select
        value={filters.category}
        onValueChange={(value) =>
          onFiltersChange({ category: value as TaskFiltersType["category"] })
        }
      >
        <SelectTrigger className="w-[130px] h-9">
          <SelectValue placeholder="Category" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Categories</SelectItem>
          <SelectItem value="Work">Work</SelectItem>
          <SelectItem value="Personal">Personal</SelectItem>
          <SelectItem value="Study">Study</SelectItem>
        </SelectContent>
      </Select>

      {/* DEADLINE FILTER */}
      <Select
        value={filters.deadline}
        onValueChange={(value) =>
          onFiltersChange({ deadline: value as TaskFiltersType["deadline"] })
        }
      >
        <SelectTrigger className="w-[130px] h-9">
          <SelectValue placeholder="Deadline" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Dates</SelectItem>
          <SelectItem value="TODAY">Today</SelectItem>
          <SelectItem value="THIS_WEEK">This Week</SelectItem>
        </SelectContent>
      </Select>

      {/* DIVIDER */}
      <div className="h-6 w-px bg-border hidden sm:block" />

      {/* SORT FIELD */}
      <Select
        value={sortBy}
        onValueChange={(value) => onSortByChange(value as TaskSortBy)}
      >
        <SelectTrigger className="w-[130px] h-9">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="due_date">Due Date</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="created_at">Created</SelectItem>
        </SelectContent>
      </Select>

      {/* SORT ORDER BUTTON */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={() =>
          onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
        }
      >
        {sortOrder === "asc" ? (
          <SortAsc className="h-4 w-4" />
        ) : (
          <SortDesc className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
