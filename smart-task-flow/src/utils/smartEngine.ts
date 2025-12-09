import { subDays, setHours, setMinutes, isSameDay } from "date-fns";
import { Task } from "@/types/task";

/* ---------------------------------------------
PRIORITY WEIGHTS
--------------------------------------------- */
const PRIORITY_WEIGHTS = {
  high: 3,
  medium: 2,
  low: 1,
};

function getLocalDate(dateString: string) {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d); // Pure local date (no timezone shift)
}

function getDeadline(dateString: string) {
  const localDate = getLocalDate(dateString);
  const prevDay = subDays(localDate, 1);
  return setMinutes(setHours(prevDay, 23), 59); // deadline = prev day 11:59 PM
}
/* ---------------------------------------------
   CALCULATE SCORE FOR RECOMMENDATION
--------------------------------------------- */
export function calculateTaskScore(task: Task): number {
  if (task.status === "done") return 0;

  let score = PRIORITY_WEIGHTS[task.priority];

  const now = new Date();
  const deadline = getDeadline(task.due_date);

  const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursLeft < 0) score += 5;        // overdue
  else if (hoursLeft < 24) score += 3;  // due today
  else if (hoursLeft < 72) score += 2;  // within 3 days
  else if (hoursLeft < 168) score += 1; // within a week

  return score;
}

export function getTaskScoreBreakdown(task: Task) {
  if (task.status === "done") {
    return {
      score: 0,
      priorityWeight: 0,
      urgencyWeight: 0,
      urgencyReason: "Task already completed",
    };
  }

  const priorityWeight = PRIORITY_WEIGHTS[task.priority];

  const now = new Date();
  const deadline = getDeadline(task.due_date);
  const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

  let urgencyWeight = 0;
  let urgencyReason = "Not urgent";

  if (hoursLeft < 0) {
    urgencyWeight = 5;
    urgencyReason = "Overdue";
  } else if (hoursLeft < 24) {
    urgencyWeight = 3;
    urgencyReason = "Due today";
  } else if (hoursLeft < 72) {
    urgencyWeight = 2;
    urgencyReason = "Due in 1–3 days";
  } else if (hoursLeft < 168) {
    urgencyWeight = 1;
    urgencyReason = "Due this week";
  }

  return {
    score: priorityWeight + urgencyWeight,
    priorityWeight,
    urgencyWeight,
    urgencyReason,
  };
}


/* ---------------------------------------------
   GET BEST RECOMMENDED TASK
--------------------------------------------- */
export function getRecommendedTask(tasks: Task[]): Task | null {
  const pending = tasks.filter((t) => t.status !== "done");
  if (pending.length === 0) return null;

  return pending
    .sort((a, b) => {
      const scoreDiff = calculateTaskScore(b) - calculateTaskScore(a);
      if (scoreDiff !== 0) return scoreDiff;

      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })[0];
}

/* ---------------------------------------------
   EXPLAIN WHY TASK IS RECOMMENDED
--------------------------------------------- */
export function getRecommendationReason(task: Task): string {
  const reasons: string[] = [];

  const now = new Date();
  const due = new Date(task.due_date);
  const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursLeft < 0) reasons.push("This task is overdue!");
  else if (hoursLeft < 24) reasons.push("Due within 24 hours");
  else if (hoursLeft < 72) reasons.push("Due within 3 days");

  if (task.priority === "high") reasons.push("High priority");
  else if (task.priority === "medium") reasons.push("Medium priority");

  return reasons.length ? reasons.join(" • ") : "This task is important and upcoming.";
}

/* ---------------------------------------------
   DASHBOARD STATS
--------------------------------------------- */



export function getTaskStats(tasks: Task[]) {
  const now = new Date();

  let total = tasks.length;
  let completed = 0;
  let pending = 0;
  let dueToday = 0;
  let overdue = 0;

  for (const t of tasks) {
    if (t.status === "done") {
      completed++;
      continue;
    }

    pending++;

    if (!t.due_date) continue;

    const deadline = getDeadline(t.due_date);

    if (deadline < now) {
      overdue++;
    } else if (isSameDay(deadline, now)) {
      dueToday++;
    }
  }

  return {
    total,
    completed,
    pending,
    dueToday,
    overdue,
  };
}






/* ---------------------------------------------
   PRODUCTIVITY CHART — LAST 7 DAYS
--------------------------------------------- */
export function getProductivityData(tasks: Task[]) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  return last7Days.map((date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const end = new Date(start.getTime() + 86400000);

    const created = tasks.filter((t) => {
      const createdAt = new Date(t.created_at);
      return createdAt >= start && createdAt < end;
    }).length;

    // We don’t store completion date — so we simulate using createdAt
    const completed = tasks.filter((t) => {
      if (t.status !== "done") return false;
      const fakeCompletionDate = new Date(t.created_at);
      return fakeCompletionDate >= start && fakeCompletionDate < end;
    }).length;

    return {
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      created,
      completed,
    };
  });
}
