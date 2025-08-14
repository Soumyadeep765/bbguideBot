/*CMD
  command: /nextLesson
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


let lessonId = params;
let nextLessonId = getNextLessonId(lessonId);
if (!lessonId) {
  Api.answerCallbackQuery({
    callback_query_id: request.id,
    text: "❌ Lesson ID missing.",
    show_alert: true
  });
  return;
}
if(nextLessonId){
// Save the next lesson as ongoing lesson now
User.setProp("current_ongoing_lesson", nextLessonId);

Api.editMessageText({
  chat_id: chat.chatId,
  message_id: request.message.message_id,
  text: `🚀 Starting *Lesson ${lessonId}* now! Good luck!`,
  parse_mode: "Markdown",
});

// Optionally trigger the first step immediately:
Bot.runCommand(`/startLesson`);
} else {
User.setProp("lesson_completed_with", lessonId) //for marked that user have completed the last lesson, abd track last 8d to
Api.editMessageText({
  chat_id: chat.chatId,
  message_id: request.message.message_id,
  text: `🎉 You have completed *all lessons*! 🎉\n\nGreat job on your progress! 🙂😁`,
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [
      [{ text: "⬅ Back to Home", callback_data: "/start" }]
    ]
  }
});
}
