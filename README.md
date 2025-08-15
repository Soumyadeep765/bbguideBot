# 📚 bbguideBot — Telegram Learning & Guide Bot

![preview](Blue%20And%20White%20Digital%20Background%20Gradient%20Jamboard%20Background.png)

A **Telegram learning bot** built for [Bots.Business](https://bots.business) that delivers **step-by-step lessons**, **quizzes**, and **final tests** — all fully manageable from an **in-bot admin panel**.

> 🎯 **Try the Demo:** [@bbguiderBot](https://t.me/bbguiderBot)

---

## ✨ Features

- **📖 Interactive Lessons** — Multi-step guides with text, media, and inline navigation buttons.
- **📝 Quizzes & Final Tests** — Challenge users, check answers, and give instant feedback.
- **⚡ One-Command Admin Setup** — `/setup` instantly opens the full admin menu.
- **🌐 Web Dashboard** — (`dashWeb/`) Telegram WebApp for user stats & leaderboard.
- **🛠 No-Code Content Editing** — Update from in-bot panel or Google Sheets.
- **📍 Progress Tracking** — Resume exactly where the user left off.
- **🏆 Reward System** — Award points/currency for completing lessons & tests.

---

## 🗺 Learning Flow

1. `/start` → **Continue learning** *(inline button)*
2. Select **lesson** → Click **Learn How**
3. Navigate with **Next** until the last step → **Finish**
4. Start the **lesson quiz** → Earn rewards based on score
5. Repeat for all lessons → Unlock **final test**
6. Complete final test → **Earn final reward**

> 💡 Tip: Complete all lessons & quizzes to unlock the final challenge.

---

## 🚀 Getting Started

### 1️⃣ Import into Bots.Business
1. Create a bot at [Bots.Business](https://bots.business)
2. Import all files from this repository.

### 2️⃣ Configure Required Settings
In the `@` command:
- Add your **Telegram Admin IDs** → `ADMINS`
- Add your **Google Sheet ID** → `SHEET_ID` ([How to get it](https://knowsheets.com/how-to-get-the-id-of-a-google-sheet/))
- Add **Page GIDs** → `TASK_GID`, `META_GID`, `FINAL_TASKS_GID`, etc.

### 3️⃣ Run `/setup`
Opens the Admin Panel with:
- **📚 Lessons** — `/setupLesson`
- **📝 Quizzes** — `/setupTasks`
- **ℹ️ Meta Data** — `/setupMeta`
- **🏁 Final Tests** — `/setupFinalTask`

### 4️⃣ Configure Rewards *(optional)*
```js
let reward_currency = "BP";
let reward_per_lesson = 45;
let reward_per_lesson_task = 55;
let reward_final_test = 150;
```

---

## 🛠 User Commands

| Command   | Description |
|-----------|-------------|
| `/start`  | Begin or resume lessons |
| `/help`   | Show help and features |
| Lessons   | Delivered step-by-step |
| Tests     | Auto-score & reward |
| Leaderboard | View global ranks |

---

## 📦 Data Structures

### 🗂 Bot Meta
```json
{
  "version": 1,
  "template_version": 1,
  "lang": "en",
  "updated_at": "15.07.2025"
}
```

### 📚 Lesson
```json
{
  "id": "L2",
  "name": "Make /start command",
  "description": "",
  "steps": [
    {
      "step": "1",
      "text": "Open your Bot and make command with name /start",
      "photo": "",
      "video": "",
      "help": "https://help.bots.business/commands",
      "extra": null
    },
    ...
  ]
}
```

### 📝 Quiz
```json
[
  {
    "id": 1,
    "lesson_id": "L1",
    "question": "What it is - bot token?",
    "answers": [
      "It is public word. I need to share it BB Chat",
      "It is basd word from @botMother",
      "It is secure not publick token created in @BotFather",
      "It is something from AI"
    ],
    "correct_index": 3
  },
  ...
]
```

### 🏁 Final Test
```json
[
  {
    "id": "1",
    "question": "When creating a new bot using @BotFather, what must the username always end with?",
    "options": ["_bb", "bot", "telegram", "_botfather"],
    "correctIndex": 2
  },
  ...
]
```

---

## 🌐 Dashboard Preview
The **dashWeb/** folder contains:
- `/webApi` — API for WebApp data
- `index.html` — Leaderboard UI
- `index` — HTML render function

> Example Preview  
![Dashboard Preview](dashWeb.jpeg)

---

## 🧩 Tech Stack

- **Bb Official Webhook Library** — Leaderboard & stats API  
- **Bots.Business WebApp** — Interactive Web Dashboard  
- **TopBoardLib** — Global rank tracking  
- **Google Sheets** — Centralized lesson & quiz storage  
- **User/Bot Properties** — State & progress storage  

---

## 📜 License
MIT License — Free to use, modify, and distribute.

---
