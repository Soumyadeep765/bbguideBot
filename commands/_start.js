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

// used @ command to store commonly used variables like user_started_learning, current_ongoing_lesson etc..

// Prepare welcome or return message based on learning status
let inlineKeyboard;
let startText;

if (user_started_learning && current_ongoing_lesson) {
    // For returning users , those who already started learning 
  startText = `👋 <b>Welcome back, Developer!</b>\n\nYou're doing great! Keep building and improving your skills with BJS.\n\n💡 You can continue your lessons, check your achievements, or explore the global leaderboard to see where you stand among other bot creators.\n\nEvery command you write brings you closer to mastery. Let’s continue your learning!`;
  
const ACHIEVEMENT_WEB_APP_URL = WebApp.getUrl({ command: "index" }); // Main entry point for web app

  inlineKeyboard = [
    [
      { text: "💪 Continue Learning", callback_data: "/startLesson" }
    ],
    [
      { text: "🏆Explore Your Dash", web_app: { url: ACHIEVEMENT_WEB_APP_URL } }
    ],
    [
      { text: "⁉️ BB Help Docs", url: "https://help.bots.business/" },
      { text: "🌐 Bot Business", url: "https://app.bots.business/" }
    ]
  ];
  
} else {
// For first-time users or haven't started any lesson 
  startText = `<b>Welcome to BB GuideBot!</b>\n\nYou're about to start an exciting journey into the world of Telegram bot development using <b>BJS (Bot JavaScript)</b> — a powerful scripting system made just for bots.\n\nWhether you're a beginner or exploring automation, I'll guide you step by step with practical examples and interactive lessons.\n\n📚 Ready to dive in? Tap the button below to get started!`;

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
if(request?.data && request?.message?.message_id){
 // Bot.inspect(request.message)
  
  Api.editMessageText({
    text: startText,
    chat_id: chat.chatId,
    message_id: request.message.message_id,
    reply_markup: {
    inline_keyboard: inlineKeyboard
  },
  parse_mode: "html"
  })
  return;
}
// Send the interactive welcome message
Api.sendMessage({
  text: startText,
  parse_mode: "html",
  reply_markup: {
    inline_keyboard: inlineKeyboard
  }
});
