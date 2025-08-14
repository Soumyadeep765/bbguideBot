/*CMD
  command: /start
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

// Prepare welcome or return message based on learning status
let inlineKeyboard;
let startText;

let user_started_learning = User.getProp("user_started_learning") || false;

if (user_started_learning && current_ongoing_lesson) {
  // For returning users
  startText =
    `👋 <b>Welcome back, Developer!</b>\n\n` +
    `You're doing great! Keep building and improving your skills with BJS.\n\n` +
    `💡 You can continue your lessons, check your achievements, or explore the global leaderboard to see where you stand among other bot creators.\n\n` +
    `Every command you write brings you closer to mastery. Let’s continue your learning!`;

  let webhookUrl = Libs.Webhooks.getUrlFor({
    command: "/webApi",
    user_id: user.id
  });

  const ACHIEVEMENT_WEB_APP_URL = WebApp.getUrl({
    command: "index",
    options: { webhookUrl }
  }); // Main entry point for web app

  inlineKeyboard = [
    [
      { text: "💪 Continue Learning", callback_data: "/startLesson" }
    ],
    [
      { text: "🏆 Explore Your Dash", web_app: { url: ACHIEVEMENT_WEB_APP_URL } }
    ],
    [
      { text: "⁉️ BB Help Docs", url: "https://help.bots.business/" },
      { text: "🌐 Bot Business", url: "https://app.bots.business/" }
    ]
  ];

} else {
  // For first-time users
  startText =
    `<b>Welcome to BB GuideBot!</b>\n\n` +
    `You're about to start an exciting journey into the world of Telegram bot development using <b>BJS (Bot JavaScript)</b> — a powerful scripting system made just for bots.\n\n` +
    `Whether you're a beginner or exploring automation, I'll guide you step by step with practical examples and interactive lessons.\n\n` +
    `📚 Ready to dive in? Tap the button below to get started!`;

  inlineKeyboard = [
    [
      { text: "🚀 Let's Start Learning", callback_data: "/startLesson" }
    ],
    [
      { text: "⁉️ BB Help Docs", url: "https://help.bots.business/" },
      { text: "🌐 Bot Business", url: "https://bots.business/" }
    ]
  ];
}

// Dynamically add final test button if user completed last lesson
let lesson_completed_with = User.getProp("lesson_completed_with");
if (lesson_completed_with && lesson_completed_with === getLastLessonId()) {
  inlineKeyboard.unshift([
    { text: "🎯 Give Final Test", callback_data: "/startFinalTest" }
  ]);
}

if (request?.data && request?.message?.message_id) {
  Api.editMessageText({
    text: startText,
    chat_id: chat.chatId,
    message_id: request.message.message_id,
    reply_markup: {
      inline_keyboard: inlineKeyboard
    },
    parse_mode: "html"
  });
  return;
}

// Send new message if not editing
Api.sendMessage({
  text: startText,
  parse_mode: "html",
  reply_markup: {
    inline_keyboard: inlineKeyboard
  }
});
