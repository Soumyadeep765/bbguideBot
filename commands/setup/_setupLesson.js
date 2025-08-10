/*CMD
  command: /setupLesson
  help: 
  need_reply: false
  auto_retry_time: 
  folder: setup

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if(!ADMINS.includes(user.telegramid)) return;

// set SHEET_ID in @ command 
let url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`

HTTP.get({
  url, 
  success: "/saveLesson", //callback command 
   folow_redirects: true
  })
