# 🧠 Smart Task Planner  
A clean, modern task manager with smart recommendations and Supabase-powered backend.

🔗 **Live App:** https://smart-task-planner-prasad999999.vercel.app  
🛠 **Built With:** React · TypeScript · Vite · Supabase · ShadCN UI

---

## ⭐ Overview  
Smart Task Planner helps you stay organized and productive with:

- Simple task management  
- Smart scoring to recommend the next best task  
- Due date tracking with timezone safety  
- A visual dashboard showing weekly productivity  
- Beautiful, responsive UI  

---

## 🚀 Features

### 🔐 Authentication
- Email/password login & signup  
- Secure protected routes  
- Auto session restore  

### 📝 Task Management
- Create, edit, and delete tasks  
- Priorities: **High / Medium / Low**  
- Categories: **Work / Personal / Study**  
- Status workflow: **todo → in_progress → done**  
- Overdue detection  
- Local-timezone safe due dates  

### 🧠 Smart Task Engine
Each task receives a score based on:

- Priority weight  
- Deadline urgency  
- Overdue boost  

The app uses this score to show a **Recommended Task** with reasoning.

### 📊 Dashboard
- Tasks due today  
- Overdue tasks  
- Completed vs pending  
- 7-day productivity chart  

### 🎨 Modern UI
- ShadCN UI components  
- Framer Motion animations  
- Gradient theme  
- Fully responsive layout  

---

## 🛠 Local Development

### 1. Clone Repository
```sh
git clone https://github.com/prasad999999/SMART-TASK-PLANNER.git
cd SMART-TASK-PLANNER
```
### 2. Install Dependencies
```
npm install
```

3. Create .env
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Start Dev Server
```
npm run dev
```


App runs at:
👉 http://localhost:8080

👤 Author

Prasad Ghadge
Developer & Designer
