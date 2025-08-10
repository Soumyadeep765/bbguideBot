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

//keep it blank for silent error fallback , good for production use

//uncommont this below line for sending alert to admin
/*
let text = "Oops! Something went wrong 🥵\n\nPlease check the error tab to understand and resolve the issue.";
Api.sendMessage({
  text : text,
  chat_id: ADMIN_IDS[0]
})*/
