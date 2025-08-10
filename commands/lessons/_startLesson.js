/*CMD
  command: /startLesson
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

let current_lesson = User.getProp("current_ongoing_lesson");

if (!current_lesson || !user_started_learning) {
  current_lesson = "L1"; // Entry point
  User.setProp("user_started_learning", true);
  User.setProp("current_ongoing_lesson", current_lesson);
}
if(params){
  current_lesson = params
}
let lesson = Bot.getProp(current_lesson);

if (!lesson) {
  Api.sendMessage({ text: "❌ Lesson not found." });
  return;
}

// --- Helper: Generate Lesson Text ---
function formatLessonText(lesson) {
  let title = lesson.id.replace("L", "Lesson ");
  let description = lesson.description || "No description available.";
  return `📚 *${title} — ${lesson.name}*\n\n${description}`;
}

// --- Helper: Build Keyboard ---
function buildKeyboard(buttons) {
  return { inline_keyboard: buttons };
}

// Step ID always starts at 1
let stepId = 1;

// Default keyboard layout
let defaultButtons = [
  [{ text: "📖 Learn how", callback_data: `/LessonSteps ${current_lesson}:${stepId}` }],
  [{ text: "⬅ Back to Home", callback_data: "/start" }]
];

// Format text
let lessonText = formatLessonText(lesson);
let previousHasPhoto = request.message?.photo?.length > 0;
  if (previousHasPhoto) {
    // Only case where we need to delete and resend (photo → text)
    Api.deleteMessage({ chat_id: chat.chatId, message_id: request.message.message_id });
    Api.sendMessage({
      chat_id: chat.chatId,
      text: lessonText,
      parse_mode: "Markdown",
      reply_markup: buildKeyboard(defaultButtons),
    });
  } else {
// Edit message with dynamic keyboard
Api.editMessageText({
  chat_id: chat.chatId,
  message_id: request.message.message_id,
  text: lessonText,
  parse_mode: "Markdown",
  reply_markup: buildKeyboard(defaultButtons)
});
}
