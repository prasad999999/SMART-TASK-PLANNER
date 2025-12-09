import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateTaskPlan(goal: string) {
  const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  const model = gemini.getGenerativeModel({
    model: "models/gemini-2.5-flash"
  });

  const prompt = `
  You are an AI project planner. Break down the following goal into a structured task plan.

  📌 REQUIREMENTS:
  - Each task MUST include:
    - title
    - duration_days (integer)
    - depends_on (string or null)
    - start_date (YYYY-MM-DD)
    - end_date (YYYY-MM-DD)
  - Base the timeline on today's date: ${new Date().toISOString().split("T")[0]}
  - Respect dependencies: a task's start_date must be after end_date of its dependency.
  - Ensure the entire plan fits within the user's timeframe (if given, like "in 2 weeks").
  - Respond with RAW JSON ONLY. No explanations. No code blocks.

  📌 JSON FORMAT:
  {
    "tasks": [
      {
        "title": "string",
        "duration_days": number,
        "depends_on": "string | null",
        "start_date": "YYYY-MM-DD",
        "end_date": "YYYY-MM-DD"
      }
    ]
  }

  📌 GOAL:
  "${goal}"
  `;


  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // 🧹 Remove code fences if added
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      error: "Invalid JSON from AI",
      cleaned,
      original: text
    };
  }
}
