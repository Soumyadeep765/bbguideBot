/*CMD
  command: /admin
  help: 
  need_reply: false
  auto_retry_time: 
  folder: setup

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: /setup
  group: 
CMD*/

if(!ADMINS.includes(user.telegramid)) return;

 let inlineKeyboard = [
    [
      { text: "Update Lessons", callback_data: "/setupLesson" },
      { text: "Update Tasks", callback_data: "/setupTasks"}
    ],
    [
      { text: "Update Bot Meta", callback_data: "/setupMeta" },
      { text: "Update Final Tests", callback_data: "/setupFinalTask" }
    ]
  ];
  let adminText = `Welcome to admin panel choose what you want to do`
  Api.sendMessage({
  text: adminText,
  parse_mode: "html",
  reply_markup: {
    inline_keyboard: inlineKeyboard
  }
});
