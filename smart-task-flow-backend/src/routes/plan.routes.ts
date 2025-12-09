import { Router } from "express";
import { generatePlanController } from "../controllers/plan.controller";

const router = Router();

router.post("/generate-plan", generatePlanController);

export default router;
