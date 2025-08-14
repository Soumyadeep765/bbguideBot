/*CMD
  command: /help
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

// /help command

let botMeta = Bot.getProp("botMeta") || {
  version: 1,
  template_version: 1,
  lang: "en",
  updated_at: "Unknown"
};

let helpText = `🤖 <b>BB GuideBot Help</b>

Welcome! I’m here to guide you through building Telegram bots using <b>BJS (Bot JavaScript)</b>.

<b>Bot Info:</b>
• Version: ${botMeta.version}
• Template Version: ${botMeta.template_version}
• Language: ${botMeta.lang.toUpperCase()}
• Last Updated: ${botMeta.updated_at}

<b>Commands you can use:</b>
/start – Start or continue lessons
/lessons – View all lessons
/leaderboard – See rankings
/help – Show this help menu

💡 Tip: Every command is a step closer to mastery!`;

Api.sendMessage({
  chat_id: chat.chatId,
  text: helpText,
  parse_mode: "html",
  reply_markup: {
    inline_keyboard: [
      [
        { text: "📚 BB Help Docs", url: "https://help.bots.business/" }
      ],
      [
        { text: "🌐 Bot Business", url: "https://app.bots.business/" }
      ],
      [
       { text: "GitHub Repo", url: "https://github.com/Soumyadeep765/bbguideBot/" }
      ]
    ]
  }
});
