/*CMD
  command: /nextTest
  help: 
  need_reply: false
  auto_retry_time: 
  folder: lessons

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// /nextTest command handler
let [lessonId, indexStr] = params.split(":");
let index = parseInt(indexStr);

let tasks = Bot.getProp(`task:${lessonId}`);
if (!tasks || !tasks[index]) return;

let text = `📝 *Question ${index + 1} of ${tasks.length}*\n\n${tasks[index].question}`;
let keyboard = { inline_keyboard: [] };

tasks[index].answers.forEach((ans, i) => {
  keyboard.inline_keyboard.push([
    { text: ans, callback_data: `/answerTest ${lessonId}:${index}:${i}` }
  ]);
});

Api.editMessageText({
  chat_id: chat.chatId,
  message_id: request.message.message_id,
  text: text,
  parse_mode: "Markdown",
  reply_markup: keyboard
});
