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
  <title> User Dashboard</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <style>
    body {
      background-color: #f8f9fa;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      padding: 16px;
    }
    .card {
      background-color: white;
      border-radius: 12px;
      border: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      margin-bottom: 16px;
      padding: 16px;
    }
    .point-badge {
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
    .leaderboard-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .leaderboard-item:last-child { border-bottom: none; }
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
    .rank-1 { background-color: #ffd700; color: #fff; }
    .rank-2 { background-color: #c0c0c0; color: #fff; }
    .rank-3 { background-color: #cd7f32; color: #fff; }
    .leaderboard-points {
      margin-left: auto;
      font-weight: 600;
      color: #0088cc;
    }
    /* Skeleton Loading */
    .skeleton {
      background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }
    @keyframes shimmer {
      100% { background-position: -200% 0; }
    }
    .skeleton-text { height: 14px; margin-bottom: 8px; }
    .skeleton-avatar { border-radius: 50%; width: 60px; height: 60px; }
    .user-avatar {
      width: 60px;
      height: 60px;
      object-fit: cover;
    }
    .error-message {
      color: #dc3545;
      padding: 10px;
      text-align: center;
      font-size: 14px;
    }
  </style>
</head>
<body>

  <div class="container">
    <!-- Profile Card -->
    <div class="card" id="profile_card">
      <div class="row align-items-center">
        <div class="col-auto">
          <div id="avatar_skel" class="skeleton skeleton-avatar"></div>
          <img id="avatar" src="" class="rounded-circle user-avatar d-none">
        </div>
        <div class="col">
          <div id="user_name_skel" class="skeleton skeleton-text w-50 mb-2"></div>
          <h5 id="user_name" class="mb-1 fw-bold d-none"></h5>
          <div class="d-flex align-items-center">
            <span class="point-badge me-2 d-none" id="xp_badge">
              <i class="fas fa-coins me-1"></i> <span id="user_xp">0</span> <span id="currency">BP</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Leaderboard Section -->
    <h6 class="section-title">Leaderboard</h6>
    <div class="card" id="leaderboard_card">
      <div id="leaderboard_list">
        <div class="skeleton skeleton-text w-100 mb-2"></div>
        <div class="skeleton skeleton-text w-100 mb-2"></div>
        <div class="skeleton skeleton-text w-100 mb-2"></div>
        <div class="skeleton skeleton-text w-100 mb-2"></div>
        <div class="skeleton skeleton-text w-100"></div>
      </div>
      <div id="error_message" class="error-message d-none"></div>
    </div>
  </div>

  <script>
    // Initialize Telegram WebApp
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    
    // API endpoint
    const API_URL = "<%options.webhookUrl%>"
    
    // Get user data from Telegram or use fallback
    const tgUser = Telegram.WebApp.initDataUnsafe?.user || {
      id: 6414701337,
      first_name: "Meown",
      username: "WantedGoku",
      photo_url: ""
    };

    // Fetch data from API
    async function fetchData() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
        showError("Failed to load data. Please try again later.");
        return null;
      }
    }

    function showError(message) {
      const errorElement = document.getElementById("error_message");
      errorElement.textContent = message;
      errorElement.classList.remove("d-none");
      document.getElementById("leaderboard_list").classList.add("d-none");
    }

    // Display user profile
    function displayProfile(balanceData) {
      const avatar = document.getElementById("avatar");
      const avatarSkel = document.getElementById("avatar_skel");
      const userName = document.getElementById("user_name");
      const userNameSkel = document.getElementById("user_name_skel");
      const xpBadge = document.getElementById("xp_badge");
      
      // Set user avatar
      if (tgUser.photo_url) {
        avatar.src = tgUser.photo_url;
      } else {
        // Fallback avatar with user initials
        const initials = tgUser.first_name ? tgUser.first_name.charAt(0) : 'U';
        avatar.src = `https://ui-avatars.com/api/?name=${initials}&background=0088cc&color=fff&size=60`;
      }
      
      avatarSkel.classList.add("d-none");
      avatar.classList.remove("d-none");
      
      // Set user name
      let fullName = tgUser.first_name || '';
      if (tgUser.last_name) {
        fullName += ' ' + tgUser.last_name;
      }
      if (!fullName.trim()) {
        fullName = tgUser.username ? `@${tgUser.username}` : `User ${tgUser.id}`;
      }
      
      userName.textContent = fullName;
      userNameSkel.classList.add("d-none");
      userName.classList.remove("d-none");
      
      // Set balance
      if (balanceData) {
        document.getElementById("user_xp").textContent = balanceData.value.toLocaleString();
        document.getElementById("currency").textContent = balanceData.currency;
        xpBadge.classList.remove("d-none");
      }
    }

    // Display leaderboard
    function displayLeaderboard(leaderboardData) {
      const leaderboardList = document.getElementById("leaderboard_list");
      leaderboardList.innerHTML = "";
      
      if (!leaderboardData || leaderboardData.length === 0) {
        showError("No leaderboard data available.");
        return;
      }
      
      leaderboardData.forEach((user, index) => {
        const rankClass = index < 3 ? `rank-${index + 1}` : '';
        
        // Determine display name with fallbacks
        let displayName = '';
        if (user.username) {
          displayName = `@${user.username}`;
        } else {
          displayName = user.first_name || '';
          if (user.last_name) {
            displayName += ' ' + user.last_name;
          }
          if (!displayName.trim()) {
            displayName = `User ${user.id || user.tgId}`;
          }
        }
        
        const item = document.createElement("div");
        item.className = "leaderboard-item";
        item.innerHTML = `
          <div class="rank ${rankClass}">${index + 1}</div>
          <div class="fw-bold text-truncate" style="max-width: 60%">${displayName}</div>
          <div class="leaderboard-points">${user.value.toLocaleString()} ${user.currency || 'BP'}</div>
        `;
        leaderboardList.appendChild(item);
      });
    }

    // Main function to load and display data
    async function loadData() {
      const data = await fetchData();
      if (data) {
        displayProfile({
          currency: data.currency,
          value: data.value
        });
        displayLeaderboard(data.leaderboard);
      }
    }

    // Start loading data
    loadData();
  </script>
</body>
</html>
