# 📚 bbguideBot — Telegram Learning & Guide Bot

A **Telegram learning bot** built for [Bots.Business](https://bots.business) that delivers **step-by-step lessons**, **quizzes**, and **final tests** — all fully manageable from an **in-bot admin panel**.

---

## ✨ Features

- **Interactive Lessons** — Create multi-step guides with text, media, and navigation.
- **Quizzes & Final Tests** — Engage users with tasks/tests and track scores.
- **One-Command Admin Setup** — `/setup` opens a menu to update lessons, tasks, metadata, and final tests.
- **Web Dashboard** — (`dashWeb/`) provides an optional browser-based interface.
- **Configurable Without Coding** — All content can be created and edited via the admin panel.
- **Progress Tracking** — Users can resume lessons/tests from where they left off.

---

## 🚀 Getting Started

### 1. Import into Bots.Business
- Create a bot at [Bots.Business](https://bots.business)
- Import all files from this repository

### 2. Add Yourself as Admin
- Open `@` command
- Add all configarations : 
 - Add your **Telegram ID's** as `ADMINS`, you can add multiple telegram ID's as bot admin (required)*
 - Add your google sheet id in `SHEET_ID` , if you don't know how to get [See it](https://knowsheets.com/how-to-get-the-id-of-a-google-sheet/) (required)*

### 3. Run `/setup`
This opens the **Admin Panel** with buttons:
- **Update Lessons** → `/setupLesson`
- **Update Tasks** → `/setupTasks`
- **Update Bot Meta** → `/setupMeta`
- **Update Final Tests** → `/setupFinalTask`

From here, you can create and edit all lessons, quizzes, and metadata.

---

## 🛠 Usage for Users
- `/start` → Begin the guide or resume progress
- Lessons & tests are delivered step-by-step
- Scores and progress are automatically saved

---

## 🌐 Optional Web Dashboard
`dashWeb/` contains:
- `_webApi.js` → API endpoints
- `index.html.js` & `index.js` → Dashboard UI
Can be hosted via Bots.Business web app feature.

---

## 📜 License
MIT License — free to use and modify.
