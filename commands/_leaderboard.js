/*CMD
  command: /leaderboard
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// Retrieve leaderboard
let leaderboard = TopBoardLib.getBoard("reward");

// Inline keyboard: Back to Home
let inline_keyboard = [
  [{ text: "⬅️ Back to Home", callback_data: "/start" }]
];

let leaderboardText = "🚫 The leaderboard is currently empty.";

let currentUserReward = user_reward; 
let userId = user.telegramid;
let userInBoard = false;

if (leaderboard && leaderboard.length > 0) {
  leaderboardText = "🏆 <b>Top Rewards Leaderboard</b> 🏆\n\n";

  leaderboard.forEach((entry, index) => {
    // Prefer first_name, then username, then tgId
    let displayName = entry.first_name
      ? `<b>${entry.first_name}</b>`
      : (entry.username ? `@${entry.username}` : `User ${entry.tgId}`);

    // Append username if available and not already used
    if (entry.first_name && entry.username) {
      displayName += ` (@${entry.username})`;
    }

    leaderboardText += `${index + 1}. ${displayName} — <b>${entry.value}</b> points\n`;

    if (entry.tgId === userId) {
      userInBoard = true;
    }
  });

  leaderboardText += "\n" + (userInBoard
    ? `🎉 <b>Congrats!</b> You’re on the leaderboard with <b>${currentUserReward}</b> points!`
    : `💪 Keep going! You currently have <b>${currentUserReward}</b> points.`);
}

// Send the leaderboard with inline keyboard
Api.sendMessage({
  text: leaderboardText,
  parse_mode: "html",
  reply_markup: { inline_keyboard }
});
