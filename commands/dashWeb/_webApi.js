/*CMD
  command: /webApi
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

// an json API to serve data to the Webapp 
//works with webhoook , this webhoook genarates in /start:17
let leaderboard = TopBoardLib.getBoard("reward");
let data = { 
  "currency": reward_currency, 
  "value": user_reward,
  leaderboard
  }

WebApp.render({
  content: data,
  mime_type: "application/json"
})
