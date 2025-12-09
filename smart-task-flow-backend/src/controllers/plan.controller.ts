import { Request, Response } from "express";
import { generateTaskPlan } from "../services/ai.service";

export async function generatePlanController(req: Request, res: Response) {
  try {
    const { goal } = req.body;

    if (!goal) {
      return res.status(400).json({ error: "Goal is required" });
    }

    const plan = await generateTaskPlan(goal);
    return res.json(plan);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
