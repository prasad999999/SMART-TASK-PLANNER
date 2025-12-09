import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import planRoutes from "./routes/plan.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.get("/api/ping", (req, res) => {
  res.json({ message: "Backend is running!" });
});


app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      error: "Malformed JSON. Expected format: { \"goal\": \"your goal here\" }"
    });
  }
  next();
});


app.use("/api", planRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
