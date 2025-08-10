/*CMD
  command: /startTest
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

// /startTest command handler
let lessonId = params.trim();
if (!lessonId) {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "❌ Lesson ID missing.",
    show_alert: true
  });
  return;
}

let tasks = Bot.getProp(`task:${lessonId}`);
if (!tasks || !tasks.length) {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "❌ No test found for this lesson.",
    show_alert: true
  });
  return;
}

// Save test progress
User.setProp("current_test", {
  lessonId: lessonId,
  currentIndex: 0,
  score: 0
});

// Show first question
showQuestion(tasks[0], lessonId, 0);

// --- Helper ---
function showQuestion(q, lessonId, index) {
  let text = `📝 *Question ${index + 1} of ${tasks.length}*\n\n${q.question}`;
  let keyboard = { inline_keyboard: [] };

  q.answers.forEach((ans, i) => {
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
}
