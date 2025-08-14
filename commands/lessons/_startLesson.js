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
  aliases: /lessons
  group: 
CMD*/

let current_lesson = User.getProp("current_ongoing_lesson");
let lesson_completed_with = User.getProp("lesson_completed_with");

// If no current lesson or first time learning, set entry point
if (!current_lesson) {
  current_lesson = "L1"; // Entry point
  User.setProp("current_ongoing_lesson", current_lesson);
}

// If params were passed, override current lesson
if (params) {
  current_lesson = params;
}

// Helper: chunk array into smaller arrays of given size
function chunkArray(arr, size) {
  let result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// If user completed all lessons and is not requesting a specific lesson
if ((lesson_completed_with && !params) && lesson_completed_with === getLastLessonId()) {
  let allLessons = Bot.getProp("all_lesson") || [];

  let lessonButtons = allLessons.map(id => ({
    text: id.replace(/^L/, "Lesson "),
    callback_data: `/startLesson ${id}`
  }));

  let keyboard = {
    inline_keyboard: [
      ...chunkArray(lessonButtons, 2),
      [{ text: "Back to Home 🔙", callback_data: "/start" }]
    ]
  };

  if (request?.data) {
    Api.editMessageText({
      chat_id: chat.chatId,
      message_id: request.message.message_id,
      text: "✅ You have completed all lessons!\n\nWant to retake any lesson? 🤔 Just pick one below:",
      parse_mode: "Markdown",
      reply_markup: keyboard
    });
  } else {
    Api.sendMessage({
      chat_id: chat.chatId,
      text: "✅ You have completed all lessons!\n\nWant to retake any lesson? 🤔 Just pick one below:",
      parse_mode: "Markdown",
      reply_markup: keyboard
    });
  }
  return;
}

let lesson = Bot.getProp(current_lesson);
if (!lesson) {
  Api.sendMessage({ text: "❌ Lesson not found." });
  return;
}

// Helper: Format lesson text
function formatLessonText(lesson) {
  let title = lesson.id.replace("L", "Lesson ");
  let description = lesson.description || "No description available.";
  return `📚 *${title} — ${lesson.name}*\n\n${description}`;
}

// Step ID always starts at 1
let stepId = 1;
let lessonText = formatLessonText(lesson);

let defaultButtons = [
  [{ text: "📖 Learn how", callback_data: `/LessonSteps ${current_lesson}:${stepId}` }],
  [{ text: "⬅ Back to Home", callback_data: "/start" }]
];

// Detect if we are in callback or command mode
if (request?.data) {
  let previousHasPhoto = request.message?.photo?.length > 0;
  if (previousHasPhoto) {
    Api.deleteMessage({ chat_id: chat.chatId, message_id: request.message.message_id });
    Api.sendMessage({
      chat_id: chat.chatId,
      text: lessonText,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: defaultButtons }
    });
  } else {
    Api.editMessageText({
      chat_id: chat.chatId,
      message_id: request.message.message_id,
      text: lessonText,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: defaultButtons }
    });
  }
} else {
  Api.sendMessage({
    chat_id: chat.chatId,
    text: lessonText,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: defaultButtons }
  });
}
