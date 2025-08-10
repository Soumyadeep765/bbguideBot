/*CMD
  command: /setupTasks
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
let url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${TASK_GID}`

HTTP.get({
  url, 
  success: "/saveTasks", //callback command 
   folow_redirects: true
  })
