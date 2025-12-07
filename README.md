🧠 Smart Task Planner
AI-Enhanced Productivity & Smart Task Management

🔗 Live Demo: https://smart-task-planner-prasad999999.vercel.app

🛠 Tech Stack: React • TypeScript • Vite • Supabase • ShadCN UI • Framer Motion

📌 Overview

Smart Task Planner is a modern and intelligent task management app that helps users stay organized and productive.
It includes authentication, smart task scoring, overdue detection, dashboard analytics, and a clean modern UI.

🚀 Features
🔐 Authentication (Supabase)

Email/password signup & login

Secure protected routes

Auto session restore

📝 Task Management

Create, update, delete tasks

Categories: Work / Personal / Study

Priority: High / Medium / Low

Status: todo → in_progress → done

Local timezone–safe due dates

Overdue detection

🧠 Smart Recommendation Engine

Each task gets a score based on:

Priority weight

Urgency

Deadline proximity

Overdue boost

👉 The app highlights the best task to work on next.

📊 Dashboard & Insights

Due today

Overdue

Completed vs pending

Weekly productivity chart

Recommended task

🎨 UI/UX Highlights

Built with ShadCN UI

Smooth animations with Framer Motion

Responsive and accessible

Clean gradient design system

🗄️ Database Schema (Supabase)
profiles
column	type	description
id	uuid	FK → auth.users
name	text	user full name
tasks
column	type	example
id	uuid	primary key
user_id	uuid	FK → profiles.id
title	text	"Finish project"
description	text	nullable
priority	text	"high"
category	text	"Work"
status	text	"todo"
due_date	date	"2025-01-15"
created_at	timestamp	now()
🛠️ Local Development
1️⃣ Clone the Repo
git clone https://github.com/prasad999999/SMART-TASK-PLANNER.git
cd SMART-TASK-PLANNER

2️⃣ Install Dependencies
npm install

3️⃣ Add Environment Variables

Create .env:

VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-anon-key

4️⃣ Start Dev Server
npm run dev


Visit:
👉 http://localhost:8080


👨‍💻 Author

Prasad Ghadge — Developer & Designer
