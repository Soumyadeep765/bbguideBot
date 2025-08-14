# 📚 bbguideBot — Telegram Learning & Guide Bot
![preview](Blue%20And%20White%20Digital%20Background%20Gradient%20Jamboard%20Background.png)
A **Telegram learning bot** built for [Bots.Business](https://bots.business) that delivers **step-by-step lessons**, **quizzes**, and **final tests** — all fully manageable from an **in-bot admin panel**.

---

## ✨ Features

- **Interactive Lessons** — Create multi-step guides with text, media, and navigation.
- **Quizzes & Final Tests** — Engage users with tasks/tests and track scores.
- **One-Command Admin Setup** — `/setup` opens a menu to update lessons, tasks, metadata, and final tests.
- **Web Dashboard** — (`dashWeb/`) provides an optional browser-based interface via telegram Webapp.
- **Configurable Without Coding** — All content can be created and edited via the admin panel and google sheets.
- **Progress Tracking** — Users can resume lessons/tests from where they left off. Let them continue learning without worry about what they finished yesterday.

---

## 🚀 Getting Started

### 1. Import into Bots.Business
- Create a bot at [Bots.Business](https://bots.business)
- Import all files from this repository

### 2. Configure required things
- Open `@` command
- Add all configarations : 
  - Add your **Telegram ID's** as `ADMINS`, you can add multiple telegram ID's as bot admin (required)*
  - Add your google sheet id in `SHEET_ID` , if you don't know how to get [See it](https://knowsheets.com/how-to-get-the-id-of-a-google-sheet/) (required)*
  - Now add all pages ids as GID , update `TASK_GID`, `META_GID`, `FINAL_TASKS_GID` etc.

### 3. Run `/setup`
This opens the **Admin Panel** with buttons:
- **Update Lessons** → `/setupLesson`
- **Update Tasks** → `/setupTasks`
- **Update Bot Meta** → `/setupMeta`
- **Update Final Tests** → `/setupFinalTask`

From here, you can create and edit all lessons, quizzes, and metadata.

### 4. Update optinal fields 
In @ command you can upadate optinal thing's 
```js
//reward settings 
let reward_currency = "BP";
let reward_per_lesson = 45;
let reward_per_lesson_task = 55;
let reward_final_test = 150;
```
> Update as you need 🙂

---

## 🛠 Usage for Users
- `/start` → Begin the guide or resume progress
- Lessons & tests are delivered step-by-step
- Scores and progress are automatically saved

---

## 🌐 Status Web Dashboard
`dashWeb/` contains:
- `/webApi` → Webhoook command to serve data in dashboard web
- `index.html` → Website html codes containts here
- `index` → to render html and pass
Can be hosted via Bots.Business web app feature.

---

## 📜 License
MIT License — free to use and modify.
