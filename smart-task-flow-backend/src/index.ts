import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import planRoutes from "./routes/plan.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", planRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
