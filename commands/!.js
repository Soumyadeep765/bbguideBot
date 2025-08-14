/*CMD
  command: !
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

// keep it blank for silent error fallback , good for production use

// uncomment this block for sending alert to all admins
/*
let text = "Oops! Something went wrong 🥵\n\nPlease check the error tab to understand and resolve the issue.";

// Loop through all admin IDs and send alert
ADMIN_IDS.forEach(adminId => {
  Api.sendMessage({
    text: text,
    chat_id: adminId
  });
});
*/
