/*CMD
  command: /saveMeta
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

function parseMeta(csv) {
  const lines = csv.trim().split(/\r?\n/); // split lines by \r\n or \n
  const result = {};

  for (const line of lines) {
    const [key, value] = line.split(",");
    result[key] = isNaN(value) ? value : Number(value);
  }

  return result;
}
//Bot.inspect(parseMeta(content))
let parsed = parseMeta(content); //returns an json object 
Bot.setProp("botMeta", parsed)
Bot.sendMessage("✅ Bot Meta updated")
