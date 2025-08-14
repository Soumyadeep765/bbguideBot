# 📚 bbguideBot — Telegram Learning & Guide Bot

![preview](Blue%20And%20White%20Digital%20Background%20Gradient%20Jamboard%20Background.png)

A **Telegram learning bot** built for [Bots.Business](https://bots.business) that delivers **step-by-step lessons**, **quizzes**, and **final tests** — all fully manageable from an **in-bot admin panel**.

Test our demo bot at **[@bbguiderBot](https://t.me/bbguiderBot)**

---

## ✨ Features

- **Interactive Lessons** — Multi-step guides with text, media, and navigation.
- **Quizzes & Final Tests** — Engage users with tasks/tests and track scores.
- **One-Command Admin Setup** — `/setup` opens a menu to update lessons, tasks, metadata, and final tests.
- **Web Dashboard** — (`dashWeb/`) provides an optional browser-based interface via Telegram WebApp.
- **No-Code Content Editing** — All lessons, quizzes, and bot metadata can be updated from the admin panel or Google Sheets.
- **Progress Tracking** — Users can resume lessons/tests exactly where they left off.

---

## 🚀 Getting Started

### 1. Import into Bots.Business
1. Create a bot at [Bots.Business](https://bots.business)
2. Import all files from this repository into your bot project.

### 2. Configure Required Settings
- Open the `@` command in your bot.
- Add:
  - **Telegram IDs** to `ADMINS` (multiple admins supported) *(required)*
  - **Google Sheet ID** in `SHEET_ID` — [How to get it](https://knowsheets.com/how-to-get-the-id-of-a-google-sheet/) *(required)*
  - Page GIDs (`TASK_GID`, `META_GID`, `FINAL_TASKS_GID`, etc.) for lessons, tasks, metadata, and tests.

### 3. Run `/setup`
Launches the **Admin Panel** with:
- **Update Lessons** → `/setupLesson`
- **Update Tasks** → `/setupTasks`
- **Update Bot Meta** → `/setupMeta`
- **Update Final Tests** → `/setupFinalTask`

From here, create and edit all content without touching the code.

### 4. Update Optional Fields
In the `@` command, adjust reward settings as needed:
```js
let reward_currency = "BP";
let reward_per_lesson = 45;
let reward_per_lesson_task = 55;
let reward_final_test = 150;
```

---

## 🛠 User Commands
- `/start` — Begin the guide or resume progress.
- `/help` — Display help and available commands.
- Lessons & tests are delivered step-by-step.
- Scores & progress are automatically saved.
- Final test becomes available after completing all lessons.
- WebApp shows user statistics & leaderboard.

---

## 🌐 Status Web Dashboard
`dashWeb/` includes:
- `/webApi` — Webhook command serving data for the dashboard.
- `index.html` — WebApp front-end.
- `index` — Renders HTML and passes data.

Host using Bots.Business WebApp features.

---

## 🧩 Tech Stack
1. **Bb Official Webhook Library** — API for serving leaderboard & stats.
2. **Bots.Business WebApp** — Displays user stats & global leaderboard.
3. **TopBoardLib** — Tracks global rankings.
4. **User & Bot Properties** — Store user and bot data.

---

## 📜 License
MIT License — free to use, modify, and distribute.
