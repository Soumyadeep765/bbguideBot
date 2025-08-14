/*CMD
  command: /startTest
  help: 
  need_reply: false
  auto_retry_time: 
  folder: tasks

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// /startTest command handler
let lessonId = params;
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
  // Build question text with numbered options
  let text = `📝 *Question ${index + 1} of ${tasks.length}*\n\n${q.question}\n\n`;
  
  q.answers.forEach((ans, i) => {
    text += `${i + 1}. ${ans}\n`; // Adds "1. Option" to the question text
  });

  // Build buttons with numbered prefix
  let keyboard = { inline_keyboard: [] };
  q.answers.forEach((ans, i) => {
    let optionNumber = i + 1;
    keyboard.inline_keyboard.push([
      { 
        text: `${optionNumber} - ${ans}`, 
        callback_data: `/answerTest ${lessonId}:${index}:${i}` 
      }
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
