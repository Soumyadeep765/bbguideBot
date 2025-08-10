/*CMD
  command: index.html
  help: 
  need_reply: false
  auto_retry_time: 
  folder: dashWeb

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Learning Dashboard</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <style>
    body {
      background-color: #f8f9fa;
      color: #212529;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    
    .card {
      background-color: white;
      border-radius: 12px;
      border: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      margin-bottom: 16px;
    }
    
    .progress-bar {
      background-color: #0088cc;
      height: 8px;
      border-radius: 4px;
    }
    
    .achievement-badge {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    
    .badge-blue {
      background-color: rgba(0, 136, 204, 0.1);
      color: #0088cc;
    }
    
    .badge-green {
      background-color: rgba(92, 184, 92, 0.1);
      color: #5cb85c;
    }
    
    .badge-orange {
      background-color: rgba(240, 173, 78, 0.1);
      color: #f0ad4e;
    }
    
    .xp-badge {
      background-color: rgba(0, 136, 204, 0.1);
      color: #0088cc;
      border-radius: 20px;
      padding: 4px 10px;
      font-size: 12px;
    }
    
    .section-title {
      font-weight: 600;
      margin-bottom: 12px;
      color: #333;
    }
    
    .text-muted {
      color: #6c757d !important;
    }
    
    .leaderboard-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    
    .leaderboard-item:last-child {
      border-bottom: none;
    }
    
    .rank {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #f1f1f1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .rank-1 {
      background-color: #ffd700;
      color: #fff;
    }
    
    .rank-2 {
      background-color: #c0c0c0;
      color: #fff;
    }
    
    .rank-3 {
      background-color: #cd7f32;
      color: #fff;
    }
    
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 10px;
    }
    
    .leaderboard-xp {
      margin-left: auto;
      font-weight: 600;
      color: #0088cc;
    }
  </style>
</head>
<body class="p-3">

  <div class="container">
    <!-- Profile Card -->
    <div class="card p-3">
      <div class="row align-items-center">
        <div class="col-auto">
          <img id="avatar" src="" class="rounded-circle" width="60" height="60">
        </div>
        <div class="col">
          <h5 class="mb-1 fw-bold" id="user_name">User</h5>
          <div class="d-flex align-items-center">
            <span class="xp-badge me-2">
              <i class="fas fa-bolt me-1"></i> <span id="user_xp">0</span> XP
            </span>
            <small class="text-muted">@<span id="user_username">username</span></small>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Section -->
    <div class="card p-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="mb-0 fw-bold">Course Progress</h6>
        <small class="text-muted"><span id="lessons_completed">0</span>/<span id="lessons_total">0</span> lessons</small>
      </div>
      <div class="progress mb-2" style="height: 8px;">
        <div class="progress-bar" id="progress_bar" role="progressbar" style="width: 0%"></div>
      </div>
      <small class="text-muted"><span id="progress_percent">0</span>% complete</small>
    </div>


    <!-- Achievements Section -->
    <h6 class="section-title">Achievements</h6>
    <div class="row g-2 mb-3" id="achievements_list"></div>

    <!-- Completed Lessons -->
    <h6 class="section-title">Completed Lessons</h6>
    <div class="list-group" id="completed_lessons"></div>
  </div>
  
  
      <!-- Leaderboard Section -->
    <h6 class="section-title">Global Leaderboard</h6>
    <div class="card p-3">
      <div id="leaderboard_list"></div>
    </div>

  <script>
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();

    const tgUser = Telegram.WebApp.initDataUnsafe?.user || {
      id: 123456789,
      first_name: "Alex",
      last_name: "",
      username: "alex_user",
      photo_url: "https://t.me/i/userpic/320/example.jpg"
    };

    // Set user info
    document.getElementById("user_name").textContent = tgUser.first_name;
    document.getElementById("user_username").textContent = tgUser.username || "username";
    document.getElementById("avatar").src = tgUser.photo_url || "https://via.placeholder.com/60";

    // Demo data
    const data = {
      progress: {
        lessonsCompleted: 4,
        totalLessons: 10,
        xp: 1250
      },
      leaderboard: [
        { id: 1, name: "Emma", username: "emma_winner", xp: 9850, photo: "https://randomuser.me/api/portraits/women/44.jpg" },
        { id: 2, name: "James", username: "james_pro", xp: 8720, photo: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 3, name: "Sophia", username: "sophia_coder", xp: 7650, photo: "https://randomuser.me/api/portraits/women/65.jpg" }
      ],
      achievements: [
        { 
          title: "First Steps", 
          desc: "Completed 1st lesson", 
          icon: "fas fa-star",
          color: "badge-orange",
          xp: 100
        },
        { 
          title: "Quick Learner", 
          desc: "3 lessons in one day", 
          icon: "fas fa-bolt",
          color: "badge-green",
          xp: 250
        },
        { 
          title: "Halfway", 
          desc: "50% course complete", 
          icon: "fas fa-check-circle",
          color: "badge-blue",
          xp: 500
        }
      ],
      completedLessons: [
        { title: "Getting Started", xp: 100, date: "Jun 12" },
        { title: "Variables", xp: 150, date: "Jun 14" },
        { title: "Conditionals", xp: 200, date: "Jun 15" },
        { title: "Loops", xp: 250, date: "Jun 16" }
      ]
    };

    // Progress
    const { lessonsCompleted, totalLessons, xp } = data.progress;
    const progressPercent = Math.round((lessonsCompleted / totalLessons) * 100);
    document.getElementById("lessons_completed").textContent = lessonsCompleted;
    document.getElementById("lessons_total").textContent = totalLessons;
    document.getElementById("progress_percent").textContent = progressPercent;
    document.getElementById("progress_bar").style.width = progressPercent + "%";
    document.getElementById("user_xp").textContent = xp.toLocaleString();

    // Leaderboard
    const leaderboardList = document.getElementById("leaderboard_list");
    data.leaderboard.forEach((user, index) => {
      const rankClass = index < 3 ? `rank-${index + 1}` : '';
      const item = document.createElement("div");
      item.className = "leaderboard-item";
      item.innerHTML = `
        <div class="rank ${rankClass}">${index + 1}</div>
        <img src="${user.photo}" class="user-avatar" alt="${user.name}">
        <div class="flex-grow-1">
          <div class="fw-bold">${user.name}</div>
          <small class="text-muted">@${user.username}</small>
        </div>
        <div class="leaderboard-xp">${user.xp.toLocaleString()} XP</div>
      `;
      leaderboardList.appendChild(item);
    });

    // Achievements
    const achievementsList = document.getElementById("achievements_list");
    data.achievements.forEach(ach => {
      const col = document.createElement("div");
      col.className = "col-12";
      col.innerHTML = `
        <div class="card p-3">
          <div class="d-flex align-items-center">
            <div class="achievement-badge ${ach.color} me-3">
              <i class="${ach.icon}"></i>
            </div>
            <div class="flex-grow-1">
              <h6 class="mb-1 fw-bold">${ach.title}</h6>
              <p class="mb-1 small text-muted">${ach.desc}</p>
            </div>
            <span class="xp-badge">+${ach.xp} XP</span>
          </div>
        </div>`;
      achievementsList.appendChild(col);
    });

    // Completed Lessons
    const completedLessons = document.getElementById("completed_lessons");
    data.completedLessons.forEach(lesson => {
      const li = document.createElement("div");
      li.className = "card p-3 mb-2";
      li.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-0 fw-bold">${lesson.title}</h6>
            <small class="text-muted">${lesson.date}</small>
          </div>
          <span class="xp-badge">+${lesson.xp} XP</span>
        </div>`;
      completedLessons.appendChild(li);
    });
  </script>
</body>
</html>
