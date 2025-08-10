/*CMD
  command: /answerTest
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

// /answerTest command handler
let [lessonId, indexStr, ansIndexStr] = params.split(":");
let index = parseInt(indexStr);
let ansIndex = parseInt(ansIndexStr);

let testData = User.getProp("current_test");
if (!testData || testData.lessonId !== lessonId) {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "❌ Test not started.",
    show_alert: true
  });
  return;
}

let tasks = Bot.getProp(`task:${lessonId}`);
let q = tasks[index];
let isCorrect = (q.correct_index - 1) === ansIndex; // because correct_index is 1-based

// Update score
if (isCorrect) testData.score++;

// Save state
User.setProp("current_test", testData);

// Build feedback text
let feedback = isCorrect
  ? "✅ *Correct!* 🎉"
  : `❌ *Incorrect!*\nThe correct answer is: *${q.answers[q.correct_index - 1]}*`;

let text = `📝 *Question ${index + 1} of ${tasks.length}*\n\n${q.question}\n\n${feedback}`;
let keyboard = { inline_keyboard: [] };

// If more questions, show "Next" button
if (index + 1 < tasks.length) {
  keyboard.inline_keyboard.push([
    { text: "➡ Next Question", callback_data: `/nextTest ${lessonId}:${index + 1}` }
  ]);
} else {
  keyboard.inline_keyboard.push([
    { text: "✅ Finish Test", callback_data: `/finishTest ${lessonId}` }
  ]);
}

Api.editMessageText({
  chat_id: chat.chatId,
  message_id: request.message.message_id,
  text: text,
  parse_mode: "Markdown",
  reply_markup: keyboard
});
